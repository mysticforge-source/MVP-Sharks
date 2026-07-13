import { Workspace } from "@rbxts/services";
import { Hitbox } from "client/controllers/viewcont";
import { HitboxesVisible } from "client/state/viewstate";

export default class {
	/** Moves the model to the hitbox */
	public attachModel(hitbox: Hitbox, model: Model) {
		model.PrimaryPart?.PivotTo(hitbox.ViewAttachment.WorldCFrame);
	}

	/** Updates visibility of all hitboxes present */
	public updateHitboxesVisibility() {
		for (const hitbox of Workspace.Shared.Hitboxes.GetChildren() as MeshPart[]) {
			hitbox.Transparency = HitboxesVisible() ? 0 : 1;
		}
	}
}
