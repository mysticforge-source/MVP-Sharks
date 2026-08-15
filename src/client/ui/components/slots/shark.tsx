interface Props {
	id: number;
	on_click: () => void;
}

import Vide, { derive, source, spring } from "@rbxts/vide";
import { selectedshark, shownshark } from "client/ui/sources";
import { sharkcatalog } from "shared/data";

export = ({ id, on_click }: Props) => {
	const sharkData = sharkcatalog[id];
	const name = sharkData.name;

	return (
		<textbutton
			className={() => [
				//`w-[${sizeSpring()}] h-[${sizeSpring()}]`,
				"size-20 active:bg-green-400 flex items-end bg-slate-600 hover:ring-green-400 hover:ring-4 transition-all duration-300 ease-out rounded-lg",
				shownshark() === id ? "bg-green-400" : "",
			]}
			Activated={on_click}
		>
			<textlabel
				className="w-full border-[2] border-neutral-800 h-15 mb-1 text-white text-base font-bold align-bottom text-wrap"
				Text={name}
			/>
		</textbutton>
	);
};
