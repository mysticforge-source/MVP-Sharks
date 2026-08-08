import { SpawnResult, SpawnSlot } from "server/network/server";
import { serverMaid } from "server/servermaid";
import { UserDataComponent } from "shared/ecs/components";
import { World } from "shared/ecs/world";

import { OnStart, Service } from "@flamework/core";

import { DataService, PlayerToEntity } from "./DataService";
import { idtoshark } from "shared/data";
import { HitboxService } from "./HitboxService";
import { PlayComponent, SystemHelperComponent, SystemHelperData } from "server/components";

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
			SpawnSlot.on((player: Player, slot: number) => {
				const data = this.dataservice.getPlayerData(player);
				if (!data) return "Fail";

				// fail if player already in-game
				if (this.dataservice.getPlayerIngameData(player)) return "Fail";

				warn("SPAWNSLOT GOT", slot);

				const sharkid = data.slots[slot - 1]?.shark;
				if (sharkid === undefined) return "Fail";

				const sharkname = idtoshark[sharkid];
				if (!sharkname) return "Fail";

				this.dataservice.RegisterSpawnPlayer(player, slot);

				const hitbox = this.hitboxservice.createPlayerHitbox(player, sharkname);
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
