// finds age level from age
// returns the index of the first cap higher than the given level

import { agelevelcaps, ageleveltitles, sharkcatalog } from "../data";

// BATTLETESTED
export function findAgeLevel(level: number): number {
	for (let i = 0; i < agelevelcaps.size(); i++) {
		if (agelevelcaps[i] > level) return i;
	}
	return agelevelcaps.size() - 1;
}

/** Returns whether the shark has aged on this level */
// BATTLETESTED
export function aged(level: number): boolean {
	return agelevelcaps.includes(level); //agelevelcaps.indexOf(level) >= 0 ? true : false;
}

export function getTitle(level: number): string {
	const agelevel = findAgeLevel(level);
	if (agelevel >= ageleveltitles.size()) {
		return ageleveltitles[ageleveltitles.size() - 1];
	}
	return ageleveltitles[agelevel];
}

export function getSpeed(shark: number, level: number): number {
	const agelevel = findAgeLevel(level);
	const sharkdata = sharkcatalog[level];

	return sharkdata.speed * math.pow(sharkdata.speedmult, agelevel);
}

export function getSize(shark: number, level: number, hitbox: MeshPart): Vector3 {
	const agelevel = findAgeLevel(level);
	const sharkdata = sharkcatalog[level];

	let { X, Y, Z } = hitbox.Size;
	X *= math.pow(sharkdata.sizemult, agelevel);
	Y *= math.pow(sharkdata.sizemult, agelevel);
	Z *= math.pow(sharkdata.sizemult, agelevel);

	return new Vector3(X, Y, Z);
}

export function getModelSize(shark: number, level: number, defaultmodel: Model): number {
	const agelevel = findAgeLevel(level);
	const sharkdata = sharkcatalog[level];

	return defaultmodel.GetScale() * math.pow(sharkdata.sizemult, agelevel);
}
