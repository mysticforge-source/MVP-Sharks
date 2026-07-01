// Client source of truth for UI Vide sources

import { source } from "@rbxts/vide";
import { SharkSlot } from "shared/networktypes";

// data: values
export const coins = source<number>(0);
export const gems = source<number>(0);
export const revivetokens = source<number>(0);

// data: shark slots
const defaultSharkData: SharkSlot = {
	shark: 0,
	dead: false,
	hunger: 0,
	exp: 0,
	level: 0,
};

export const createSharkSource = () => source<number>(defaultSharkData.shark);
export const createDeadSource = () => source<boolean>(defaultSharkData.dead);
export const createHungerSource = () => source<number>(defaultSharkData.hunger);
export const createExpSource = () => source<number>(defaultSharkData.exp);
export const createLevelSource = () => source<number>(defaultSharkData.level);

export const createSharkSlot = () => ({
	shark: createSharkSource(),
	dead: createDeadSource(),
	hunger: createHungerSource(),
	exp: createExpSource(),
	level: createLevelSource(),
});

export const slots = [createSharkSlot(), createSharkSlot(), createSharkSlot()];

// UI sources
export const Menu = source<"Title" | "Slot" | "Shop" | "Sharks" | "Settings" | "GAME">("Title");
