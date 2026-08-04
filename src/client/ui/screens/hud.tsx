import Vide from "@rbxts/vide";
import { css } from "../theme";
import { Corner } from "../components/corner";
import { ScaleUDim, ScaleUDim2 } from "shared/utils/scale";
import { Aspect } from "../components/aspect";
import Container from "../components/container";
import {
	coins,
	combattimer,
	exp,
	hp,
	hunger,
	incombat,
	level,
	maxexp,
	maxhp,
	maxhunger,
	revivetokens,
	sharkcoins,
	title,
} from "../sources";

declare interface Props {
	enabled?: Vide.Derivable<boolean>;
}

export = ({ enabled = true }: Props) => {
	return (
		<screengui ResetOnSpawn={false} IgnoreGuiInset={true} Name="Main" Enabled={enabled}>
			{/* Health Bar */}
			<frame
				Size={ScaleUDim2(0.2, 0.035)}
				Position={ScaleUDim2(0.5, 0.965)}
				ZIndex={1}
				BackgroundColor3={Color3.fromRGB(0, 0, 0)}
				AnchorPoint={new Vector2(0.5, 1)}
			>
				<uistroke
					StrokeSizingMode="ScaledSize"
					Thickness={0.04}
					Color={Color3.fromRGB(255, 255, 255)}
				/>
				<Aspect ratio={7} />
				<Corner scale={0.2} />

				{/* Green bar */}
				<frame
					Size={ScaleUDim2(1, 1)}
					Position={ScaleUDim2(0.5, 0.5)}
					ZIndex={1}
					BackgroundColor3={Color3.fromRGB(61, 224, 61)}
					AnchorPoint={new Vector2(0.5, 0.5)}
				>
					<Corner scale={0.2} />
					<uigradient
						Transparency={() =>
							new NumberSequence([
								new NumberSequenceKeypoint(0, 0),
								new NumberSequenceKeypoint(hp() / maxhp(), 0),
								/* if the hp=maxhp this keypoint is identical to the 1.0 one */
								hp() < maxhp()
									? new NumberSequenceKeypoint(hp() / maxhp() + 0.01, 1)
									: undefined,
								new NumberSequenceKeypoint(1, 1),
							] as NumberSequenceKeypoint[])
						}
					/>
				</frame>

				{/* Red bar */}
				<frame
					Size={ScaleUDim2(1, 1)}
					Position={ScaleUDim2(0.5, 0.5)}
					ZIndex={0}
					BackgroundColor3={Color3.fromRGB(143, 13, 13)}
					AnchorPoint={new Vector2(0.5, 0.5)}
				>
					<Corner scale={0.2} />
				</frame>

				{/* HP Label */}
				<textlabel
					Size={ScaleUDim2(1, 1)}
					Position={ScaleUDim2(0.5, 0.5)}
					BackgroundTransparency={1}
					AnchorPoint={new Vector2(0.5, 0.5)}
					ZIndex={2}
					Text={() => `${hp()}/${maxhp()}`}
					Font="GothamBold"
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextScaled={true}
				/>
			</frame>

			{/* Hunger Bar */}
			<frame
				Size={ScaleUDim2(0.2, 0.035)}
				Position={ScaleUDim2(0.02, 0.99)}
				ZIndex={1}
				BackgroundColor3={Color3.fromRGB(0, 0, 0)}
				AnchorPoint={new Vector2(0, 1)}
			>
				<uistroke
					StrokeSizingMode="ScaledSize"
					Thickness={0.04}
					Color={Color3.fromRGB(255, 255, 255)}
				/>
				<Aspect ratio={7} />
				<Corner scale={0.2} />

				{/* Orange bar */}
				<frame
					Size={ScaleUDim2(1, 1)}
					Position={ScaleUDim2(0.5, 0.5)}
					ZIndex={1}
					BackgroundColor3={Color3.fromRGB(222, 148, 38)}
					AnchorPoint={new Vector2(0.5, 0.5)}
				>
					<Corner scale={0.2} />
					<uigradient
						Transparency={() =>
							new NumberSequence([
								new NumberSequenceKeypoint(0, 0),
								new NumberSequenceKeypoint(hunger() / maxhunger(), 0),
								hunger() < maxhunger()
									? new NumberSequenceKeypoint(hunger() / maxhunger() + 0.01, 1)
									: undefined,
								new NumberSequenceKeypoint(1, 1),
							] as NumberSequenceKeypoint[])
						}
					/>
				</frame>

				{/* Red bar */}
				<frame
					Size={ScaleUDim2(1, 1)}
					Position={ScaleUDim2(0.5, 0.5)}
					ZIndex={0}
					BackgroundColor3={Color3.fromRGB(143, 13, 13)}
					AnchorPoint={new Vector2(0.5, 0.5)}
				>
					<Corner scale={0.2} />
				</frame>

				{/* HP Label */}
				<textlabel
					Size={ScaleUDim2(1, 1)}
					Position={ScaleUDim2(0.5, 0.5)}
					BackgroundTransparency={1}
					AnchorPoint={new Vector2(0.5, 0.5)}
					ZIndex={2}
					Text={() => `${hunger()}/${maxhunger()}`}
					Font="GothamBold"
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextScaled={true}
				/>
			</frame>

			{/* EXP Bar */}
			<frame
				Size={ScaleUDim2(0.5, 0.018)}
				Position={ScaleUDim2(0.5, 0.99)}
				ZIndex={1}
				BackgroundColor3={Color3.fromRGB(0, 0, 0)}
				AnchorPoint={new Vector2(0.5, 1)}
			>
				<uistroke
					StrokeSizingMode="ScaledSize"
					Thickness={0.04}
					Color={Color3.fromRGB(255, 255, 255)}
				/>
				<Aspect ratio={25} />
				<Corner scale={0.4} />

				{/* Purple bar */}
				<frame
					Size={ScaleUDim2(1, 1)}
					Position={ScaleUDim2(0.5, 0.5)}
					ZIndex={1}
					BackgroundColor3={Color3.fromRGB(112, 48, 227)}
					AnchorPoint={new Vector2(0.5, 0.5)}
				>
					<Corner scale={0.4} />
					<uigradient
						Transparency={() =>
							new NumberSequence([
								new NumberSequenceKeypoint(0, 0),
								new NumberSequenceKeypoint(exp() / maxexp(), 0),
								exp() < maxexp()
									? new NumberSequenceKeypoint(exp() / maxexp() + 0.01, 1)
									: undefined,
								new NumberSequenceKeypoint(1, 1),
							] as NumberSequenceKeypoint[])
						}
					/>
				</frame>

				{/* Violet bar */}
				<frame
					Size={ScaleUDim2(1, 1)}
					Position={ScaleUDim2(0.5, 0.5)}
					ZIndex={0}
					BackgroundColor3={Color3.fromRGB(36, 18, 74)}
					AnchorPoint={new Vector2(0.5, 0.5)}
				>
					<Corner scale={0.4} />
				</frame>

				{/* EXP Label */}
				<textlabel
					Size={ScaleUDim2(1, 1)}
					Position={ScaleUDim2(0.5, 0.5)}
					BackgroundTransparency={1}
					AnchorPoint={new Vector2(0.5, 0.5)}
					ZIndex={2}
					Text={() => `${exp()}/${maxexp()}`}
					Font="GothamBold"
					TextColor3={Color3.fromRGB(255, 255, 255)}
					TextScaled={true}
				/>
			</frame>

			{/* Level Label */}
			<textlabel
				Size={ScaleUDim2(0.5, 0.023)}
				Position={ScaleUDim2(0.5, 0.925)}
				BackgroundTransparency={1}
				AnchorPoint={new Vector2(0.5, 1)}
				ZIndex={2}
				Text={() => `<i>Level</i> <font face = 'GothamBlack'>${level()}</font>`}
				RichText={true}
				Font="GothamMedium"
				TextColor3={Color3.fromRGB(255, 255, 255)}
				TextScaled={true}
			/>

			{/* Title Label */}
			<textlabel
				Size={ScaleUDim2(0.5, 0.027)}
				Position={ScaleUDim2(0.5, 0.905)}
				BackgroundTransparency={1}
				AnchorPoint={new Vector2(0.5, 1)}
				ZIndex={2}
				Text={() => `${title()}`}
				RichText={true}
				Font="GothamBold"
				TextColor3={Color3.fromRGB(255, 255, 255)}
				TextScaled={true}
			/>

			{/* Top Bar */}
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

				{/* TODO: finish phase 1, make the topbar */}
			</Container>

			{/* Combat timer */}
			<textlabel
				Size={ScaleUDim2(0.5, 0.057)}
				Position={ScaleUDim2(0.5, 0.4)}
				BackgroundTransparency={1}
				AnchorPoint={new Vector2(0.5, 1)}
				ZIndex={2}
				Text={() => `IN COMBAT\n<font face = 'GothamBlack'>${combattimer()}</font>s`}
				RichText={true}
				Font="GothamMedium"
				TextColor3={Color3.fromRGB(240, 28, 28)}
				TextScaled={true}
				Visible={() => incombat()}
			/>
		</screengui>
	);
};
