import { Workspace } from "@rbxts/services";
import { merge } from "@rbxts/sift/out/Dictionary";
import { NPC_Data, NPC_Direction, NPC_Health, NPC_Time } from "server/components";
import { HitboxService, NPC_EntityToHitbox } from "server/services/HitboxService";
import { npccatalog } from "shared/data";
import { World } from "shared/ecs/world";

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

const random = new Random(987123);

export default (dt: number, hitboxservice: HitboxService) => {
	// tick times in spawnlocations
	for (const [id, value] of pairs(outerNpcData)) {
		const npcData = npccatalog[id];

		for (const [spawnlocation, spawnvalue] of pairs(value.spawnlocations)) {
			const locData = npcData.spawnlocations[spawnlocation];

			spawnvalue.spawn_time_left -= dt;

			// spawn a new entity if time < 0 and max_spawns haven't been reached yet
			if (spawnvalue.spawns < locData.maxspawns && spawnvalue.spawn_time_left <= 0) {
				spawnvalue.spawns++;
				spawnvalue.spawn_time_left = locData.spawnrate;

				// create a new NPC entity
				const npc = World.entity();
				// data
				World.set(npc, NPC_Data, { id: id, location: spawnlocation as string });
				// health component, default is max
				World.set(npc, NPC_Health, npcData.health);
				World.set(npc, NPC_Direction, Vector3.zero);
				World.set(npc, NPC_Time, {
					time_next_move: npcData.idletime, //move in Idletime
					time_moving_for: 0,

					time_next_attack: 0,
					time_next_regen: 0,
				});

				hitboxservice.createNPCHitbox(npc, spawnlocation as string);
			}
		}
	}

	// tick times for each npc entity
	for (let [entity, times, data, dir] of World.query(NPC_Time, NPC_Data, NPC_Direction)) {
		const npcData = npccatalog[data.id];
		const hitbox = NPC_EntityToHitbox.get(entity);
		if (!hitbox) continue;

		// const locData = npcData.spawnlocations[data.location];

		// we can passively tick next_move and moving_for since they can be negative
		// and will just be set to the time
		times = {
			...times,
			time_next_move: times.time_next_move - dt,
			time_moving_for: times.time_moving_for - dt,
		};

		// disable direction if we stopped moving
		if (times.time_moving_for <= 0 && dir !== Vector3.zero) {
			World.set(entity, NPC_Direction, Vector3.zero);
		}

		// set direction and time to move if we just started moving
		if (times.time_next_move <= 0) {
			// construct a vector having yaw and pitch
			const yaw = random.NextInteger(0, 360);
			const pitch = random.NextInteger(0, 360);

			World.set(
				entity,
				NPC_Direction,
				new Vector3(
					math.cos(pitch) * math.sin(yaw),
					math.sin(pitch),
					math.cos(pitch) * math.cos(yaw),
				).Unit,
			);
			// we'll move for movetime and idle for idletime
			times.time_next_move = npcData.movetime + npcData.idletime;
			// will move now for Movetime
			times.time_moving_for = npcData.movetime;

			// however if too far-from-home, set the direction to home
			const distance = Workspace.Shared.NPC_Locations[data.location].Position.sub(
				hitbox.Position,
			);
			if (distance.Magnitude >= npcData.maxdistance) {
				World.set(entity, NPC_Direction, distance.Unit);
			}
		}

		// update stuff
		World.set(entity, NPC_Time, times);
	}

	// update velocities!
	for (let [entity, direction, data] of World.query(NPC_Direction, NPC_Data)) {
		const hitbox = NPC_EntityToHitbox.get(entity);
		if (!hitbox) continue;

		const linearvel = hitbox.LinearVelocity;
		const currentVelocity = linearvel.VectorVelocity;

		// print(currentVelocity);

		const npcData = npccatalog[data.id];

		// if it's identical just ignore it
		if (currentVelocity.X === direction.mul(npcData.speed).X) continue;

		// align the hitbox!
		if (direction.Magnitude > 0)
			hitbox.AlignOrientation.CFrame = CFrame.lookAt(
				hitbox.Position,
				hitbox.Position.add(direction),
			);

		linearvel.VectorVelocity = direction.mul(npcData.speed);
		print("rotated!", linearvel.VectorVelocity, direction.mul(npcData.speed));
	}
};
