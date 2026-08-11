import { CreateVideStory } from "@rbxts/ui-labs";

import Vide from "@rbxts/vide";
import Shark from "./shark";

export = CreateVideStory(
	{
		vide: Vide,
	},
	() => (
		<frame className="w-full h-full flex items-center justify-center">
			<Shark name="Minawii" />
		</frame>
	),
);
