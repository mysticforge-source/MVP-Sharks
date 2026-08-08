import Vide, { derive, effect, spring } from "@rbxts/vide";
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
	//title,
} from "../sources";
import { getTitle } from "shared/utils/ageLevel";
import Topbar from "../components/topbar";

declare interface Props {
	enabled?: Vide.Derivable<boolean>;
}

export = ({ enabled = true }: Props) => {
	const [hungerspring] = spring(hunger, 0.4);
	const [hpspring] = spring(hp, 0.4);

	const title = derive(() => getTitle(level()));

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
								new NumberSequenceKeypoint(hpspring() / maxhp(), 0),
								new NumberSequenceKeypoint(
									math.min(hpspring() / maxhp() + 0.01, 1.0),
									1,
								),
								// if hp < maxhp, include an end point
								hpspring() / maxhp() + 0.01 < 1.0
									? new NumberSequenceKeypoint(1, 1)
									: undefined,
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
								new NumberSequenceKeypoint(hungerspring() / maxhunger(), 0),
								new NumberSequenceKeypoint(
									math.min(hungerspring() / maxhunger() + 0.01, 1.0),
									1,
								),
								// if hunger < maxhunger, include an end point
								hungerspring() / maxhunger() + 0.01 < 1.0
									? new NumberSequenceKeypoint(1, 1)
									: undefined,
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
			<Topbar />

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
