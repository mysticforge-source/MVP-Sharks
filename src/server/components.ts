import { Entity } from "@rbxts/jecs";
import { NpcData } from "shared/data";
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

// Damage the player
export const DamageIntent = World.component<number>();

// NPC components (data changing live)
export const NPC_Hitbox = World.component<Instance>();

export const NPC_Health = World.component<number>();

// stale context about this specific NPC
export const NPC_Data = World.component<{
	id: number;
	location: string;
}>();

export const NPC_Time = World.component<{
	time_next_move: number;
	time_moving_for: number;

	// target to look at and attack
	target?: MeshPart;

	time_in_combat: number;

	time_next_regen: number;
	time_next_attack: number;
}>();

export const NPC_DamageIntent = World.component<number>();
