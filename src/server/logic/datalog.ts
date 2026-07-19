import { Entity, World } from "@rbxts/jecs";
import { t } from "@rbxts/t";
import { defaultSharkSlotData } from "shared/data";
import { func, table } from "shared/logic/logictypes";
import { mock } from "shared/logic/mocktypes";
import { UserData } from "shared/networktypes";

// Data used by logic
export const data = class {
	datastoreName = "PROD_PlayerData";
	defaultData = {
		coins: 0,
		gems: 0,
		revivetokens: 0,
		slots: [
			defaultSharkSlotData,
			defaultSharkSlotData,
			defaultSharkSlotData,
		],
	};

	validateSharkSlot = t.interface({
		shark: t.numberConstrained(0, 255),
		dead: t.boolean,
		hunger: t.numberConstrained(0, 100),
		exp: t.numberConstrained(0, 100),
		upgrade: t.numberConstrained(0, 2),
		level: t.numberConstrained(0, 255),
	});

	validateUserData = t.interface({
		coins: t.numberConstrained(0, 100_000),
		gems: t.numberConstrained(0, 65_535),
		revivetokens: t.numberConstrained(0, 255),
		slots: t.strictArray(
			this.validateSharkSlot,
			this.validateSharkSlot,
			this.validateSharkSlot,
		),
	});

	migrations: func<UserData>[] = [
		/* v0 -> v1 */
		(old: UserData) => {
			old.coins = 10;
			return old;
		},
	];
};

export default class {
	constructor(
		// Required data for logic
		private world: World,
		private UserDataComponent: Entity<UserData>,

		private PlayerToEntity: Map<Player, Entity>,
		private EntityToPlayer: Map<Entity, Player>,

		private PlayerDataEvent: mock.Event,

		private Lapis: mock.Lapis,

		// Data created by logic
		public Collection = this.Lapis.createCollection(
			this.data.datastoreName,
			{
				defaultData: this.data.defaultData,
				validate: this.data.validateUserData,
				// migrations: this.data.migrations,
			},
		),
		public openSessions = new Map<Player, mock.Document<UserData>>(),
	) {}
	private data = new data();

	// PRIVATE LOGIC

	/** Returns the player's entity */
	private getPlayerEntity(player: Player) {
		return this.PlayerToEntity.get(player);
	}

	/** Creates the player's entity data and adds it to the maps */
	private createPlayerEntity(player: Player) {
		const entity = this.world.entity();
		this.PlayerToEntity.set(player, entity);
		this.EntityToPlayer.set(entity, player);
		return entity;
	}

	/** Sends the data to the player through the data sync event */
	private fireDataEvent(player: Player, data: UserData) {
		this.PlayerDataEvent.fire(player, data);
	}

	// PUBLIC LOGIC

	/** Returns player's data */
	public getPlayerData(player: Player) {
		const entity = this.getPlayerEntity(player);

		if (entity) {
			return this.world.get(entity, this.UserDataComponent);
		}
	}

	/** Returns player's session, if it exists */
	public getPlayerSession(player: Player) {
		return this.openSessions.get(player);
	}

	/** Sets player's data to data, updates the state and fires it to client */
	public setPlayerData(player: Player, data: UserData) {
		const entity = this.getPlayerEntity(player);

		if (entity) {
			this.world.set(entity, this.UserDataComponent, data);
			/** Update it in the session */
			const ses = this.getPlayerSession(player);
			if (ses) {
				ses.write(data);
			} else {
				warn("Player session does not exist");
				// TODO: think about this and renovate dataservice
			}

			/** Fire changes to client */
			this.fireDataEvent(player, data);
		}
	}

	public mutatePlayerData(player: Player, data: UserData) {}

	// PLUG-IN STUFF

	/** Removes the player's data from maps and state */
	public unloadPlayer(player: Player) {
		const entity = this.getPlayerEntity(player);

		if (entity) {
			this.PlayerToEntity.delete(player);
			this.EntityToPlayer.delete(entity);
			this.world.delete(entity);
		}
	}

	/** Creates player entity, adds data, sends it to the client */
	public loadPlayer(player: Player, ses: mock.Document<UserData>) {
		// maps are needed for availability of both, player and their entity
		this.createPlayerEntity(player);

		// source of truth is the player's component
		// player's session is up to date with their component
		const data = ses.read();
		this.setPlayerData(player, data);

		this.fireDataEvent(player, data);
	}
}
