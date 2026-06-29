import { source } from "@rbxts/vide";

/*
 * Collection of text used throughout the game
 */
export const text = {
    "en": {
        Play: "Play",
        Shop: "Shop",
        Settings: "Settings",
    }
};

// localisation language source
export const lang = source<keyof typeof text>('en');

// gets localised text
export const loc = <T extends keyof typeof text[keyof typeof text]>(prompt: T) => text[lang()][prompt]
