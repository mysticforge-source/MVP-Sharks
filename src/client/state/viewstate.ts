/* client view state sources */
// replacement for jecs on the client

import { source } from "@rbxts/vide";

export const HitboxesVisible = source<boolean>(false);

export const states = {
	BindedToSimulation: false,
	levelupIntent: false,
};
