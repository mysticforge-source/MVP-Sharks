import {
	AddExpIntent,
	DirtyPlayComponent,
	LevelupIntent,
	PlayComponent,
	SystemHelperComponent,
} from "server/components";
import { EntityToPlayer } from "server/services/DataService";
import { World } from "shared/ecs/world";
import { UpdatePlayerLevel } from "shared/logic/GameSimulation";

const config = {
	test_exp_dt: 0.3,
	test_exp_amount: 13,
};

export default (dt: number) => {
	// TESTING: add exp periodically
	// POINT: we don't need the PlayComponent data directly
	for (const [entity, helperdata] of World.query(SystemHelperComponent)) {
		let newhelperdata = { ...helperdata };

		// add exp all the time
		newhelperdata.test_exp_t += dt;

		if (newhelperdata.test_exp_t >= config.test_exp_dt) {
			newhelperdata.test_exp_t -= config.test_exp_dt;
			World.set(entity, AddExpIntent, config.test_exp_amount);
		}

		World.set(entity, SystemHelperComponent, newhelperdata);
	}

	/* Handle add exp intent */
	for (const [entity, data, addexp] of World.query(PlayComponent, AddExpIntent)) {
		let newdata = { ...data };

		newdata.exp += addexp;
		World.remove(entity, AddExpIntent);

		/* Handle multiple level-ups */
		// Doing this in one frame will absolve us from multiple level-ups filling
		// network bandwidth, however
		if (newdata.exp >= newdata.maxexp) {
			// assign level-up intent
			World.add(entity, LevelupIntent);
		}

		World.set(entity, PlayComponent, newdata);
		World.add(entity, DirtyPlayComponent);
	}
};
