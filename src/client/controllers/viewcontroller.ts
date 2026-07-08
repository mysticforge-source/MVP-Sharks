import { Controller, OnStart } from "@flamework/core";
import { Players, ReplicatedStorage, Workspace } from "@rbxts/services";
import { clientMaid } from "client/clientmaid";
import { SpawnController } from "./spawncontroller";
import { idtoshark } from "shared/data";

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
		hitbox: MeshPart & { ViewAttachment: Attachment },
		model: Model & { Attachment: Attachment },
	): void {
		const attach = hitbox.ViewAttachment;

		// TODO: make the model anchored,
		// make a new interface Shark for storing a shark and its hitbox
		// make an array, make a system that moves sharks to their hitbox cframes
		// every render

		warn("NEW MODEL");

		model.PrimaryPart?.PivotTo(hitbox.GetPivot());
		model.PrimaryPart!.CFrame = hitbox.CFrame;
		model.Parent = Workspace.Client.Models;
	}

	public onStart(): void {
		this.maid.on(
			this.spawncontroller.HitboxAdded,
			(hitbox: MeshPart & { ViewAttachment: Attachment; SharkViewValue: IntValue }) => {
				const sharkName = idtoshark[hitbox.SharkViewValue.Value];
				const model = this.cloneModel(sharkName) as Model & { Attachment: Attachment };
				this.attachModel(hitbox, model);
			},
		);
	}
}
