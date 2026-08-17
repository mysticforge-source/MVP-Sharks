import { PlaySlot, SpawnResult, SpawnSlot } from "server/network/server";
import { serverMaid } from "server/servermaid";

import { OnStart, Service } from "@flamework/core";

import { sharkcatalog } from "shared/data";
import { DataService, PlayerToEntity } from "./DataService";
import { HitboxService } from "./HitboxService";

@Service()
export class SpawnService implements OnStart {
	protected maid = serverMaid.sub();

	public constructor(
		private readonly dataservice: DataService,
		private readonly hitboxservice: HitboxService,
	) {}

	/* connects to the spawn events */
	public onStart(): void {
		this.maid.add(
			// Enter the game
			PlaySlot.on((player: Player, slot) => {
				const data = this.dataservice.getPlayerData(player);
				if (!data) return "Fail";

				// fail if player already in-game
				if (this.dataservice.getPlayerIngameData(player)) return "Fail";

				if (!this.dataservice.RegisterSpawnPlayer(player, slot)) return "Fail";

				const shark = data.slots[slot - 1].shark;

				const hitbox = this.hitboxservice.createPlayerHitbox(player, shark);
				if (!hitbox) return "Fail";

				// assign the player play data
				const entity = PlayerToEntity.get(player);
				if (!entity) {
					this.hitboxservice.destroyPlayerHitbox(player);
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

				const hitbox = this.hitboxservice.createPlayerHitbox(player, shark);
				if (!hitbox) return "Fail";

				// assign the player play data
				const entity = PlayerToEntity.get(player);
				if (!entity) {
					this.hitboxservice.destroyPlayerHitbox(player);
					return "Fail";
				}

				SpawnResult.fire(player);
			}),
		);
	}
}
