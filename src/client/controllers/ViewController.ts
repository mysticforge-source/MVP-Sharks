import { clientMaid } from "client/clientmaid";
import { SharkViewComponent } from "client/state/components";
import { HitboxesVisible } from "client/state/viewstate";
import { idtoshark } from "shared/data";
import { World } from "shared/ecs/world";

import { Controller, OnStart } from "@flamework/core";
import { CompositeActionBuilder, StandardActionBuilder } from "@rbxts/mechanism";
import { Players, ReplicatedStorage, Workspace } from "@rbxts/services";

import { SpawnController } from "./SpawnController";
import InputTools from "shared/utils/inputTools";

export type Shark = {
	sharkModel: Model;
	hitbox: Hitbox;
};

export type Hitbox = MeshPart & {
	ViewAttachment: Attachment;
	SharkViewValue: IntValue;
};

@Controller()
/* attaches models to hitboxservice's hitboxes */
export class ViewController implements OnStart {
	constructor(private readonly spawncontroller: SpawnController) {}

	protected maid = clientMaid.sub();

	public inputs = {
		ToggleHitboxes: new CompositeActionBuilder("LeftControl", "H").setTiming(1),
	};

	/* gets and clones the model from models */
	public cloneModel(name: string): Model | undefined {
		const model = ReplicatedStorage.Models.FindFirstChild(name);
		if (model) {
			return model.Clone() as Model;
		}
	}

	/* connected to spawncontroller.hitboxadded, creates the shark entity */
	public HitboxAttached(hitbox: Hitbox) {
		const sharkName = idtoshark[hitbox.SharkViewValue.Value];
		const model = this.cloneModel(sharkName) as Model & {
			Attachment: Attachment;
		};

		model.Parent = Workspace.Client.Models;

		// creating the shark's state immediately attaches it to viewsystem
		const sharkEntity = World.entity();
		World.set(sharkEntity, SharkViewComponent, {
			sharkModel: model,
			hitbox: hitbox,
		});

		this.maid.add(() => World.delete(sharkEntity));
	}

	public onStart(): void {
		this.maid.on(this.spawncontroller.HitboxAdded, (h) => this.HitboxAttached(h));

		this.inputs.ToggleHitboxes.activated.Connect(() => {
			print("111");
			HitboxesVisible(!HitboxesVisible());
			const authorityFolder = Workspace.FindFirstChild("ServerAuthority");
			if (authorityFolder) {
				for (const hitbox of authorityFolder.GetChildren() as MeshPart[]) {
					if (hitbox.IsA("BasePart")) {
						hitbox.Transparency = HitboxesVisible() ? 0 : 1;
					}
				}
			}
		});

		InputTools.bindAll(this.inputs);
	}
}
