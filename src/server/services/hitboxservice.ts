import { Service } from "@flamework/core";
import { ReplicatedStorage, Workspace } from "@rbxts/services";
import { DataService, PlayerToEntity } from "./dataservice";
import { idtoshark } from "shared/data";
import { World } from "shared/ecs/world";
import { HitboxComponent } from "shared/ecs/components";

//export const PlayerToHitbox = new Map<Player, Instance>();
export const HitboxToPlayer = new Map<Instance, Player>();

@Service()
export class HitboxService {
	// public methods

	constructor(private readonly dataservice: DataService) {}

	// clones the hitbox into workspace, does not correlate it with the player
	public cloneHitbox(name: string): Instance | undefined {
		let hitbox = ReplicatedStorage.Hitboxes.FindFirstChild(name) as MeshPart;

		if (hitbox && hitbox.IsA("MeshPart")) {
			hitbox = hitbox.Clone();
			hitbox.Position = new Vector3(0, 15, 0);
			hitbox.Anchored = false;
			hitbox.Massless = true;

			hitbox.Parent = Workspace.Shared.Hitboxes;
		}

		return hitbox;
	}

	/**
	 * assigns the player a hitbox
	 * deletes old hitbox, stores the new hitbox in HitboxComponent
	 * and HitboxToPlayer
	 */
	public createPlayerHitbox(player: Player, sharkname: string): Instance | undefined {
		const data = this.dataservice.getPlayerData(player);

		// getting data may fail
		// getting shark name, id, spawning hitbox can also fail
		if (data)
			try {
				const hitbox = this.cloneHitbox(sharkname) as MeshPart | undefined;

				// delete the old hitbox, get it from player data
				const playerEntity = PlayerToEntity.get(player);
				if (playerEntity) {
					const prevHitbox = World.get(playerEntity, HitboxComponent);
					if (prevHitbox) prevHitbox.Destroy();
				}

				if (hitbox) {
					// so the client could find it
					hitbox.Name = player.Name;

					// so the client could attach the right model
					// HACK: we could use Zap for this, instead of connecting to childAdded
					// and sharing values like this
					const sharkView = new Instance("IntValue");
					sharkView.Value = idtoshark.indexOf(sharkname);
					sharkView.Name = "SharkViewValue";
					sharkView.Parent = hitbox;

					// make it withstand gravity
					hitbox.Anchored = false;
					const centerAttach = new Instance("Attachment", hitbox);

					// TODO: MAKE ATTACHMENTS HERE TO THE ANTICHEATSERVICE
					// EX "TRACK"

					// a force nullifying the gravity force, F = mg
					const antigravforce = new Instance("VectorForce");
					antigravforce.Force = new Vector3(0, hitbox.AssemblyMass * Workspace.Gravity, 0);
					antigravforce.ApplyAtCenterOfMass = true;
					antigravforce.Attachment0 = centerAttach;
					antigravforce.RelativeTo = Enum.ActuatorRelativeTo.World;
					antigravforce.Parent = hitbox;

					// aligning the hitbox with the camera, done in client/systems
					const alignrotation = new Instance("AlignOrientation");
					alignrotation.Attachment0 = centerAttach;
					alignrotation.Responsiveness = 15;
					//alignrotation.MaxTorque = math.huge;
					alignrotation.Mode = Enum.OrientationAlignmentMode.OneAttachment;
					alignrotation.Parent = hitbox;

					// moving the hitbox, done in client/systems
					const positionvel = new Instance("LinearVelocity");
					positionvel.Attachment0 = centerAttach;
					positionvel.RelativeTo = Enum.ActuatorRelativeTo.World;
					positionvel.MaxForce = 5e3; //math.huge;
					positionvel.VectorVelocity = Vector3.zero;
					positionvel.Parent = hitbox;

					// client ownership (observed by anticheatservice)
					hitbox.SetNetworkOwner(player);

					// so we could get player, having hitbox
					// or delete it later, if none
					HitboxToPlayer.set(hitbox, player);

					// so we could get hitbox, having player
					if (playerEntity) World.set(playerEntity, HitboxComponent, hitbox);

					return hitbox;
				}
			} catch (e) {
				warn(e);
			}
	}
}
