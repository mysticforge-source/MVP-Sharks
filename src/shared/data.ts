/* shared data file */

import { ReplicatedStorage } from "@rbxts/services";
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

/* By how much the size is multiplied each age-up for each shark, starting with 0 */
/* Normally the size of the hitbox is used, then it's multiplied */
export const sharksizemultipliers = [1.25];

/* Multiplying the size of the hitbox results bigger than the viewmodel, so we enlarge the viewmodel a bit */
export const sharkviewmodelmult = 1.1;

/* By how much the speed is multiplied each age-up for each shark, starting with 0 */
export const sharkspeedmultipliers = [1.5];

/* Baby speeds for each shark */
export const sharkspeeds = [20];

/* Conversion from ID to shark's model name, starting with 0 */
export const idtoshark = [
	"Reef Shark Medium", // 0
];

/* Costs in coins for each shark, starting with 0 id */
export const sharkcosts = [
	100, //0
];

export const animdata = {
	UniversalIdle: "134716316716783",
	UniversalAttack: "116268079065083",
};
