import { DirtyPlayComponent, LevelupIntent, PlayComponent } from "server/components";
import { EntityToPlayer } from "server/services/DataService";
import { HitboxService, HitboxToPlayer, PlayerToHitbox } from "server/services/HitboxService";
import { World } from "shared/ecs/world";
import { UpdatePlayerLevel } from "shared/logic/GameSimulation";
import { aged } from "shared/utils/ageLevel";

export default (dt: number, hitboxservice: HitboxService) => {
	for (const [entity, data] of World.query(PlayComponent, LevelupIntent)) {
		let newdata = { ...data };

		newdata.level++;
		newdata.exp -= newdata.maxexp;

		// handle age-up
		if (aged(newdata.level)) {
			// update speed
			const player = EntityToPlayer.get(entity);
			if (player) {
				UpdatePlayerLevel(player, newdata.level);

				print("AGE UP RESIZE HITBOX");

				// update size
				const hitbox = PlayerToHitbox.get(player);
				if (hitbox) hitboxservice.resizeHitbox(hitbox, newdata.shark, newdata.level);
			}
		}

		World.remove(entity, LevelupIntent);
		World.set(entity, PlayComponent, newdata);
		World.add(entity, DirtyPlayComponent);
	}
};
