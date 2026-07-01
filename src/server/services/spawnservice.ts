import { SpawnFunction } from "server/network/server";
import { serverMaid } from "server/servermaid";
import { UserDataComponent } from "shared/ecs/components";
import { World } from "shared/ecs/world";

import { OnStart, Service } from "@flamework/core";

import { DataService, PlayerToEntity } from "./dataservice";
import { idtoshark } from "shared/data";
import { ReplicatedStorage } from "@rbxts/services";

@Service()
export class SpawnService implements OnStart {
	protected maid = serverMaid.sub();

	public constructor(private readonly dataservice: DataService) {}

	// summon a hitbox and assign it to the player entity
	private createHitbox(player: Player) {}

	// connects to the spawn event
	public onStart(): void {
		this.maid.add(
			SpawnFunction.setCallback((player: Player, slot: number) => {
				// get player entity
				const entity = PlayerToEntity.get(player);
				if (!entity) return "Fail";

				// get player data
				const data = World.get(entity, UserDataComponent);
				if (!data) return "Fail";

				// get slot data
				const slotdata = data.slots[slot];
				if (!slotdata) return "Fail";

				// get slot shark id
				const sharkid = slotdata.shark;
				if (!sharkid) return "Fail";

				// get shark name
				const shark = idtoshark[sharkid] as keyof typeof ReplicatedStorage.Hitboxes;
				if (!shark) return "Fail";

				// get shark hitbox
				const sharkhitbox = ReplicatedStorage.Hitboxes[shark];
				if (!sharkhitbox) return "Fail";

				return "Success";
			}),
		);
	}
}
