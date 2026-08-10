/* title screen button component */

import Vide, { effect, source, spring } from "@rbxts/vide";

interface Props {
	text: string;
	onClick: () => void;
}

export = ({ text, onClick }: Props) => {
	const hovered = source(false);

	return (
		<frame
			className={() => [
				"bg-slate-800 border flex items-center justify-around border-slate-500 w-60 h-12 rounded-xl",
				hovered() ? "bg-blue-600 border-blue-400" : "",
			]}
			MouseEnter={() => hovered(true)}
			MouseLeave={() => hovered(false)}
		>
			<textbutton
				className={() => [
					"w-30 h-full text-center text-white font-mono font-thin text-2xl",
					hovered() ? "font-bold" : "",
				]}
				Text={text}
				Activated={onClick}
			/>
		</frame>
	);
};
