import { Players } from "@rbxts/services";
import { PlayerEntity } from "client/controllers/DataController";
import { ViewController } from "client/controllers/ViewController";
import { LevelChangeIntent } from "client/state/components";
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

		warn("WORKS WORKS WORKS");
		viewcontroller.updateModelSize(player, level());

		states.levelupIntent = false;
	}
};
