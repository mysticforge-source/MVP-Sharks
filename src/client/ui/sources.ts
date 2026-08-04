/* client source of truth for ui vide sources */

import { defaultSharkSlotData } from "shared/data";
import { SharkSlot } from "shared/networktypes";

import { source } from "@rbxts/vide";

// data: values
export const coins = source<number>(0);
export const sharkcoins = source<number>(0);
export const revivetokens = source<number>(0);
export const title = source<string>("Baby");
export const hp = source<number>(100);
export const maxhp = source<number>(100);
export const level = source<number>(155555);
export const exp = source<number>(0);
export const maxexp = source<number>(100);
export const hunger = source<number>(100);
export const maxhunger = source<number>(100);

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

export const incombat = source<boolean>(false);
export const combattimer = source<number>(15);

export const currentslot = slots[0];

// UI sources
export const Menu = source<"Title" | "Slot" | "Shop" | "Sharks" | "Settings" | "GAME">("GAME");
