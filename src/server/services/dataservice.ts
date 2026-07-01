import { PlayerDataEvent, UserData } from "server/network/server";
import { serverMaid } from "server/servermaid";
import { defaultSharkSlotData } from "shared/data";
import { UserDataComponent } from "shared/ecs/components";
import { World } from "shared/ecs/world";

import { OnStart, Service } from "@flamework/core";
import { Entity } from "@rbxts/jecs";
import { createCollection, Document } from "@rbxts/lapis";
import { Players } from "@rbxts/services";
import { t } from "@rbxts/t";

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

// player --> entity map
export const PlayerToEntity = new Map<Player, Entity>();

// entity --> player map
export const EntityToPlayer = new Map<Entity, Player>();

@Service()
export class DataService implements OnStart {
	protected Collection = createCollection<UserData>("PROD_PlayerDataEvent", {
		defaultData: defaultUserData,
		validate: validateUserData,
		// migrations: [
		//     old => {
		//         old.key = 10;
		//         return old
		//     } //v0 -> v1
		// ]
	});
	protected Sessions = new Map<Player, Document<UserData, true>>();
	protected maid = serverMaid.sub();

	// private methods

	// Creates player entity, sets it in the Player-Entity maps and gives it the UserDataComponent
	private async PlayerLoaded(player: Player, ses: Document<UserData>) {
		// player entity
		const entity = World.entity();
		PlayerToEntity.set(player, entity);
		EntityToPlayer.set(entity, player);

		// sets component to session data (validated by Lapis via validateUserData)
		const data = ses.read();
		World.set(entity, UserDataComponent, data);

		// send to client
		PlayerDataEvent.fire(player, data);
	}

	// Removes Player and Entity from both Player-Entity maps
	private async PlayerUnloaded(player: Player, ses: Document<UserData>) {
		const entity = PlayerToEntity.get(player);

		if (entity) {
			PlayerToEntity.delete(player);
			EntityToPlayer.delete(entity);
		}
	}

	// Loads the session, adds it to Sessions
	private async PlayerAdded(player: Player) {
		this.Collection.load(`User${player.UserId}`, [player.UserId])
			.then(async (ses) => {
				if (!player.Parent) {
					ses.close().catch(warn);
					return;
				}

				this.Sessions.set(player, ses);
				await this.PlayerLoaded(player, ses);
			})
			.catch(async (err) => {
				player.Kick(`Failed to load data: ${tostring(err)}`);
			});
	}

	// Closes the session and deletes it from Sessions
	private async PlayerRemoving(player: Player) {
		const ses = this.Sessions.get(player);
		if (ses) {
			ses.close()
				.then(async () => {
					await this.PlayerUnloaded(player, ses);
					this.Sessions.delete(player);
				})
				.catch(async (err) => warn(`Failed to remove player session data: ${tostring(err)}`));
		}
	}

	// hooks

	public onStart(): void {
		this.maid.on(Players.PlayerAdded, async (Player) => await this.PlayerAdded(Player));
		this.maid.on(Players.PlayerRemoving, async (Player) => await this.PlayerRemoving(Player));

		for (const plr of Players.GetPlayers()) this.PlayerAdded(plr);

		// Connects to changes of player entities, updates session and calls sync event with the player
		this.maid.Add(
			World.changed(UserDataComponent, (entity: Entity, id, value: UserData) => {
				const player = EntityToPlayer.get(entity);
				if (!player) {
					warn("Change occured within data of a player not stored in EntityToPlayer maps");
					return;
				}

				const ses = this.Sessions.get(player);
				if (!ses) {
					warn("Change occured within data of a player without a stored session!");
					return;
				}

				ses.write(value);
				PlayerDataEvent.fire(player, value);
			}),
		);
	}
}
