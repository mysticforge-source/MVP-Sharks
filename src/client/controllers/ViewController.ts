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
import { Entity } from "@rbxts/jecs";
import { getModelSize, getSize } from "shared/utils/ageLevel";

export type Shark = {
	sharkModel: Model;
	defaultsharkModel: Model;
	sharkId: number;
	hitbox: Hitbox;
};

export type Hitbox = MeshPart & {
	ViewAttachment: Attachment;
	SharkViewValue: IntValue;
};

export const PlayerToSharkEntity = new Map<Player, Entity>();

@Controller()
/* attaches models to hitboxservice's hitboxes */
export class ViewController implements OnStart {
	constructor(private readonly spawncontroller: SpawnController) {}

	protected maid = clientMaid.sub();

	public inputs = {
		ToggleHitboxes: new CompositeActionBuilder("LeftControl", "H").setTiming(1),
	};

	public getDefaultModel(name: string): Model | undefined {
		return ReplicatedStorage.Models.FindFirstChild(name) as Model;
	}

	/* gets and clones the model from models */
	public cloneModel(name: string): Model | undefined {
		const model = this.getDefaultModel(name);
		if (model) {
			return model.Clone() as Model;
		}
	}

	public updateModelSize(player: Player, level: number) {
		const sharkEntity = PlayerToSharkEntity.get(player);
		if (!sharkEntity) return;

		const data = World.get(sharkEntity, SharkViewComponent);
		if (!data) return;

		const size = getModelSize(data?.sharkId, level, data.defaultsharkModel);
		data.sharkModel.ScaleTo(size);
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
			defaultsharkModel: this.getDefaultModel(sharkName) as Model,
			sharkModel: model,
			sharkId: hitbox.SharkViewValue.Value,
			hitbox: hitbox,
		});

		PlayerToSharkEntity.set(Players.LocalPlayer, sharkEntity);

		this.maid.add(() => World.delete(sharkEntity));
	}

	public onStart(): void {
		this.maid.on(this.spawncontroller.HitboxAdded, (h) => this.HitboxAttached(h));

		this.inputs.ToggleHitboxes.activated.Connect(() => {
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
