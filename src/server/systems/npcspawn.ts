import { HitboxService } from "server/services/HitboxService";
import { npccatalog } from "shared/data";

// A map of spawn times
const times: Map<number, number> = new Map();
for (const [id, npc] of pairs(npccatalog)) {
	times.set(id, 0);
}

export default (dt: number, hitboxservice: HitboxService) => {
	// change times
	times.forEach((value, id) => times.set(id, value + dt));

	// spawn entities
	times.forEach((value, id) => {
		if (value >= npccatalog[id].spawnrate) {
			// immediately set to 0 so we dont spam entities if server lags
			times.set(id, 0);

			hitboxservice;
		}
	});
};
