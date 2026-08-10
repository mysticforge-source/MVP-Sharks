/* storybook function, vide.mount returns the destructor */

import Vide, { source } from "@rbxts/vide";
import AppRoot from "./AppRoot";
import Titlebutton from "./components/titlebutton";
// export = (target: Frame) => Vide.mount(AppRoot, target);

export = {
	vide: Vide,
	story: () => {
		return (
			<frame className="flex-col items-center justify-center w-full h-full p-15 gap-4">
				<Titlebutton text="Play" onClick={() => print("Hello World")} />
				<Titlebutton text="Shop" onClick={() => print("Hello World")} />
				<Titlebutton text="Settings" onClick={() => print("Hello World")} />
			</frame>
		);
	},
};
