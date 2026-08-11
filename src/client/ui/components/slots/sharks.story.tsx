import { CreateVideStory, InferVideProps } from "@rbxts/ui-labs";
import Sharks from "./sharks";
import { source } from "@rbxts/vide";

const controls = {
	enabled: true,
};

import Vide from "@rbxts/vide";

const story = CreateVideStory(
	{ vide: Vide, controls: controls },
	(props: InferVideProps<typeof controls>) => {
		return <Sharks enabled={props.controls.enabled} />;
	},
);

export = story;
