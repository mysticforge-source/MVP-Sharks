// services attacking and combat between players, players and npcs

import { OnStart, Service } from "@flamework/core";
import { Attack } from "server/network/server";
import { serverMaid } from "server/servermaid";
import { PlayerToEntity } from "./DataService";
import { World } from "shared/ecs/world";
import { AttackIntent, SystemHelperComponent } from "server/components";

@Service()
export class BattleService implements OnStart {
	private maid = serverMaid.sub();

	onStart(): void {
		this.maid.add(
			Attack.on((player: Player) => {
				// we got an event; firstly get the entity
				const playerEntity = PlayerToEntity.get(player);
				if (!playerEntity) return;

				// secondly, get the syshelper
				const syshelper = World.get(playerEntity, SystemHelperComponent);
				if (!syshelper) return;

				// this means they're ingame, but did they click in time?
				if (syshelper.time_next_attack > 0) return;

				// they clicked in time and they can attack,
				// so assign them the attack component
				World.add(playerEntity, AttackIntent);

				warn(`PLAYER ${player} ATTACKING`);
			}),
		);
	}
}
