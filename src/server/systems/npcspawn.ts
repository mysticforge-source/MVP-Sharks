import { Workspace } from "@rbxts/services";
import { merge } from "@rbxts/sift/out/Dictionary";
import { NPC_Data, NPC_Health, NPC_Time } from "server/components";
import { HitboxService } from "server/services/HitboxService";
import { npccatalog } from "shared/data";
import { World } from "shared/ecs/world";

// A map of spawn times
const times: Map<number, number> = new Map();
for (const [id, npc] of pairs(npccatalog)) {
	times.set(id, 0);
}

export default (dt: number, hitboxservice: HitboxService) => {
	// change times
	times.forEach((value, id) => times.set(id, value + dt));

	const t = os.clock();

	// spawn entities
	times.forEach((value, id) => {
		const npcData = npccatalog[id];

		if (value >= npcData.spawnrate) {
			// immediately set to 0 so we dont spam entities if server lags
			times.set(id, 0);

			// create a new NPC entity
			const npc = World.entity();
			// data
			World.set(npc, NPC_Data, merge(npcData, { id: id }));
			// health component, default is max
			World.set(npc, NPC_Health, npcData.health);
			World.set(npc, NPC_Time, {
				time_next_move: 5, //move in 5 seconds
				time_moving_for: 0,

				time_next_attack: 0,
				time_next_regen: 0,
			});

			hitboxservice.createNPCHitbox(npc, "Test");
		}
	});
};
