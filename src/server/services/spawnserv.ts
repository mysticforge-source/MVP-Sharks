import { SpawnFunction } from "server/network/server";
import { serverMaid } from "server/servermaid";
import { UserDataComponent } from "shared/ecs/components";
import { World } from "shared/ecs/world";

import { OnStart, Service } from "@flamework/core";

import { DataService, PlayerToEntity } from "./dataserv";
import { idtoshark } from "shared/data";
import { ReplicatedStorage } from "@rbxts/services";
import { HitboxService } from "./hitboxserv";

@Service()
export class SpawnService implements OnStart {
	protected maid = serverMaid.sub();

	public constructor(
		private readonly dataservice: DataService,
		private readonly hitboxservice: HitboxService,
	) {}

	// connects to the spawn event
	public onStart(): void {
		this.maid.add(
			SpawnFunction.setCallback((player: Player, slot: number) => {
				const data = this.dataservice.getPlayerData(player);
				if (!data) return "Fail";

				const sharkid = data.slots[slot]?.shark;
				if (sharkid === undefined) return "Fail";

				const sharkname = idtoshark[sharkid];
				if (!sharkname) return "Fail";

				const hitbox = this.hitboxservice.createPlayerHitbox(player, sharkname);
				if (!hitbox) return "Fail";

				return "Success";
			}),
		);
	}
}
