/*
 * creates and manages player hitboxes with server authority
 * clones input templates, registers in simulation loop, handles cleanup
 */

import { OnStart, Service } from "@flamework/core";
import { Players, ServerStorage, Workspace } from "@rbxts/services";
import { DataService, PlayerToEntity } from "./DataService";
import { npccatalog, sharkcatalog } from "shared/data";
import { World } from "shared/ecs/world";
import { HitboxComponent } from "shared/ecs/components";
import { RegisterPlayer, UnregisterPlayer, DestroyHitbox } from "shared/logic/GameSimulation";
import { serverMaid } from "server/servermaid";
import { getSize } from "shared/utils/ageLevel";
import { PlaySlot, SpawnResult, SpawnSlot } from "server/network/server";
import { Entity } from "@rbxts/jecs";
import { NPC_Data } from "server/components";

export const HitboxToPlayer = new Map<MeshPart, Player>();
export const PlayerToHitbox = new Map<Player, MeshPart>();

/** A set of all existing NPC entities with data each */
export const NPCEntities = new Set<Entity>();
export const NPC_HitboxToEntity = new Map<MeshPart, Entity>();
export const NPC_EntityToHitbox = new Map<
	Entity,
	MeshPart & { LinearVelocity: LinearVelocity; AlignOrientation: AlignOrientation }
>();

@Service()
export class HitboxService implements OnStart {
	private maid = serverMaid.sub();

	constructor(private readonly dataservice: DataService) {}

	onStart(): void | Promise<void> {
		/* clean up hitboxes when players leave */
		this.maid.on(Players.PlayerRemoving, (player) => {
			this.destroyPlayerHitbox(player);
		});

		// Handle player spawns
		this.maid.add(
			// Enter the game
			PlaySlot.on((player: Player, slot) => {
				const data = this.dataservice.getPlayerData(player);
				if (!data) return "Fail";

				// fail if player already in-game
				if (this.dataservice.getPlayerIngameData(player)) return "Fail";

				if (!this.dataservice.RegisterSpawnPlayer(player, slot)) return "Fail";

				const shark = data.slots[slot - 1].shark;

				const hitbox = this.createPlayerHitbox(player, shark);
				if (!hitbox) return "Fail";

				// assign the player play data
				const entity = PlayerToEntity.get(player);
				if (!entity) {
					this.destroyPlayerHitbox(player);
					return "Fail";
				}

				SpawnResult.fire(player);
			}),
		);

		this.maid.add(
			// Create slot and enter the game
			SpawnSlot.on((player: Player, { slot, shark }) => {
				const data = this.dataservice.getPlayerData(player);
				if (!data) return "Fail";

				// fail if player already in-game
				if (this.dataservice.getPlayerIngameData(player)) return "Fail";

				warn("SPAWNSLOT GOT", slot);

				if (!this.dataservice.CreateSlot(player, slot, shark)) return "Fail";

				if (!this.dataservice.RegisterSpawnPlayer(player, slot)) return "Fail";

				const hitbox = this.createPlayerHitbox(player, shark);
				if (!hitbox) return "Fail";

				// assign the player play data
				const entity = PlayerToEntity.get(player);
				if (!entity) {
					this.destroyPlayerHitbox(player);
					return "Fail";
				}

				SpawnResult.fire(player);
			}),
		);
	}

	/*
	 * destroys player hitbox and cleans up state
	 */
	public destroyPlayerHitbox(player: Player): void {
		const entity = PlayerToEntity.get(player);
		if (entity) {
			const hitbox = World.get(entity, HitboxComponent);
			if (hitbox) {
				UnregisterPlayer(player);
				DestroyHitbox(hitbox);
				hitbox.Destroy();
				World.remove(entity, HitboxComponent);
			}
		}

		// clean up cloned input folder
		const inputFolder = player.FindFirstChild("Input");
		if (inputFolder) {
			inputFolder.Destroy();
		}
	}

	public resizeHitbox(hitbox: MeshPart, shark: number, level: number): void {
		const sharkData = sharkcatalog[shark];

		const size = getSize(
			shark,
			level,
			ServerStorage.Hitboxes.FindFirstChild(sharkData.name) as MeshPart,
		);
		hitbox.Size = size;
		(hitbox as MeshPart & { AntiGravity: VectorForce }).AntiGravity.Force = new Vector3(
			0,
			hitbox.AssemblyMass * Workspace.Gravity,
			0,
		);
	}

	public getSharkIdFromName(name: string) {
		for (const [id, data] of pairs(sharkcatalog)) {
			if (data.name === name) return id;
		}
	}

	/*
	 * clones input template from serverstorage and parents it to the player
	 */
	private cloneInputForPlayer(player: Player): void {
		const inputFolder = ServerStorage.Input.Clone();
		inputFolder.Parent = player;

		const sharkContext = inputFolder.FindFirstChild("SharkContext") as InputContext | undefined;
		if (!sharkContext) {
			warn(`[HitboxService] SharkContext not found in Input template for ${player.Name}`);
			inputFolder.Destroy();
		}
	}

	/* clones a hitbox template from serverstorage */
	public cloneHitbox(
		name: string,
	):
		| (MeshPart & { LinearVelocity: LinearVelocity; AlignOrientation: AlignOrientation })
		| undefined {
		const hitbox = ServerStorage.Hitboxes.FindFirstChild(name) as MeshPart | undefined;

		if (hitbox && hitbox.IsA("MeshPart")) {
			const clone = hitbox.Clone() as MeshPart;
			clone.Transparency = 1;
			clone.Position = new Vector3(0, 35, 0);
			clone.Anchored = false;
			clone.Massless = true;

			clone.CollisionGroup = "Hitbox";

			/* physics constraints */
			clone.Anchored = false;
			const centerAttach = new Instance("Attachment", clone);

			// anti-gravity force
			const antigrav = new Instance("VectorForce");
			antigrav.Name = "AntiGravity";
			antigrav.Force = new Vector3(0, clone.AssemblyMass * Workspace.Gravity, 0);
			antigrav.ApplyAtCenterOfMass = true;
			antigrav.Attachment0 = centerAttach;
			antigrav.RelativeTo = Enum.ActuatorRelativeTo.World;
			antigrav.Parent = clone;

			// camera-aligned rotation
			const alignRotation = new Instance("AlignOrientation");
			alignRotation.Attachment0 = centerAttach;
			alignRotation.Responsiveness = 15;
			alignRotation.Mode = Enum.OrientationAlignmentMode.OneAttachment;
			alignRotation.Parent = clone;
			alignRotation.MaxTorque = math.huge;
			alignRotation.MaxAngularVelocity = 20;

			// linear velocity for movement
			const positionVel = new Instance("LinearVelocity");
			positionVel.Attachment0 = centerAttach;
			positionVel.RelativeTo = Enum.ActuatorRelativeTo.World;
			positionVel.MaxForce = 10000;
			positionVel.VectorVelocity = Vector3.zero;
			positionVel.Parent = clone;

			return clone as MeshPart & {
				LinearVelocity: LinearVelocity;
				AlignOrientation: AlignOrientation;
			};
		}

		return undefined;
	}

	public createNPCHitbox(npc: Entity, location: string): MeshPart | undefined {
		const npcData = World.get(npc, NPC_Data);
		if (!npcData) return undefined;

		const npcInfo = npccatalog[npcData.id];

		try {
			const hitbox = this.cloneHitbox(npcInfo.hitboxname);
			if (!hitbox) return undefined;

			hitbox.CollisionGroup = "NPC_Hitbox";

			hitbox.SetAttribute("ObjectType", "NpcHitbox");
			// used for tracking individual attacks and displaying animations
			hitbox.SetAttribute("AttackAmount", 0);

			hitbox.SetAttribute("NpcId", npcData.id);
			hitbox.SetAttribute("Level", npcInfo.level);

			// hitbox.SetAttribute("Hidden", true);

			// cleanup on destroy
			this.maid.add(
				hitbox.Destroying.Connect(() => {
					DestroyHitbox(hitbox);
					NPC_HitboxToEntity.delete(hitbox);
					// deleting the entity and from entitytohitbox map
					// is done from the deletion place, this configures
					// about the hitbox itself deleting
				}),
			);

			// set in maps
			NPC_EntityToHitbox.set(npc, hitbox);
			NPC_HitboxToEntity.set(hitbox, npc);

			// Configure location position
			const loc = Workspace.Shared.NPC_Locations.FindFirstChild(location) as Part;
			if (!loc)
				error(
					"LOCATION stat for this NPC is configured wrong: no spawn location found with this name",
				);

			hitbox.Position = loc.Position;

			// parent into serverauthority folder
			hitbox.Parent = Workspace.Shared.NPC_Hitboxes;
		} catch (e) {
			warn(
				`[HitboxService] Failed to create hitbox for NPC ${npcData.id} at ${location}: ${e}`,
			);
			return undefined;
		}
	}

	/** creates a player hitbox and registers in simulation. REQUIRES ingame state to be set-up */
	public createPlayerHitbox(player: Player, sharkId: number): MeshPart | undefined {
		const data = this.dataservice.getPlayerData(player);
		if (!data) return undefined;

		const slotdata = this.dataservice.getPlayerIngameData(player);
		if (!slotdata) return undefined;

		const sharkData = sharkcatalog[sharkId];

		try {
			const hitbox = this.cloneHitbox(sharkData.hitboxname);
			if (!hitbox) return undefined;

			// delete old hitbox if exists
			const playerEntity = PlayerToEntity.get(player);
			if (playerEntity) {
				const prevHitbox = World.get(playerEntity, HitboxComponent);
				if (prevHitbox) {
					UnregisterPlayer(player);
					DestroyHitbox(prevHitbox);
					prevHitbox.Destroy();
				}
			}

			// name it for client identification
			hitbox.Name = player.Name;

			// server retains default ownership of all parts in the authority folder

			// write initial attributes
			hitbox.SetAttribute("ObjectType", "PlayerHitbox");
			hitbox.SetAttribute("PlayerId", player.UserId);

			hitbox.SetAttribute("SharkId", sharkId);
			hitbox.SetAttribute("Level", slotdata.level);

			// resize hitbox
			this.resizeHitbox(hitbox, sharkId, slotdata.level);

			// clone input template from serverstorage for this player
			this.cloneInputForPlayer(player);

			// register in centralized simulation
			RegisterPlayer(player, hitbox, sharkId, slotdata.level);

			// parent into serverauthority folder
			hitbox.Parent = Workspace.ServerAuthority;

			// cleanup on destroy
			this.maid.add(
				hitbox.Destroying.Connect(() => {
					UnregisterPlayer(player);
					DestroyHitbox(hitbox);
					HitboxToPlayer.delete(hitbox);
					/* clean up cloned input folder */
					const inputFolder = player.FindFirstChild("Input");
					if (inputFolder) {
						inputFolder.Destroy();
					}
				}),
			);

			// maps for lookups
			HitboxToPlayer.set(hitbox, player);
			PlayerToHitbox.set(player, hitbox);

			// store in ecs
			if (playerEntity) {
				World.set(playerEntity, HitboxComponent, hitbox);
			}

			// set replication focus
			player.ReplicationFocus = hitbox;

			print(`[HitboxService] Spawned hitbox for ${player.Name} (${sharkData.name})`);
			return hitbox;
		} catch (e) {
			warn(`[HitboxService] Failed to create hitbox for ${player.Name}: ${e}`);
			return undefined;
		}
	}
}
