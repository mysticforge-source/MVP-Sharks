// finds age level from age
// returns the index of the first cap higher than the given level

import {
	agelevelcaps,
	ageleveltitles,
	sharksizemultipliers,
	sharkspeedmultipliers,
	sharkspeeds,
	sharkviewmodelmult,
} from "../data";

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
	return sharkspeeds[shark] * math.pow(sharkspeedmultipliers[shark], agelevel);
}

export function getSize(shark: number, level: number, hitbox: MeshPart): Vector3 {
	const agelevel = findAgeLevel(level);

	let { X, Y, Z } = hitbox.Size;
	X *= math.pow(sharksizemultipliers[shark], agelevel);
	Y *= math.pow(sharksizemultipliers[shark], agelevel);
	Z *= math.pow(sharksizemultipliers[shark], agelevel);

	return new Vector3(X, Y, Z);
}

export function getModelSize(shark: number, level: number, defaultmodel: Model): number {
	const agelevel = findAgeLevel(level);
	return (
		defaultmodel.GetScale() * math.pow(sharksizemultipliers[shark], agelevel) //*
		//math.pow(sharkviewmodelmult, agelevel) // increase viewmodels visually so they match the hitbox
	);
}
