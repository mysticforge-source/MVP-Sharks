/*
 * view system: syncs shark models to hitboxes
 * runs on render thread via cyclecontroller
 */

import { NPCViewComponent, SharkViewComponent } from "client/state/components";
import { World } from "shared/ecs/world";

const npc_lerpSpeed = 2.5;

export default (dt: number) => {
	// render player models
	for (const [entity, data] of World.query(SharkViewComponent)) {
		data.sharkModel.PrimaryPart?.PivotTo(data.hitbox.ViewAttachment.WorldCFrame);
	}

	// render npc models
	for (const [entity, data] of World.query(NPCViewComponent)) {
		data.npcModel.PrimaryPart?.PivotTo(
			data.npcModel.PrimaryPart?.CFrame.Lerp(
				data.hitbox.ViewAttachment.WorldCFrame,
				1 - math.exp(-npc_lerpSpeed * dt),
			),
		);

		// data.npcModel.PrimaryPart?.PivotTo(data.hitbox.ViewAttachment.WorldCFrame);
	}
};
