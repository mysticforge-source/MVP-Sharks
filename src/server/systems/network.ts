import { DirtyPlayComponent, PlayComponent } from "server/components";
import { IngameDataEvent } from "server/network/server";
import { DataService, EntityToPlayer, PlayerToGameSlot } from "server/services/DataService";
import { World } from "shared/ecs/world";

/** Queries each dirty play data and sends it to the player  */
export default (dt: number, dataservice: DataService) => {
	for (const [entity] of World.query(DirtyPlayComponent)) {
		World.remove(entity, DirtyPlayComponent);

		const player = EntityToPlayer.get(entity);
		const data = World.get(entity, PlayComponent);
		if (player && data) {
			const slot = PlayerToGameSlot.get(player);
			if (slot === undefined) {
				// slot can be 0
				player.Kick("No slot assigned");
				return;
			}

			// change direct data
			dataservice.changeSlotData(player, slot, data);

			// fire event
			IngameDataEvent.fire(player, data);
		}
	}
};
