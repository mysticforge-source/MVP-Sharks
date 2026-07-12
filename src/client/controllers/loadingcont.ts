import { OnInit } from "@flamework/core";
import { ReplicatedStorage } from "@rbxts/services";
import { animdata } from "shared/data";

type SharkModel = Model & {
	AnimationController: AnimationController & {
		Animator: Animator;
	};
	// the animation storage:
} & Record<keyof typeof animdata, string>;

export class LoadingController implements OnInit {
	public loadedData = {
		ModelAnims: {} as Record<string, AnimationTrack>,
	};

	onInit(): void | Promise<void> {
		// load animations
		for (const shark of ReplicatedStorage.Models.GetChildren() as SharkModel[]) {
			// keep created animations inside of the shark models
			// for accessibility
			for (let animName in animdata) {
				const newAnim = new Instance("Animation");
				newAnim.Name = animName;
				newAnim.AnimationId = animdata[animName as keyof typeof animdata];
				newAnim.Parent = shark;

				this.loadedData.ModelAnims[animName] = shark.AnimationController.Animator.LoadAnimation(newAnim);
			}
		}
	}
}
