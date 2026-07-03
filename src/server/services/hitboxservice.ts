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
		let hitbox = ReplicatedStorage.Hitboxes.FindFirstChild(name);

		if (hitbox && hitbox.IsA("MeshPart")) {
			hitbox = hitbox.Clone();
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
				const hitbox = this.cloneHitbox(sharkname);

				// delete the old hitbox, get it from player data
				const playerEntity = PlayerToEntity.get(player);
				if (playerEntity) {
					const prevHitbox = World.get(playerEntity, HitboxComponent);
					if (prevHitbox) prevHitbox.Destroy();
				}

				if (hitbox) {
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
