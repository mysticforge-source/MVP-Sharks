import {
	DamageIntent,
	DirtyPlayComponent,
	PlayComponent,
	SystemHelperComponent,
} from "server/components";
import { World } from "shared/ecs/world";

const config = {
	hungerdraintime: 2,
	hungerdrainamount: 3,

	hpdraintime: 2,
	hpdrainamount: 3,
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
				newhelperdata.hungertime -= config.hungerdraintime;

				// update hunger
				newdata.hunger = math.max(newdata.hunger - config.hungerdrainamount, 0);
				World.add(entity, DirtyPlayComponent);
			}
		}

		// drain hp if hunger == 0

		if (newdata.hunger <= 0) {
			// count time for hp ONLY when hunger === 0
			newhelperdata.hpdraintime += dt;

			if (newhelperdata.hpdraintime > config.hpdraintime) {
				// update syshelper
				newhelperdata.hpdraintime -= config.hpdraintime;

				// update hp
				newdata.hp = math.max(newdata.hp - config.hpdrainamount, 0);
				World.add(entity, DirtyPlayComponent);
			}
		}

		World.set(entity, SystemHelperComponent, newhelperdata);
		World.set(entity, PlayComponent, newdata);
	}

	// handle damage intents
	for (const [entity, data, damage] of World.query(PlayComponent, DamageIntent)) {
		World.remove(entity, DamageIntent);

		World.set(entity, PlayComponent, {
			...data,
			hp: math.max(data.hp - damage, 0),
		});
	}
};
