/*
 * creates and manages player hitboxes with server authority
 * clones input templates, registers in simulation loop, handles cleanup
 */

import { OnStart, Service } from "@flamework/core";
import { Players, ServerStorage, Workspace } from "@rbxts/services";
import { DataService, PlayerToEntity } from "./DataService";
import { idtoshark } from "shared/data";
import { World } from "shared/ecs/world";
import { HitboxComponent } from "shared/ecs/components";
import { RegisterPlayer, UnregisterPlayer, DestroyHitbox } from "shared/logic/GameSimulation";
import { serverMaid } from "server/servermaid";
import { getSize } from "shared/utils/ageLevel";

export const HitboxToPlayer = new Map<MeshPart, Player>();
export const PlayerToHitbox = new Map<Player, MeshPart>();

@Service()
export class HitboxService implements OnStart {
	private maid = serverMaid.sub();

	constructor(private readonly dataservice: DataService) {}

	onStart(): void | Promise<void> {
		/* clean up hitboxes when players leave */
		this.maid.on(Players.PlayerRemoving, (player) => {
			this.destroyPlayerHitbox(player);
		});
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
		const size = getSize(
			shark,
			level,
			ServerStorage.Hitboxes.FindFirstChild(idtoshark[shark]) as MeshPart,
		);
		hitbox.Size = size;
		(hitbox as MeshPart & { AntiGravity: VectorForce }).AntiGravity.Force = new Vector3(
			0,
			hitbox.AssemblyMass * Workspace.Gravity,
			0,
		);
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
	private cloneHitbox(name: string): MeshPart | undefined {
		const hitbox = ServerStorage.Hitboxes.FindFirstChild(name) as MeshPart | undefined;

		if (hitbox && hitbox.IsA("MeshPart")) {
			const clone = hitbox.Clone() as MeshPart;
			clone.Transparency = 1;
			clone.Position = new Vector3(0, 35, 0);
			clone.Anchored = false;
			clone.Massless = true;

			// parent into serverauthority folder
			clone.Parent = Workspace.FindFirstChild("ServerAuthority") as Model;
			return clone;
		}

		return undefined;
	}

	/** creates a player hitbox and registers in simulation. REQUIRES ingame state to be set-up */
	public createPlayerHitbox(player: Player, sharkname: string): MeshPart | undefined {
		const data = this.dataservice.getPlayerData(player);
		if (!data) return undefined;

		const slotdata = this.dataservice.getPlayerIngameData(player);
		if (!slotdata) return undefined;

		const sharkId = idtoshark.indexOf(sharkname);

		try {
			const hitbox = this.cloneHitbox(sharkname);
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

			// store shark id for visual model attachment
			const sharkView = new Instance("IntValue");
			sharkView.Value = sharkId;
			sharkView.Name = "SharkViewValue";
			sharkView.Parent = hitbox;

			/* physics constraints */
			hitbox.Anchored = false;
			const centerAttach = new Instance("Attachment", hitbox);

			// anti-gravity force
			const antigrav = new Instance("VectorForce");
			antigrav.Name = "AntiGravity";
			antigrav.Force = new Vector3(0, hitbox.AssemblyMass * Workspace.Gravity, 0);
			antigrav.ApplyAtCenterOfMass = true;
			antigrav.Attachment0 = centerAttach;
			antigrav.RelativeTo = Enum.ActuatorRelativeTo.World;
			antigrav.Parent = hitbox;

			// camera-aligned rotation
			const alignRotation = new Instance("AlignOrientation");
			alignRotation.Attachment0 = centerAttach;
			alignRotation.Responsiveness = 15;
			alignRotation.Mode = Enum.OrientationAlignmentMode.OneAttachment;
			alignRotation.Parent = hitbox;
			alignRotation.MaxTorque = math.huge;
			alignRotation.MaxAngularVelocity = 20;

			// linear velocity for movement
			const positionVel = new Instance("LinearVelocity");
			positionVel.Attachment0 = centerAttach;
			positionVel.RelativeTo = Enum.ActuatorRelativeTo.World;
			positionVel.MaxForce = 5e3;
			positionVel.VectorVelocity = Vector3.zero;
			positionVel.Parent = hitbox;

			// === Server Authority: no SetNetworkOwner calls ===
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

			// cleanup on destroy
			const hitboxMaid = this.maid.sub();
			hitboxMaid.add(
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

			print(`[HitboxService] Spawned hitbox for ${player.Name} (${sharkname})`);
			return hitbox;
		} catch (e) {
			warn(`[HitboxService] Failed to create hitbox for ${player.Name}: ${e}`);
			return undefined;
		}
	}
}
