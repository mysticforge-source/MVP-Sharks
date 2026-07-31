/*
 * manages player data loading, saving and ecs entity mapping
 * uses lapis for datastores and maps players to jecs entities
 */

import { PlayerDataEvent, SharkSlot, UserData } from "server/network/server";
import { serverMaid } from "server/servermaid";
import { UserDataComponent } from "shared/ecs/components";
import { World } from "shared/ecs/world";

import { OnStart, Service } from "@flamework/core";
import { Entity } from "@rbxts/jecs";
import { createCollection, Document } from "@rbxts/lapis";
import { Players } from "@rbxts/services";
import { t } from "@rbxts/t";
import { merge } from "@rbxts/sift/out/Dictionary";

const defaultSharkSlotData: SharkSlot = {
	shark: 0,
	dead: false,
	hunger: 0,
	exp: 0,
	upgrade: 0,
	level: 0,
};

export const defaultUserData: UserData = {
	coins: 0,
	gems: 0,
	revivetokens: 0,
	slots: [defaultSharkSlotData, defaultSharkSlotData, defaultSharkSlotData],
};

const validateSharkSlot = t.interface({
	shark: t.numberConstrained(0, 255),
	dead: t.boolean,
	hunger: t.numberConstrained(0, 100),
	exp: t.numberConstrained(0, 100),
	upgrade: t.numberConstrained(0, 2),
	level: t.numberConstrained(0, 255),
});

export const validateUserData = t.interface({
	coins: t.numberConstrained(0, 100_000),
	gems: t.numberConstrained(0, 65_535),
	revivetokens: t.numberConstrained(0, 255),
	slots: t.strictArray(validateSharkSlot, validateSharkSlot, validateSharkSlot),
});

export const PlayerToEntity = new Map<Player, Entity>(); // entity state of this player
export const EntityToPlayer = new Map<Entity, Player>(); // player owner of this entity

@Service()
export class DataService implements OnStart {
	protected Collection = createCollection<UserData>("PROD_PlayerDataEvent", {
		defaultData: defaultUserData,
		validate: validateUserData,
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

				// we need player's session for long term use
				this.Sessions.set(player, ses);

				// maps are needed for availability of both, player and their entity
				const entity = World.entity();
				PlayerToEntity.set(player, entity);
				EntityToPlayer.set(entity, player);

				// source of truth is the player's component
				const data = ses.read();
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
			ses.close()
				.then(async () => {
					const entity = PlayerToEntity.get(player);

					if (entity) {
						PlayerToEntity.delete(player);
						EntityToPlayer.delete(entity);
						World.delete(entity);
					}
					this.Sessions.delete(player);
				})
				.catch(async (err) =>
					warn(`Failed to remove player session data: ${tostring(err)}`),
				);
		}
	}

	// returns player's entity data
	public getPlayerData(player: Player): UserData | false {
		const entity = PlayerToEntity.get(player);
		if (!entity) return false;

		const data = World.get(entity, UserDataComponent);
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
