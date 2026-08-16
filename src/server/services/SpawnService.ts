import { SpawnResult, SpawnSlot } from "server/network/server";
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

	/* connects to the spawn event */
	public onStart(): void {
		this.maid.add(
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

				SpawnResult.fire(player, "Success");
			}),
		);
	}
}
