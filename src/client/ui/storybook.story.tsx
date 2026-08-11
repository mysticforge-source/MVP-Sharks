/* storybook function, vide.mount returns the destructor */

import Vide, { source, spring } from "@rbxts/vide";
import AppRoot from "./AppRoot";
import Titlebutton from "./components/titlebutton";
// export = (target: Frame) => Vide.mount(AppRoot, target);

export = {
	vide: Vide,
	story: () => {
		const width = source(180);
		const [widthspring] = spring(width, 0.5);

		return (
			<frame className="flex-col items-center justify-center w-full h-full p-15 gap-4">
				<frame
					className={() =>
						`bg-slate-800 h-50 w-[${widthspring()}] rounded-lg border border-slate-500`
					}
					MouseEnter={() => width(360)}
					MouseLeave={() => width(180)}
				/>
			</frame>
		);
	},
};

{
	/* <frame className="flex-col items-center justify-center w-full h-full p-15 gap-4">
    <Titlebutton text="Play" onClick={() => print("Hello World")} />
    <Titlebutton text="Shop" onClick={() => print("Hello World")} />
    <Titlebutton text="Settings" onClick={() => print("Hello World")} />
</frame> */
}
