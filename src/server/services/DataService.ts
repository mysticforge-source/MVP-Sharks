/*
 * manages player data loading, saving and ecs entity mapping
 * uses lapis for datastores and maps players to jecs entities
 */

import { IngameDataEvent, PlayerDataEvent, SharkSlot, UserData } from "server/network/server";
import { serverMaid } from "server/servermaid";
import { UserDataComponent } from "shared/ecs/components";
import { World } from "shared/ecs/world";

import { OnStart, Service } from "@flamework/core";
import { Entity } from "@rbxts/jecs";
import { createCollection, Document } from "@rbxts/lapis";
import { Players } from "@rbxts/services";
import { t } from "@rbxts/t";
import { merge } from "@rbxts/sift/out/Dictionary";
import { PlayComponent, SystemHelperComponent, SystemHelperData } from "server/components";
import Sift from "@rbxts/sift";

const defaultSharkSlotData: SharkSlot = {
	shark: 0,
	dead: false,

	hp: 100,
	maxhp: 100,

	hunger: 100,
	maxhunger: 100,

	exp: 0,
	maxexp: 100,

	upgrade: 0,
	level: 0,
};

export const defaultUserData: UserData = {
	coins: 0,
	sharkcoins: 0,
	revivetokens: 0,
	slots: [defaultSharkSlotData, defaultSharkSlotData, defaultSharkSlotData],
};

const validateSharkSlot = t.interface({
	shark: t.numberConstrained(0, 255),
	dead: t.boolean,

	hp: t.numberConstrained(0, 100),
	maxhp: t.numberConstrained(0, 100),

	hunger: t.numberConstrained(0, 100),
	maxhunger: t.numberConstrained(0, 100),

	exp: t.numberConstrained(0, 100),
	maxexp: t.numberConstrained(0, 100),

	upgrade: t.numberConstrained(0, 2),
	level: t.numberConstrained(0, 255),
});

export const validateUserData = t.interface({
	coins: t.numberConstrained(0, 100_000),
	sharkcoins: t.numberConstrained(0, 65_535),
	revivetokens: t.numberConstrained(0, 255),
	slots: t.strictArray(validateSharkSlot, validateSharkSlot, validateSharkSlot),
});

export const PlayerToEntity = new Map<Player, Entity>(); // entity state of this player
export const EntityToPlayer = new Map<Entity, Player>(); // player owner of this entity

export const PlayerToGameSlot = new Map<Player, number>(); // slot number of this spawned player

@Service()
export class DataService implements OnStart {
	protected Collection = createCollection<UserData>("PROD_PlayerData", {
		defaultData: defaultUserData,
		validate: validateUserData,
		migrations: [
			// TEST
			(data) => {
				return defaultUserData;
			},
		],
	});
	protected Sessions = new Map<Player, Document<UserData, true>>();
	protected maid = serverMaid.sub();

	// loads the session and adds it to sessions
	private async PlayerAdded(player: Player) {
		this.Collection.load(`User${player.UserId}`, [player.UserId])
			.then(async (ses) => {
				// player could leave while it was loading
				if (!player.Parent) {
					ses.close().catch(warn);
					return;
				}

				// player loaded

				// TESTING
				//ses.write(defaultUserData);

				// we need player's session for long term use
				this.Sessions.set(player, ses);

				// maps are needed for availability of both, player and their entity
				const entity = World.entity();
				PlayerToEntity.set(player, entity);
				EntityToPlayer.set(entity, player);

				// source of truth is the player's component
				const data = ses.read();
				warn(data);
				World.set(entity, UserDataComponent, data);

				PlayerDataEvent.fire(player, data);
			})
			.catch(async (err) => {
				player.Kick(`Failed to load data: ${tostring(err)}`);
			});
	}

	// closes the session and deletes it from sessions
	private async PlayerRemoving(player: Player) {
		const ses = this.Sessions.get(player);
		if (ses) {
			// SAVE UNSAVED DATA
			// 1. player left in-game
			const ingameData = this.getPlayerIngameData(player);
			const slot = PlayerToGameSlot.get(player);
			if (ingameData && slot !== undefined) {
				this.changeSlotData(player, slot, ingameData);
			} else if (ingameData) {
				warn(`NO SLOT ASSIGNED FOR PLAYER ${player.Name} - LOST IN-GAME DATA`);
			}

			// 2. save all data
			const entity = PlayerToEntity.get(player);
			if (entity) {
				const data = World.get(entity, UserDataComponent);
				if (data) {
					ses.write(data);
				}
			}

			ses.close()
				.then(async () => {
					if (entity) {
						PlayerToEntity.delete(player);
						EntityToPlayer.delete(entity);
						PlayerToGameSlot.delete(player);
						World.delete(entity);
					}
					this.Sessions.delete(player);
				})
				.catch(async (err) =>
					warn(`Failed to remove player session data: ${tostring(err)}`),
				);
		}
	}

	// TODO: RegisterPlayer, spawn and connect to playerdata changes, give components

	// Spawns player data and binds to datastore, returns true/false
	public RegisterSpawnPlayer(player: Player, slot: number): boolean {
		// set in maps
		warn("SLOT REGISTERED:", slot);
		PlayerToGameSlot.set(player, slot);
		warn("SLOT DATA:", this.getPlayerData(player)!.slots);

		// give ingame data
		const entity = PlayerToEntity.get(player);
		if (!entity) {
			return false;
		}

		const data = World.get(entity, UserDataComponent);
		if (!data) {
			return false;
		}

		World.set(entity, PlayComponent, data.slots[slot - 1]); //minus 1 because of rbxts
		if (data.slots[slot - 1].dead) {
			//cannot spawn a dead slot!
			player.Kick("Attempt to spawn a dead slot");
			return false;
		}

		World.set(entity, SystemHelperComponent, SystemHelperData);

		// update the player
		IngameDataEvent.fire(player, data.slots[slot - 1]);

		return true;
	}

	public UnregisterSpawnPlayer(player: Player): void {
		const slot = PlayerToGameSlot.get(player);
		PlayerToGameSlot.delete(player);

		// save remaining data
		const entity = PlayerToEntity.get(player);
		if (entity) {
			const data = World.get(entity, PlayComponent);
			if (data && slot) {
				this.changeSlotData(player, slot, data);
				IngameDataEvent.fire(player, data);
			}

			// delete state
			World.remove(entity, PlayComponent);
			World.remove(entity, SystemHelperComponent);
		}
	}

	// returns player's entity data
	public getPlayerData(player: Player): UserData | undefined {
		const entity = PlayerToEntity.get(player);
		if (!entity) return;

		const data = World.get(entity, UserDataComponent);
		if (!data) return;

		return data;
	}

	/** returns player's ingame slot data or false if player not ingame */
	public getPlayerIngameData(player: Player): SharkSlot | false {
		const entity = PlayerToEntity.get(player);
		if (!entity) return false;

		const data = World.get(entity, PlayComponent);
		if (!data) return false;
		return data;
	}

	// changes player's data
	public changePlayerData(player: Player, data: Partial<UserData>): void {
		const entity = PlayerToEntity.get(player);
		if (!entity) return;

		const olddata = World.get(entity, UserDataComponent);
		if (!olddata) return;

		World.set(entity, UserDataComponent, merge(olddata, data));
	}

	public changeSlotData(player: Player, slot: number, data: SharkSlot): void {
		const entity = PlayerToEntity.get(player);
		if (!entity) return;

		// clone table to avoid direct mutation
		const olddata = World.get(entity, UserDataComponent)!;

		const newdata = {
			...olddata,
			slots: {
				...olddata.slots,
				[slot]: data,
			},
		};

		World.set(entity, UserDataComponent, newdata as UserData);
	}

	// connects to playeradded, playerremoving and updates session on data changes
	public onStart(): void {
		this.maid.on(Players.PlayerAdded, async (Player) => await this.PlayerAdded(Player));
		this.maid.on(Players.PlayerRemoving, async (Player) => await this.PlayerRemoving(Player));

		// incase some players joined before the service started
		for (const plr of Players.GetPlayers()) this.PlayerAdded(plr);

		// connects to changes of player entities, updates session and calls sync event
		this.maid.add(
			World.changed(UserDataComponent, (entity: Entity, id, value: UserData) => {
				const player = EntityToPlayer.get(entity);
				if (!player) {
					warn("change in data of a player not stored in maps");
					return;
				}

				const ses = this.Sessions.get(player);
				if (!ses) {
					warn("change in data of a player without a stored session");
					return;
				}

				// new data is stored in lapis via this session
				ses.write(value);
				PlayerDataEvent.fire(player, value);
			}),
		);
	}
}
