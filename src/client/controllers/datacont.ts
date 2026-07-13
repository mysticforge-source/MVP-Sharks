import { clientMaid } from "client/clientmaid";
import { PlayerDataEvent } from "client/network/client";
import { coins, gems, revivetokens, slots } from "client/ui/sources";
import { UserDataComponent } from "shared/ecs/components";
import { World } from "shared/ecs/world";

import { Controller, OnStart } from "@flamework/core";

export const PlayerEntity = World.entity();

@Controller()
/*
 * Updates PlayerEntity component data on sync event
 */
export class DataController implements OnStart {
	protected maid = clientMaid.sub();

	public onStart(): void {
		this.maid.add(
			PlayerDataEvent.on((data) => {
				World.set(PlayerEntity, UserDataComponent, data);

				// update UI sources
				coins(data.coins);
				gems(data.gems);
				revivetokens(data.revivetokens);

				// update slot sources
				for (const [i, slot] of ipairs(data.slots)) {
					let slotData = slots[i];
					if (!slotData) {
						continue;
					}

					slotData.shark(slot.shark);
					slotData.dead(slot.dead);
					slotData.hunger(slot.hunger);
					slotData.exp(slot.exp);
					slotData.upgrade(slot.upgrade);
					slotData.level(slot.level);
				}
			}),
		);
	}
}
