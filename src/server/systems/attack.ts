import {
	AttackIntent,
	DamageIntent,
	NPC_Data,
	NPC_Health,
	NPC_Hitbox,
	PlayComponent,
	SystemHelperComponent,
} from "server/components";
import { EntityToHitbox, NPC_EntityToHitbox } from "server/services/HitboxService";
import { npccatalog, sharkcatalog } from "shared/data";
import { World } from "shared/ecs/world";

export default (dt: number) => {
	for (const [entity, data, syshelper] of World.query(
		PlayComponent,
		SystemHelperComponent,
		AttackIntent,
	)) {
		let newhelperdata = { ...syshelper };
		const hitbox = EntityToHitbox.get(entity);

		World.remove(entity, AttackIntent);

		// visuals
		hitbox?.SetAttribute("AttackAmount", (hitbox.GetAttribute("AttackAmount") as number) + 1);

		// tick time
		newhelperdata.time_next_attack -= dt;

		warn("HANDLING ATTACK");

		const sharkData = sharkcatalog[data.shark];

		// check if they attacked in-time
		if (newhelperdata.time_next_attack <= 0) {
			warn("IN TIME!");

			newhelperdata.time_next_attack = sharkData.damagecooldown;

			// firstly, npcs
			for (const [npc_entity, npcdata, npchp] of World.query(NPC_Data, NPC_Health)) {
				// if their hitbox is near

				const npchitbox = NPC_EntityToHitbox.get(npc_entity);

				if (
					(npchitbox as MeshPart).Position.sub(hitbox?.Position!).Magnitude <=
					sharkData.damagerange
				) {
					// attack the NPC! by asigning damage intent
					const prevdamage = World.get(npc_entity, DamageIntent);
					World.set(
						npc_entity,
						DamageIntent,
						prevdamage ? prevdamage + sharkData.damage : sharkData.damage,
					);
				}
			}
		}
	}
};
