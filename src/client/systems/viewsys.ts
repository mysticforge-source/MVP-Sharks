import viewmodelattach from "client/logic/ViewLogic";
import { SharkViewComponent } from "client/state/components";
import { World } from "shared/ecs/world";

const viewLogic = new viewmodelattach();

export default (dt: number) => {
	for (const [entity, data] of World.query(SharkViewComponent)) {
		viewLogic.attachModel(data.hitbox, data.sharkModel);
	}
};
