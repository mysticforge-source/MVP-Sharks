import { derive, effect, source, Source, spring } from "@rbxts/vide";
import Vide from "@rbxts/vide";
import { Menu, ownedsharks, selectedshark, selectedslot, shark, shownshark } from "../sources";
import Shark from "../components/slots/shark";
import { ReplicatedStorage } from "@rbxts/services";
import { animdata, sharkcatalog } from "shared/data";
import { ModuleResolutionKind } from "typescript";
import { SpawnSlot } from "client/network/client";

export default ({ enabled }: { enabled: Source<boolean> }) => {
	const quithovered = source(false);

	const returnml = source(20);
	const [returnmlspring] = spring(returnml, 0.3);

	effect(() => returnml(quithovered() ? 10 : 30));

	const sharkdata = derive(() => sharkcatalog[shownshark()]);
	const sharkmodel = derive(
		() => ReplicatedStorage.Models[sharkdata().viewmodelname as keyof {}] as Model,
	);

	const IDLE_ANIM = new Instance("Animation");
	IDLE_ANIM.AnimationId = animdata.UniversalIdle;

	return (
		<screengui ResetOnSpawn={false} IgnoreGuiInset={true} Name="Sharkselect" Enabled={enabled}>
			{/* shark selection */}
			<frame className="flex items-center justify-start p-10 w-full h-full">
				<frame className="w-110 h-190 bg-slate-800 ring-1 ring-slate-500 rounded-2xl">
					{/* top bar */}
					<frame className="w-full h-15 mt-3">
						{/* return button */}
						<textbutton
							className={() => [
								`w-27 h-full ring-[3] ring-red-900 bg-gradient-to-br from-red-500 to-rose-700 rounded-xl`,
								`ml-[${returnmlspring()}]`,
							]}
							MouseEnter={() => quithovered(true)}
							MouseLeave={() => quithovered(false)}
							Activated={() => Menu("Slot")}
						>
							<textlabel
								className={() => [
									"w-full h-[90%] text-8xl font-serif border-2 border-black text-white font-black",
									// `mr-[${returnmlspring() * 2}]`,
								]}
								Text="<"
							/>
						</textbutton>
					</frame>

					{/* sharks */}
					<scrollingframe className="w-full h-140 mt-20 flex p-6 gap-2 items-start justify-center flex-wrap">
						{/* Loop for owned sharks then load locked sharks */}
						{ownedsharks().map((sharkId) => (
							<Shark
								id={sharkId}
								on_click={() => {
									shownshark(sharkId);
									// if the shark is owned, immediately select it
									if (ownedsharks().includes(sharkId)) shark(sharkId);
								}}
							/>
						))}
					</scrollingframe>
				</frame>
			</frame>

			{/* shark name label */}
			<frame className="flex items-start justify-center w-full h-full p-10">
				<textlabel
					className="text-6xl text-white font-black border-[2.5] border-black"
					Text={`${sharkdata().name}`}
				/>
			</frame>

			{/* Shark viewport */}
			<viewportframe
				Size={new UDim2(0.7, 0, 0.8, 0)}
				Position={new UDim2(0.5, 0, 0.5, 0)}
				BackgroundTransparency={1}
				AnchorPoint={new Vector2(0.5, 0.5)}
				ZIndex={0}
				Ambient={Color3.fromRGB(153, 196, 255)}
				LightDirection={new Vector3(-1, -1, -1)}
				LightColor={Color3.fromRGB(255, 255, 255)}
				CurrentCamera={() =>
					(
						<camera
							CFrame={CFrame.lookAt(
								new Vector3(2, 0.5, 5).mul(2), //distance
								new Vector3(0, 0, 0), //target
							)}
							CameraType="Scriptable"
						/>
					) as Camera
				}
			>
				{() => {
					const clone = sharkmodel().Clone();

					const animator = clone
						.FindFirstChild("AnimationController")
						?.FindFirstChild("Animator") as Animator;

					const track = animator.LoadAnimation(IDLE_ANIM);
					track.Looped = true;

					clone.PivotTo(
						new CFrame(0, 0, 0).mul(
							CFrame.fromEulerAnglesXYZ(math.rad(0), math.rad(250), 0),
						),
					);

					// TODO: FIGURE OUT HOW TO ANIMATE IT

					return clone;
				}}
			</viewportframe>

			{/* Shark stats */}
			<frame className="flex-col p-5 w-80 h-200 bg-slate-800 right-50 top-[50%] origin-center rounded-lg">
				<textlabel
					className="w-full h-10 text-4xl text-left text-white font-bold"
					Text="Primary Stats"
				/>
				{/* HP */}
				<frame className="flex w-full p-20 h-5 mt-5 mb-2 justify-evenly items-center">
					<textlabel
						className="w-30 h-10 mr-15 ml-5 text-2xl align-middle text-left text-lime font-semibold"
						Text="Health"
					/>
					<textlabel
						className="w-20 h-10 text-4xl text-right italic text-white font-normal"
						Text={() => `${sharkdata().speed}`}
					/>
				</frame>
				{/* DMG */}
				<frame className="flex w-full p-20 h-5 mt-2 mb-2 justify-evenly items-center">
					<textlabel
						className="w-30 h-10 mr-15 ml-5 text-2xl align-middle text-left text-red-600 font-semibold"
						Text="Damage"
					/>
					<textlabel
						className="w-20 h-10 text-4xl text-right italic text-white font-normal"
						Text={() => `${sharkdata().damage}`}
					/>
				</frame>
				{/* Speed */}
				<frame className="flex w-full p-20 h-5 mt-2 mb-2 justify-evenly items-center">
					<textlabel
						className="w-30 h-10 mr-15 ml-5 text-2xl align-middle text-left text-blue font-semibold"
						Text="Speed"
					/>
					<textlabel
						className="w-20 h-10 text-4xl text-right italic text-white font-normal"
						Text={() => `${sharkdata().speed}`}
					/>
				</frame>
				{/* Size */}
				<frame className="flex w-full p-20 h-5 mt-2 mb-2 justify-evenly items-center">
					<textlabel
						className="w-30 h-10 mr-15 ml-5 text-2xl align-middle text-left text-slate-300 font-semibold"
						Text="Size"
					/>
					<textlabel
						className="w-20 h-10 text-4xl text-right italic text-white font-normal"
						Text={() => `${math.round(sharkmodel().GetExtentsSize().Z)}`}
					/>
				</frame>
			</frame>

			{/* Bottom div */}
			<frame className="flex items-end justify-center w-full h-full p-15">
				{/* Purchase button */}
				<textbutton
					className="hidden text-5xl bg-green-400 w-80 h-14 rounded-xl align-middle text-white font-black border-[2.5] border-black"
					Text={`Purchase (${sharkdata().cost})`}
					// TODO ACTIVATED
				/>
				{/* Select button */}
				<textbutton
					className="text-5xl bg-blue-600 w-80 h-14 rounded-xl align-middle text-white font-black border-[2.5] border-black"
					Text={`GO!`}
					Activated={() => {
						SpawnSlot.fire({ slot: selectedslot(), shark: shark() });
					}}
				/>
			</frame>
		</screengui>
	);
};
