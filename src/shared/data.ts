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

export const npccatalog: Record<number, NpcData> = {
	0: {
		name: "Reef Shark Medium",
		hitboxname: "Reef Shark Medium",
		viewmodelname: "Reef Shark Medium",

		level: 0,

		health: 100,
		meatdrop: 10,

		damage: 25,
		damagecooldown: 3,
		damagerange: 12,

		movement: "swimmer",
		behaviour: "attack",
		range: 25,

		speed: 10,
		idletime: 0.1,
		movetime: 1.5,

		spawnlocations: {
			Test: {
				spawnrate: 10,
				maxspawns: 2,
			},
			Test2: {
				spawnrate: 10,
				maxspawns: 2,
			},
			Test3: {
				spawnrate: 10,
				maxspawns: 2,
			},
			Test4: {
				spawnrate: 15,
				maxspawns: 2,
			},
		},

		maxdistance: 75,

		regenrate: 1,
		regenhp: 5,
		regencombattime: 1,
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

export interface NpcData {
	name: string; // display name
	hitboxname: string; // name of the hitbox
	viewmodelname: string; // name of the animated Model

	level: number; // arbitrary level value

	health: number;
	meatdrop: number; // amount of meat to drop

	damage: number; // one attack damage
	damagecooldown: number; // cooldown between attacks
	damagerange: number; // range within which the npc attacks and stops moving

	movement: "walker" | "swimmer";
	behaviour: "ignore" | "run" | "attack";
	range: number; // range within which the npc sees the nearest player

	speed: number; // speed of movement
	idletime: number; // how much time to wait between movements
	movetime: number; // how much time to move

	spawnlocations: {
		[name: string]: {
			// name of location in Workspace/Shared/NPCLocations
			spawnrate: number; // amount of seconds between spawns for this location
			maxspawns: number; // maximum amount of spawned npcs of this type for this location
		};
	};

	maxdistance: number; // maximum distance away from spawn, will walk back

	regenrate: number; // how often to regenerate some hp if out of combat
	regenhp: number; // how many hp to regenerate
	regencombattime: number; // how many seconds to wait out after combat for regen
}

interface Upgrade {
	cost?: number;
	maxlevelcap: number;
}

export const animdata = {
	UniversalIdle: "rbxassetid://134716316716783",
	UniversalAttack: "rbxassetid://116268079065083",
};

// TODO
export const clientviewdistance = 100;
