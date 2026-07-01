// shared data file

import { SharkSlot } from "./networktypes";

export const version = "0.0.1";

export const agelevelcaps = [
	5, // max level for baby
	15,
	30,
	50,
	80,
	// non titled upgrades:
	90,
	100,
	120,
];

export const ageleveltitles = ["Baby", "Juvenile", "Teen", "Adult", "Elder"];

export const defaultSharkSlotData: SharkSlot = {
	shark: 0,
	dead: false,
	hunger: 0,
	exp: 0,
	upgrade: 0,
	level: 0,
};
