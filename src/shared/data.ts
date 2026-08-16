/* shared data file */

export const version = "0.0.1";

export const defaultmaxlevelcap = 80;
export const agelevelcaps = [
	// all sharks age-up at these levels:
	5, 15, 30, 50, 80,

	90, 100, 120,
];

export const ageleveltitles = ["Baby", "Juvenile", "Teen", "Adult", "Elder"];

export const upgradedata: Upgrade[] = [
	{
		// default upgrade
		maxlevelcap: 80,
	},
	{
		cost: 100,
		maxlevelcap: 90,
	},
	{
		cost: 200,
		maxlevelcap: 100,
	},
	{
		cost: 300,
		maxlevelcap: 120,
	},
];

/* Data catalog of each shark (id: data) */
export const sharkcatalog: Record<number, SharkData> = {
	0: {
		name: "Reef Shark Medium",
		hitboxname: "Reef Shark Medium",
		viewmodelname: "Reef Shark Medium",

		icon: "rbxassetid://134716316716783",

		cost: 100,
		speed: 20,
		damage: 25,

		sizemult: 1.25,
		speedmult: 1.5,
		damagemult: 1.2,

		showinshop: true,
	},
};

/* Explanations */
interface SharkData {
	name: string; /* General name of the shark */
	hitboxname: string; /* Name of the hitbox model in ServerStorage */
	viewmodelname: string; /* Name of the viewmodel in ReplicatedStorage */

	icon: string;
	cost: number; /* Cost of the shark in shark-coins */

	speed: number; /* Baby age speed */
	damage: number; /* Baby age damage */

	sizemult: number; /* By how much size is multiplied each age-up */
	speedmult: number; /* By how much speed is multiplied each age-up */
	damagemult: number; /* By how much damage is multiplied each age-up */

	showinshop?: true; /* Include 'showinshop: true' to make it purchasable and viewable */
}

interface Upgrade {
	cost?: number;
	maxlevelcap: number;
}

export const animdata = {
	UniversalIdle: "134716316716783",
	UniversalAttack: "116268079065083",
};
