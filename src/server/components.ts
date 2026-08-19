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

// NPC components (data changing live)
export const NPC_Hitbox = World.component<Instance>();

export const NPC_Health = World.component<number>();
export const NPC_Direction = World.component<Vector3>();

export const NPC_Data = World.component<NpcData & { id: number }>();

export const NPC_Time = World.component<{
	time_next_move: number;
	time_moving_for: number;

	time_next_regen: number;
	time_next_attack: number;
}>();

export const NPC_DamageIntent = World.component<number>();
export const NPC_ChangeDirectionIntent = World.component<Vector3>();
