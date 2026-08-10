import Vide from "@rbxts/vide";
import Titlebutton from "../components/titlebutton";
import { Menu } from "../sources";

declare interface Props {
	enabled?: Vide.Derivable<boolean>;
}

export = ({ enabled = true }: Props) => (
	<screengui
		ResetOnSpawn={false}
		IgnoreGuiInset={true}
		Enabled={enabled}
		Name="Title"
		ZIndexBehavior="Sibling"
	>
		<frame className="flex-col items-center justify-center w-full h-full p-15 gap-4">
			<Titlebutton text="Play" onClick={() => Menu("Slot")} />
			<Titlebutton text="Shop" onClick={() => Menu("Shop")} />
			<Titlebutton text="Settings" onClick={() => Menu("Settings")} />
		</frame>
	</screengui>
);
