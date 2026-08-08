/** Topbar component for reuse */

import Vide from "@rbxts/vide";
import { ScaleUDim, ScaleUDim2 } from "shared/utils/scale";
import { coins, revivetokens, sharkcoins } from "../sources";
import { Aspect } from "./aspect";
import Container from "./container";
import { Corner } from "./corner";

export default () => (
	<Container
		Size={ScaleUDim2(0.4, 0.05)}
		Position={ScaleUDim2(0.99, 0.01)}
		AnchorPoint={new Vector2(1, 0)}
	>
		<Aspect ratio={18} />
		<uilistlayout
			HorizontalAlignment="Center"
			VerticalAlignment="Center"
			FillDirection={"Horizontal"}
			Padding={ScaleUDim(0.03)}
			SortOrder="LayoutOrder"
		/>
		{/* Coins */}
		<frame
			Size={ScaleUDim2(0.25, 1)}
			ZIndex={1}
			BackgroundColor3={Color3.fromRGB(0, 0, 0)}
			AnchorPoint={new Vector2(0.5, 0)}
		>
			<Aspect ratio={6} />
			<Corner scale={0.2} />

			{/* Coin Label */}
			<textlabel
				Size={ScaleUDim2(1, 1)}
				Position={ScaleUDim2(0.5, 0.5)}
				BackgroundTransparency={1}
				AnchorPoint={new Vector2(0.5, 0.5)}
				ZIndex={2}
				Text={() => `${coins()}`}
				RichText={true}
				Font="GothamBold"
				TextColor3={Color3.fromRGB(232, 196, 77)}
				TextScaled={true}
			/>
		</frame>

		{/* Shark Coins */}
		<frame
			Size={ScaleUDim2(0.25, 1)}
			ZIndex={1}
			BackgroundColor3={Color3.fromRGB(0, 0, 0)}
			AnchorPoint={new Vector2(0.5, 0)}
		>
			<Aspect ratio={6} />
			<Corner scale={0.2} />

			{/* Shark Coin Label */}
			<textlabel
				Size={ScaleUDim2(1, 1)}
				Position={ScaleUDim2(0.5, 0.5)}
				BackgroundTransparency={1}
				AnchorPoint={new Vector2(0.5, 0.5)}
				ZIndex={2}
				Text={() => `${sharkcoins()}`}
				RichText={true}
				Font="GothamBold"
				TextColor3={Color3.fromRGB(74, 224, 130)}
				TextScaled={true}
			/>
		</frame>

		{/* Revive Tokens */}
		<frame
			Size={ScaleUDim2(0.25, 1)}
			ZIndex={1}
			BackgroundColor3={Color3.fromRGB(0, 0, 0)}
			AnchorPoint={new Vector2(0.5, 0)}
		>
			<Aspect ratio={6} />
			<Corner scale={0.2} />

			{/* Shark Coin Label */}
			<textlabel
				Size={ScaleUDim2(1, 1)}
				Position={ScaleUDim2(0.5, 0.5)}
				BackgroundTransparency={1}
				AnchorPoint={new Vector2(0.5, 0.5)}
				ZIndex={2}
				Text={() => `${revivetokens()}`}
				RichText={true}
				Font="GothamBold"
				TextColor3={Color3.fromRGB(224, 74, 82)}
				TextScaled={true}
			/>
		</frame>
	</Container>
);
