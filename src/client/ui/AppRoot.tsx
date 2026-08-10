/* app root: mounts all ui screens */

import Vide from "@rbxts/vide";

import { Menu } from "./sources";
import Hud from "./screens/hud";
import Slotselect from "./screens/slotselect";
import Title from "./screens/title";

export = () => (
	<>
		{/* <Titlescreen enabled={() => Menu() === "Title"} /> */}
		<Title enabled={() => Menu() === "Title"} />
		<Hud enabled={() => Menu() === "GAME"} />
		<Slotselect enabled={() => Menu() === "Slot"} />
	</>
);
