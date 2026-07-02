import { Service } from "@flamework/core";
import { ReplicatedStorage } from "@rbxts/services";

export const PlayerToHitbox = new Map<Player, Instance>();
export const HitboxToPlayer = new Map<Instance, Player>();

@Service()
export class HitboxService {
	// public methods

	public spawnHitbox(name: string) {
		let hitbox: Instance;
	}
}
