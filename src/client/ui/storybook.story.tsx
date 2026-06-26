import Vide from "@rbxts/vide"
import AppRoot from "./AppRoot"

/* 
 * Storybook function. Vide.mount returns the destructor
*/
export = (target: Frame) => Vide.mount(
    AppRoot, target
);
