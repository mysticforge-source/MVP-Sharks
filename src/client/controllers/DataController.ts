/*
 * updates playerentity component data on sync event
 * maps network data to UI sources and ecs components
 */

import { clientMaid } from "client/clientmaid";
import { IngameDataEvent, PlayerDataEvent } from "client/network/client";
import {
	coins,
	sharkcoins,
	revivetokens,
	slots,
	hp,
	hunger,
	maxhp,
	maxhunger,
	exp,
	maxexp,
	upgrade,
	level,
	shark,
} from "client/ui/sources";
import { UserDataComponent } from "shared/ecs/components";
import { World } from "shared/ecs/world";

import { Controller, OnStart } from "@flamework/core";
import { LevelChangeIntent } from "client/state/components";

export const PlayerEntity = World.entity();

@Controller()
export class DataController implements OnStart {
	protected maid = clientMaid.sub();

	public onStart(): void {
		this.maid.add(
			PlayerDataEvent.on((data) => {
				World.set(PlayerEntity, UserDataComponent, data);

				// update ui sources
				coins(data.coins);
				sharkcoins(data.sharkcoins);
				revivetokens(data.revivetokens);

				// update slot sources
				for (const [i, slot] of ipairs(data.slots)) {
					let slotData = slots[i];
					if (!slotData) {
						continue;
					}

					slotData.shark(slot.shark);
					slotData.dead(slot.dead);
					slotData.hp(slot.hp);
					slotData.maxhp(slot.maxhp);
					slotData.hunger(slot.hunger);
					slotData.maxhunger(slot.maxhunger);
					slotData.exp(slot.exp);
					slotData.maxexp(slot.maxexp);
					slotData.upgrade(slot.upgrade);
					slotData.level(slot.level);
				}
			}),
		);

		// update HUD sources
		this.maid.add(
			IngameDataEvent.on((data) => {
				const oldlevel = level();

				// update ui sources
				shark(data.shark);
				hp(data.hp);
				maxhp(data.maxhp);
				hunger(data.hunger);
				maxhunger(data.maxhunger);
				exp(data.exp);
				maxexp(data.maxexp);
				upgrade(data.upgrade);
				level(data.level);

				// intent to update simulation
				if (level() !== oldlevel) {
					World.add(PlayerEntity, LevelChangeIntent);
				}
			}),
		);
	}
}
