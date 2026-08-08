/* app root: mounts all ui screens */

import Vide from "@rbxts/vide";

import Titlescreen from "./screens/titlescreen";
import { Menu } from "./sources";
import Hud from "./screens/hud";
import Slotselect from "./screens/slotselect";

export = () => (
	<>
		<Titlescreen enabled={() => Menu() === "Title"} />
		<Hud enabled={() => Menu() === "GAME"} />
		<Slotselect enabled={() => Menu() === "Slot"} />
	</>
);
