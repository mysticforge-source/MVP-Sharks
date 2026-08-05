import { PlayComponent, SystemHelperComponent } from "server/components";
import { World } from "shared/ecs/world";

const config = {
	hungerdraintime: 10,
	hungerdrainamount: 5,

	hpdraintime: 2,
	hpdrainamount: 5,
};

/** Drains hunger of each PlayComponent entity every hungerdraintime */
export default (dt: number) => {
	for (const [entity, data, helperdata] of World.query(PlayComponent, SystemHelperComponent)) {
		// update time
		World.set(entity, SystemHelperComponent, {
			...helperdata,
			hungertime: helperdata.hungertime + dt,
			hpdraintime: helperdata.hpdraintime + dt,
		});

		// drain hunger
		if (data.hunger > 0 && helperdata.hungertime > config.hungerdraintime) {
			// update syshelper
			World.set(entity, SystemHelperComponent, {
				...helperdata,
				hungertime: helperdata.hungertime - config.hungerdraintime,
			});

			// update hunger
			World.set(entity, PlayComponent, {
				...data,
				hunger: math.max(data.hunger - config.hungerdrainamount, 0),
			});
		}

		// drain hp if hunger == 0
		if (data.hunger <= 0 && helperdata.hpdraintime > config.hpdraintime) {
			// update syshelper
			World.set(entity, SystemHelperComponent, {
				...helperdata,
				hpdraintime: helperdata.hpdraintime - config.hpdraintime,
			});

			// update hp
			World.set(entity, PlayComponent, {
				...data,
				hp: math.max(data.hp - config.hpdrainamount, 0),
			});
		}
	}
};
