/* storybook function, vide.mount returns the destructor */

import Vide from "@rbxts/vide"
import AppRoot from "./AppRoot"
export = (target: Frame) => Vide.mount(
    AppRoot, target
);
