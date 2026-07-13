import { Entity, World } from "@rbxts/jecs";
import { Document } from "@rbxts/lapis";
import { func, table } from "shared/logic/logictypes";
import { UserData } from "shared/networktypes";

export default class<DataType extends table> {
	constructor(
		// Required data for logic
		private world: World,
		private UserDataComponent: Entity<DataType>,

		private PlayerToEntity: Map<Player, Entity>,
		private EntityToPlayer: Map<Entity, Player>,

		private PlayerDataEvent: { fire: func },

		private Collection?: table,
	) {}

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
	private fireDataEvent(player: Player, data: DataType) {
		this.PlayerDataEvent.fire(player, data);
	}

	/** Returns the collection, warns if it wasn't created yet */
	private getCollection() {
		if (!this.Collection) error("Create the Collection first!");
		return this.Collection;
		// TODO: finish creating collection, also other plug in methods of dataservice
		// fully update dataservice to only connect
	}

	// PUBLIC LOGIC

	/** Returns player's data */
	public getPlayerData(player: Player) {
		const entity = this.getPlayerEntity(player);

		if (entity) {
			return this.world.get(entity, this.UserDataComponent);
		}
	}

	/** Sets player's data to data */
	public setPlayerData(player: Player, data: DataType) {
		const entity = this.getPlayerEntity(player);

		if (entity) {
			this.world.set(entity, this.UserDataComponent, data);
		}
	}

	// PLUG-IN CONSTRUCTS

	/** Removes the player's data from maps and state */
	public PlayerUnloaded(player: Player) {
		const entity = this.getPlayerEntity(player);

		if (entity) {
			this.PlayerToEntity.delete(player);
			this.EntityToPlayer.delete(entity);
			this.world.delete(entity);
		}
	}

	/** Creates player entity, adds data, sends it to the client */
	public PlayerLoaded(player: Player, ses: Document<DataType>) {
		// maps are needed for availability of both, player and their entity
		this.createPlayerEntity(player);

		// source of truth is the player's component
		// player's session is up to date with their component
		const data = ses.read();
		this.setPlayerData(player, data);

		this.fireDataEvent(player, data);
	}
}
