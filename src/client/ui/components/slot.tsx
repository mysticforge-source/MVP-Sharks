import Vide, { derive, source, spring } from "@rbxts/vide";
import { ScaleUDim2 } from "shared/utils/scale";
import { Corner } from "./corner";
import { Aspect } from "./aspect";
import { Menu, selectedslot, slots } from "../sources";
import { sharkcatalog } from "shared/data";
import { PlaySlot, SpawnSlot } from "client/network/client";

const defaultButtonColoring = {
	bg: new Color3(0.36, 0.78, 0.32),
	border: new Color3(0.48, 0.89, 0.44),
	text: new Color3(1, 1, 1),
};

const hoveredButtonColoring = {
	bg: new Color3(0.31, 0.44, 0.73),
	border: new Color3(0.44, 0.55, 0.89),
	text: new Color3(1, 1, 1),
};

interface Props {
	slotnumber: number;
}

export default ({ slotnumber }: Props) => {
	const buttonColoring = source({
		bg: new Color3(0.36, 0.78, 0.32),
		border: new Color3(0.48, 0.89, 0.44),
		text: new Color3(1, 1, 1),
	});

	const size = source(ScaleUDim2(0.4, 0.8));
	const [sizeSpring] = spring(size, 0.3, 0.7);

	const created = derive(() => slots[slotnumber].created());
	const alive = derive(() => slots[slotnumber].alive());

	const shark = derive(() => slots[slotnumber].shark());
	const sharkData = derive(() => sharkcatalog[shark()]);

	return (
		<frame
			Size={sizeSpring}
			BackgroundColor3={new Color3(0.2, 0.2, 0.3)}
			AnchorPoint={new Vector2(0.5, 0.5)}
			MouseEnter={() => size(ScaleUDim2(0.45, 0.95))}
			MouseLeave={() => size(ScaleUDim2(0.4, 0.8))}
		>
			<Corner scale={0.08} />
			<Aspect ratio={0.62} />

			<uistroke
				StrokeSizingMode="ScaledSize"
				BorderStrokePosition="Inner"
				Thickness={0.016}
				Color={new Color3(0.36, 0.36, 0.59)}
			/>

			{/* Shark name label */}
			<textlabel
				Text={() => (created() ? sharkData().name : "")}
				Font="GothamBlack"
				TextColor3={() => buttonColoring().text}
				TextScaled={true}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={ScaleUDim2(0.5, 0.1)}
				BackgroundTransparency={1}
				Size={ScaleUDim2(0.9, 0.15)}
			/>

			{/* Create button */}
			<textbutton
				className={[
					"w-[80%] h-[10%] origin-center bg-amber-200 text-black hover:w-[85%] hover:h-[11%] hover:bg-blue hover:border-blue-400 transition-all duration-300 font-bold text-5xl rounded-xl left-[50%] top-[88%] ring-[3] border-orange-200",
					created() ? "hidden" : "top-[80%]",
				]}
				TextScaled={true}
				Text="Create"
				Activated={() => {
					warn(slotnumber);
					selectedslot(slotnumber);
					Menu("Sharks");
				}}
			/>

			{/* Play button */}
			<textbutton
				className={[
					"w-[80%] h-[10%] origin-center bg-green-500 text-white hover:w-[85%] hover:h-[11%] hover:bg-blue hover:border-blue-400 transition-all duration-300 font-bold text-5xl rounded-xl left-[50%] top-[75%] ring-[3] border-green-400",
					!created() ? "hidden" : "top-[80%]",
				]}
				TextScaled={true}
				Text="Play"
				Activated={() => PlaySlot.fire(slotnumber)}
			/>
		</frame>
	);
};
