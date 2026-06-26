// Client source of truth for UI Vide sources

import { source } from "@rbxts/vide";

export const coins = source<number>(0);

export const Menu = source<
    "Title" | "Slot" | "Shop" | "Sharks" | "Settings" | "GAME"
>("Title");
