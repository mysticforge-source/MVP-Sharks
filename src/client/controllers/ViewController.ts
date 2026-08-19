import { clientMaid } from "client/clientmaid";
import { NPCViewComponent, SharkViewComponent } from "client/state/components";
import { HitboxesVisible } from "client/state/viewstate";
import { sharkcatalog } from "shared/data";
import { World } from "shared/ecs/world";

import { Controller, OnStart } from "@flamework/core";
import { CompositeActionBuilder, StandardActionBuilder } from "@rbxts/mechanism";
import { Players, ReplicatedStorage, Workspace } from "@rbxts/services";

import { SpawnController } from "./SpawnController";
import InputTools from "shared/utils/inputTools";
import { Entity } from "@rbxts/jecs";
import { getModelSize, getSize } from "shared/utils/ageLevel";
import { level } from "client/ui/sources";

export type Shark = {
	sharkModel: Model;
	defaultsharkModel: Model;
	sharkId: number;
	level: number;
	hitbox: Hitbox;
};

export type NPC = {
	npcModel: Model;
	npcId: number;
	level: number;
	hitbox: Hitbox;
};

export type Hitbox = MeshPart & {
	ViewAttachment: Attachment;
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

	public updateModelSize(player: Player) {
		const sharkEntity = PlayerToSharkEntity.get(player);
		if (!sharkEntity) return;

		const data = World.get(sharkEntity, SharkViewComponent);
		if (!data) return;

		const size = getModelSize(data?.sharkId, data.level, data.defaultsharkModel);
		data.sharkModel.ScaleTo(size);
	}

	/* connected to spawncontroller.hitboxadded, creates the shark entity */
	public HitboxAttached(hitbox: Hitbox) {
		const sharkId = hitbox.GetAttribute("SharkId") as number;
		const npcId = hitbox.GetAttribute("NpcId") as number;

		// Its a player
		if (sharkId !== undefined) {
			const sharkData = sharkcatalog[sharkId];
			const viewmodelName = sharkData.viewmodelname;

			const model = this.cloneModel(viewmodelName) as Model & {
				Attachment: Attachment;
			};

			model.Parent = Workspace.Client.Models;

			// creating the shark's state immediately attaches it to viewsystem
			const sharkEntity = World.entity();
			World.set(sharkEntity, SharkViewComponent, {
				defaultsharkModel: this.getDefaultModel(viewmodelName) as Model,
				sharkModel: model,
				sharkId: sharkId,
				level: hitbox.GetAttribute("Level") as number,
				hitbox: hitbox,
			});

			PlayerToSharkEntity.set(Players.LocalPlayer, sharkEntity);

			this.updateModelSize(Players.LocalPlayer);

			this.maid.add(() => World.delete(sharkEntity));
		}

		// Its a npc
		if (npcId !== undefined) {
			const npcData = sharkcatalog[npcId];
			const viewmodelName = npcData.viewmodelname;

			const model = this.cloneModel(viewmodelName) as Model & {
				Attachment: Attachment;
			};

			model.Parent = Workspace.Client.Models;

			// creating the npc entity immediately attaches it to viewsystem
			const npcEntity = World.entity();
			World.set(npcEntity, NPCViewComponent, {
				npcModel: model,
				npcId: npcId,
				level: hitbox.GetAttribute("Level") as number,
				hitbox: hitbox,
			});
		}
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
