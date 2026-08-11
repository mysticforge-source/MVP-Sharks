import { effect, source, Source, spring } from "@rbxts/vide";
import Vide from "@rbxts/vide";

export default ({ enabled }: { enabled: Source<boolean> }) => {
	const quithovered = source(false);

	const returnml = source(20);
	const [returnmlspring] = spring(returnml, 0.3);

	return (
		<>
			{/* effects */}
			{effect(() => returnml(quithovered() ? 0 : 20))}

			{/* shark selection */}
			<frame className="flex items-center justify-start p-10 w-full h-full">
				<frame className="w-110 h-190 bg-slate-800 ring-1 ring-slate-500 rounded-2xl">
					{/* top bar */}
					<frame className="w-full h-22 flex p-10">
						{/* return button */}
						<textbutton
							className={() => [
								`w-22 h-full ring-[3] ring-red-900 bg-gradient-to-br from-red-500 to-rose-700 rounded-xl`,
								`ml-[${returnmlspring()}]`,
							]}
							MouseEnter={() => quithovered(true)}
							MouseLeave={() => quithovered(false)}
						>
							<textlabel
								className={() => [
									"w-[90%] h-[90%] text-8xl font-serif border-2 border-black text-white font-black",
									// `mr-[${returnmlspring() * 2}]`,
								]}
								Text="<"
							/>
						</textbutton>
					</frame>

					{/* sharks */}
					<frame className="w-full h-80 bg-slate"></frame>
				</frame>
			</frame>

			{/* shark name label */}
			<frame className="flex items-start justify-center w-full h-full p-10">
				<textlabel
					className="text-6xl text-white font-black border-[2.5] border-black"
					Text="Minawii"
				/>
			</frame>
		</>
	);
};
