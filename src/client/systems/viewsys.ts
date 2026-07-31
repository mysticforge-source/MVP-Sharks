/*
 * view system: syncs shark models to hitboxes
 * runs on render thread via cyclecontroller
 */

import { SharkViewComponent } from "client/state/components";
import { World } from "shared/ecs/world";

export default (dt: number) => {
	for (const [entity, data] of World.query(SharkViewComponent)) {
		data.sharkModel.PrimaryPart?.PivotTo(data.hitbox.ViewAttachment.WorldCFrame);
	}
};
