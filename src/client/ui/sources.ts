// Client source of truth for UI Vide sources

import { defaultSharkSlotData } from "shared/data";
import { SharkSlot } from "shared/networktypes";

import { source } from "@rbxts/vide";

// data: values
export const coins = source<number>(0);
export const gems = source<number>(0);
export const revivetokens = source<number>(0);

// data: shark slots
export const createSharkSource = () => source<number>(defaultSharkSlotData.shark);
export const createDeadSource = () => source<boolean>(defaultSharkSlotData.dead);
export const createHungerSource = () => source<number>(defaultSharkSlotData.hunger);
export const createExpSource = () => source<number>(defaultSharkSlotData.exp);
export const createUpgradeSource = () => source<number>(defaultSharkSlotData.upgrade);
export const createLevelSource = () => source<number>(defaultSharkSlotData.level);

export const createSharkSlot = () => ({
	shark: createSharkSource(),
	dead: createDeadSource(),
	hunger: createHungerSource(),
	exp: createExpSource(),
	upgrade: createUpgradeSource(),
	level: createLevelSource(),
});

export const slots = [createSharkSlot(), createSharkSlot(), createSharkSlot()];

// Game HUD
export const currentslot = slots[0];

// UI sources
export const Menu = source<"Title" | "Slot" | "Shop" | "Sharks" | "Settings" | "GAME">("Title");
