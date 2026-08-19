import { Workspace } from "@rbxts/services";
import { merge } from "@rbxts/sift/out/Dictionary";
import { NPC_Data, NPC_Health, NPC_Time } from "server/components";
import { HitboxService } from "server/services/HitboxService";
import { npccatalog } from "shared/data";
import { World } from "shared/ecs/world";

// A map of spawn times
const times: Map<number, number> = new Map();
for (const [id, npc] of pairs(npccatalog)) {
	times.set(id, 0);
}

export const outerNpcData: {
	[id: number]: {
		spawnlocations: {
			[key: string]: {
				spawn_time_left: number;
				spawns: number; // changed dynamically
			};
		};
	};
} = {};

// fill it
for (const [id, npc] of pairs(npccatalog)) {
	outerNpcData[id] = {
		spawnlocations: {},
	};

	for (const [spawnlocation, value] of pairs(npc.spawnlocations)) {
		outerNpcData[id].spawnlocations[spawnlocation] = {
			spawn_time_left: value.spawnrate,
			spawns: 0,
		};
	}
}

// FOR WORK:
// outerNpcData is global data for all ids, it handles
// spawnrates of this ID npc for all spawnlocations in its data
// then it creates npc Entities with the required data
// it uses HitboxService to make an unanchored floating hitbox
// then client gets it and renders the viewmodel
// NEXT:
// do the moving system, prob right here, via it you just toggle on/off
// the linear velocity, the client will do the alignrotation shit and anims
// imagine the shark randomly rotating while idling, like looking at something

export default (dt: number, hitboxservice: HitboxService) => {
	// tick times in spawnlocations
	for (const [id, value] of pairs(outerNpcData)) {
		const npcData = npccatalog[id];

		for (const [spawnlocation, spawnvalue] of pairs(value.spawnlocations)) {
			const locData = npcData.spawnlocations[spawnlocation];

			spawnvalue.spawn_time_left -= dt;

			// spawn a new entity if time < 0 and max_spawns haven't been reached yet
			if (spawnvalue.spawns < locData.maxspawns && spawnvalue.spawn_time_left <= 0) {
				warn("SPAWN NEW NPC");
				spawnvalue.spawns++;
				spawnvalue.spawn_time_left = locData.spawnrate;

				// create a new NPC entity
				const npc = World.entity();
				// data
				World.set(npc, NPC_Data, { id: id, location: spawnlocation as string });
				// health component, default is max
				World.set(npc, NPC_Health, npcData.health);
				World.set(npc, NPC_Time, {
					time_next_move: 5, //move in 5 seconds
					time_moving_for: 0,

					time_next_attack: 0,
					time_next_regen: 0,
				});

				hitboxservice.createNPCHitbox(npc, "Test");
			}
		}
	}
};
