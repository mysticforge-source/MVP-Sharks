/* client source of truth for ui vide sources */

import { source } from "@rbxts/vide";

// data: values
export const coins = source<number>(0);
export const sharkcoins = source<number>(0);
export const revivetokens = source<number>(0);

export const title = source<string>("Baby");

export const shark = source<number>(0);

export const hp = source<number>(100);
export const maxhp = source<number>(100);
export const exp = source<number>(0);
export const maxexp = source<number>(100);
export const hunger = source<number>(100);
export const maxhunger = source<number>(100);
export const upgrade = source<number>(0);
export const level = source<number>(155555);

export const ownedsharks = source<number[]>([0, 0, 0, 0, 0, 0, 0, 0]);

export const shownshark = source<number>(0);
export const selectedshark = source<number>(0);

export const selectedslot = source<number>(0);

export const createSharkSlot = () => ({
	shark: source(0),

	alive: source(false),
	created: source(false),

	hp: source(100),
	maxhp: source(100),

	hunger: source(100),
	maxhunger: source(100),

	exp: source(0),
	maxexp: source(100),
	upgrade: source(0),
	level: source(0),
});
type sourceSharkSlot = ReturnType<typeof createSharkSlot>;

export const slots = [
	0,
	createSharkSlot(),
	createSharkSlot(),
	createSharkSlot(),
] as sourceSharkSlot[];

// Game HUD

export const incombat = source<boolean>(false);
export const combattimer = source<number>(15);

// UI sources
export const Menu = source<"Title" | "Slot" | "Shop" | "Sharks" | "Settings" | "GAME">("Title");
