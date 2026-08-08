import Vide from "@rbxts/vide";
import Topbar from "../components/topbar";

declare interface Props {
	enabled?: Vide.Derivable<boolean>;
}

export = ({ enabled = true }: Props) => {
	return (
		<screengui ResetOnSpawn={false} IgnoreGuiInset={true} Name="Main" Enabled={enabled}>
			<Topbar />
		</screengui>
	);
};
