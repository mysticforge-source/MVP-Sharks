import { Players } from "@rbxts/services";
import { PlayerEntity } from "client/controllers/DataController";
import { PlayerToSharkEntity, ViewController } from "client/controllers/ViewController";
import { LevelChangeIntent, SharkViewComponent } from "client/state/components";
import { states } from "client/state/viewstate";
import { level } from "client/ui/sources";
import { World } from "shared/ecs/world";
import { UpdatePlayerLevel } from "shared/logic/GameSimulation";
import { aged } from "shared/utils/ageLevel";

const player = Players.LocalPlayer;

export default (dt: number, viewcontroller: ViewController) => {
	if (!states.BindedToSimulation) return;

	if (states.levelupIntent && aged(level())) {
		UpdatePlayerLevel(player, level());

		const sharkEntity = PlayerToSharkEntity.get(player);

		if (sharkEntity) {
			const sharkdata = World.get(sharkEntity, SharkViewComponent)!;

			World.set(sharkEntity, SharkViewComponent, {
				...sharkdata,
				level: level(),
			});
		}

		viewcontroller.updateModelSize(player);

		states.levelupIntent = false;
	}
};
