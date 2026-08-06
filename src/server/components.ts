import { Entity } from "@rbxts/jecs";
import { World } from "shared/ecs/world";
import { SharkSlot } from "shared/networktypes";

/* Data assigned to players when they select a shark slot and spawn in */
export const PlayComponent = World.component<SharkSlot>();

/* Marks the entity's play data as dirty to send it over the network */
export const DirtyPlayComponent = World.entity();

/* Data assigned on spawn as a systems helper */
export interface SystemHelper {
	hungertime: number;
	hpdraintime: number;
	test_exp_t: number;
}

export const SystemHelperComponent = World.component<SystemHelper>();

export const SystemHelperData: SystemHelper = {
	hungertime: 0,
	hpdraintime: 0,
	test_exp_t: 0,
};

/* Add EXP intent */
export const AddExpIntent = World.component<number>();

/* Levels up the player */
export const LevelupIntent = World.entity();
