import { Controller, OnStart } from "@flamework/core";
import { ReplicatedStorage, Workspace } from "@rbxts/services";
import { clientMaid } from "client/clientmaid";
import { SpawnController } from "./spawncontroller";

@Controller()
/**
 * Attaches models to hitboxservice's hitboxes
 */
export class ViewController implements OnStart {
	constructor(private readonly spawncontroller: SpawnController) {}

	protected maid = clientMaid.sub();

	/** Gets and clones the model from Models */
	public cloneModel(name: string): Model | undefined {
		const model = ReplicatedStorage.Models.FindFirstChild(name);
		if (model) {
			return model.Clone() as Model;
		}
	}

	/** Adds alignposition into the model, positions it in the workspace */
	public attachModel(
		hitbox: Model & { ViewAttachment: Attachment },
		model: Model & { Attachment: Attachment },
	): void {
		const attach = hitbox.ViewAttachment;

		// configure the model to be able to follow the hitbox
		const followpos = new Instance("AlignPosition");
		followpos.Mode = Enum.PositionAlignmentMode.TwoAttachment;
		followpos.Attachment0 = model.Attachment;
		followpos.Attachment1 = attach;
		followpos.MaxForce = math.huge;
		followpos.Responsiveness = 50;

		followpos.Parent = model;

		model.Parent = Workspace;
	}

	public onStart(): void {
		this.maid.on(this.spawncontroller.HitboxAdded, (model: Model) => {});
	}
}
