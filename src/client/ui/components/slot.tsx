import Vide, { source, spring } from "@rbxts/vide";
import { ScaleUDim2 } from "shared/utils/scale";
import { Corner } from "./corner";
import { Aspect } from "./aspect";
import { slots } from "../sources";
import { sharkcatalog } from "shared/data";
import { SpawnSlot } from "client/network/client";

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
	slotnumber?: number;
}

export default ({ slotnumber = 0 }: Props) => {
	const buttonColoring = source({
		bg: new Color3(0.36, 0.78, 0.32),
		border: new Color3(0.48, 0.89, 0.44),
		text: new Color3(1, 1, 1),
	});

	const size = source(ScaleUDim2(0.4, 0.8));
	const [sizeSpring] = spring(size, 0.3, 0.7);

	const sharkData = sharkcatalog[slots[slotnumber].shark()];

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
				Text={sharkData.name}
				Font="GothamBlack"
				TextColor3={() => buttonColoring().text}
				TextScaled={true}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={ScaleUDim2(0.5, 0.1)}
				BackgroundTransparency={1}
				Size={ScaleUDim2(0.9, 0.15)}
			/>

			{/* create button */}
			<textbutton
				Size={ScaleUDim2(0.7, 0.13)}
				Position={ScaleUDim2(0.5, 0.9)}
				BackgroundColor3={() => buttonColoring().bg}
				AnchorPoint={new Vector2(0.5, 0.5)}
				BorderSizePixel={0}
				MouseEnter={() => buttonColoring(hoveredButtonColoring)}
				MouseLeave={() => buttonColoring(defaultButtonColoring)}
				Activated={() => SpawnSlot.fire(slotnumber)}
			>
				<Corner scale={0.23} />
				<uistroke
					StrokeSizingMode="ScaledSize"
					ApplyStrokeMode={"Border"}
					BorderStrokePosition="Inner"
					Thickness={0.08}
					Color={() => buttonColoring().border}
				/>
				<textlabel
					Text="Play"
					Font="GothamBlack"
					TextColor3={() => buttonColoring().text}
					TextScaled={true}
					AnchorPoint={new Vector2(0.5, 0.5)}
					Position={ScaleUDim2(0.5, 0.5)}
					BackgroundTransparency={1}
					Size={ScaleUDim2(1, 0.75)}
				/>
			</textbutton>
		</frame>
	);
};
