interface Props {
	name: string;
}

import Vide from "@rbxts/vide";

export = ({ name }: Props) => {
	return (
		<frame className="flex items-end w-20 h-20 bg-gradient-to-br from-blue to-violet-500 rounded-md">
			<textlabel
				className="w-full border-[2] border-neutral-800 h-15 mb-1 text-white text-lg font-bold align-bottom text-wrap"
				Text={name}
			/>
		</frame>
	);
};
