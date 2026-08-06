import { PlayComponent, SystemHelperComponent } from "server/components";
import { World } from "shared/ecs/world";

const config = {
	hungerdraintime: 2,
	hungerdrainamount: 13,

	hpdraintime: 1,
	hpdrainamount: 7,
};

/** Drains hunger of each PlayComponent entity every hungerdraintime */
export default (dt: number) => {
	for (const [entity, data, helperdata] of World.query(PlayComponent, SystemHelperComponent)) {
		let newhelperdata = { ...helperdata };
		let newdata = { ...data };

		// drain hunger
		if (newdata.hunger > 0) {
			// is hunger draining when hunger === 0?
			newhelperdata.hungertime += dt;

			if (newhelperdata.hungertime > config.hungerdraintime) {
				// update syshelper
				warn("drain hunger");

				newhelperdata.hungertime -= config.hungerdraintime;

				// update hunger
				newdata.hunger = math.max(newdata.hunger - config.hungerdrainamount, 0);
			}
		}

		// drain hp if hunger == 0

		if (newdata.hunger <= 0) {
			// count time for hp ONLY when hunger === 0
			newhelperdata.hpdraintime += dt;

			if (newhelperdata.hpdraintime > config.hpdraintime) {
				// update syshelper
				warn("drain hp");
				newhelperdata.hpdraintime -= config.hpdraintime;

				// update hp
				newdata.hp = math.max(newdata.hp - config.hpdrainamount, 0);
			}
		}

		World.set(entity, SystemHelperComponent, newhelperdata);
		World.set(entity, PlayComponent, newdata);
	}
};
