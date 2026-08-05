import { World } from "shared/ecs/world";
import { SharkSlot } from "shared/networktypes";

/* Data assigned to players when they select a shark slot and spawn in */
export const PlayComponent = World.component<SharkSlot>();

/* Data assigned on spawn as a systems helper */
export interface SystemHelper {
	hungertime: number;
	hpdraintime: number;
}

export const SystemHelperComponent = World.component<SystemHelper>();

export const SystemHelperData: SystemHelper = {
	hungertime: 0,
	hpdraintime: 0,
};
