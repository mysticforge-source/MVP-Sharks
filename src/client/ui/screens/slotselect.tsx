import Vide from "@rbxts/vide";
import Topbar from "../components/topbar";
import Container from "../components/container";
import { ScaleUDim, ScaleUDim2 } from "shared/utils/scale";
import { Aspect } from "../components/aspect";
import Slot from "../components/slot";

declare interface Props {
	enabled?: Vide.Derivable<boolean>;
}

export = ({ enabled = true }: Props) => {
	return (
		<screengui ResetOnSpawn={false} IgnoreGuiInset={true} Name="Main" Enabled={enabled}>
			<Topbar />
			<Container Size={ScaleUDim2(0.6, 0.6)}>
				<Aspect ratio={1.9} />
				<uilistlayout
					HorizontalAlignment="Center"
					VerticalAlignment="Center"
					Padding={ScaleUDim(0.04)}
					FillDirection="Horizontal"
				/>
				<Slot slotnumber={1} />
				<Slot slotnumber={2} />
				<Slot slotnumber={3} />
			</Container>
		</screengui>
	);
};
