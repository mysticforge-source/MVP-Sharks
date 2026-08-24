import { Workspace } from "@rbxts/services";
import { merge } from "@rbxts/sift/out/Dictionary";
import { NPC_Data, NPC_Health, NPC_Time } from "server/components";
import { HitboxService, NPC_EntityToHitbox, PlayerToHitbox } from "server/services/HitboxService";
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
				World.set(npc, NPC_Time, {
					time_next_move: npcData.idletime, //move in Idletime
					time_moving_for: 0,

					target: undefined,

					time_next_attack: 0,
					time_next_regen: 0,
				});

				hitboxservice.createNPCHitbox(npc, spawnlocation as string);
			}
		}
	}

	// tick times for each npc entity
	for (let [entity, times, data] of World.query(NPC_Time, NPC_Data)) {
		const npcData = npccatalog[data.id];
		const hitbox = NPC_EntityToHitbox.get(entity);
		if (!hitbox) continue;

		const linearvel = hitbox.LinearVelocity;

		// const locData = npcData.spawnlocations[data.location];

		// we can passively tick next_move and moving_for since they can be negative
		// and will just be set to the time
		times = {
			...times,
			time_next_move: times.time_next_move - dt,
			time_moving_for: times.time_moving_for - dt,

			// still tick attack to attack instantly next time
			time_next_attack: times.time_next_attack - dt,
		};

		// stop moving if time is over
		if (times.time_moving_for <= 0 && linearvel.VectorVelocity.Magnitude > 0) {
			linearvel.VectorVelocity = Vector3.zero;
		}

		// set direction and time to move if we just started moving
		if (times.time_next_move <= 0) {
			// linearvel.Enabled = true;

			// firstly detect if we are an aggro npc
			if (npcData.behaviour === "attack") {
				// find a new target
				let mindist = npcData.range;
				let besttarget = undefined;

				for (const [player, playerhitbox] of PlayerToHitbox) {
					const dist = playerhitbox.Position.sub(hitbox.Position).Magnitude;
					const disttospawn = Workspace.Shared.NPC_Locations[data.location].Position.sub(
						playerhitbox.Position,
					);

					// if we will ever be able to reach the player without moving back to spawn
					if (
						dist <= mindist &&
						disttospawn.Magnitude <= npcData.maxdistance + npcData.damagerange * 0.5
					) {
						besttarget = playerhitbox;
						mindist = dist;
					}
				}

				// even if we found no target
				times.target = besttarget;

				// if theres a target we can attack
				if (besttarget) {
					// if we're too close already
					if (mindist <= npcData.damagerange) {
						// align the hitbox to target
						hitbox.AlignOrientation.CFrame = CFrame.lookAt(
							hitbox.Position,
							hitbox.Position.add(besttarget.Position.sub(hitbox.Position)),
						);

						// just dont move but rotate
						times.time_next_move = npcData.idletime;
					} else {
						// get the direction to target
						const vect = besttarget.Position.sub(hitbox.Position);
						const direction = vect.Unit;

						// get the time to get to target and get closer in damagerange
						const t = (vect.Magnitude - npcData.damagerange) / npcData.speed;

						// align the hitbox to target
						hitbox.AlignOrientation.CFrame = CFrame.lookAt(
							hitbox.Position,
							hitbox.Position.add(direction),
						);

						// if we should move to attack:
						if (t > 0) {
							// move to target now
							linearvel.VectorVelocity = direction.mul(npcData.speed);

							// recheck in idletime seconds
							times.time_moving_for = t;
							times.time_next_move = t + npcData.idletime;
						}

						// however if too far-from-home, set the direction to home
						const distance = Workspace.Shared.NPC_Locations[data.location].Position.sub(
							hitbox.Position,
						);
						if (distance.Magnitude >= npcData.maxdistance) {
							linearvel.VectorVelocity = distance.Unit.mul(npcData.speed);
							hitbox.AlignOrientation.CFrame = CFrame.lookAt(
								hitbox.Position,
								hitbox.Position.add(distance.Unit),
							);

							// move less, just incase the player is still there
							times.time_moving_for = npcData.movetime * 0.75;
							times.time_next_move = npcData.movetime * 0.75 + npcData.idletime;
						}
					}
				} else {
					// if theres no target just do ignore behaviour

					// construct a vector having random yaw and pitch
					const yaw = random.NextInteger(0, 360);
					const pitch = random.NextInteger(0, 360);

					const dir = new Vector3(
						math.cos(pitch) * math.sin(yaw),
						math.sin(pitch),
						math.cos(pitch) * math.cos(yaw),
					).Unit.mul(npcData.speed);

					linearvel.VectorVelocity = dir;

					hitbox.AlignOrientation.CFrame = CFrame.lookAt(
						hitbox.Position,
						hitbox.Position.add(dir.Unit),
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
						linearvel.VectorVelocity = distance.Unit.mul(npcData.speed);
						hitbox.AlignOrientation.CFrame = CFrame.lookAt(
							hitbox.Position,
							hitbox.Position.add(distance.Unit),
						);
					}
				}
			} else {
				// if we're not aggressive

				// construct a vector having random yaw and pitch
				const yaw = random.NextInteger(0, 360);
				const pitch = random.NextInteger(0, 360);

				const dir = new Vector3(
					math.cos(pitch) * math.sin(yaw),
					math.sin(pitch),
					math.cos(pitch) * math.cos(yaw),
				).Unit.mul(npcData.speed);

				linearvel.VectorVelocity = dir;

				hitbox.AlignOrientation.CFrame = CFrame.lookAt(
					hitbox.Position,
					hitbox.Position.add(dir.Unit),
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
					linearvel.VectorVelocity = distance.Unit.mul(npcData.speed);
					hitbox.AlignOrientation.CFrame = CFrame.lookAt(
						hitbox.Position,
						hitbox.Position.add(distance.Unit),
					);
				}
			}
		}

		// we should attack if we have a target and we can
		if (times.target && times.time_next_attack <= 0) {
			times.time_next_attack = npcData.damagecooldown;

			print("attacked");

			hitbox.SetAttribute(
				"AttackAmount",
				(hitbox.GetAttribute("AttackAmount") as number) + 1,
			);
		}

		// update stuff
		World.set(entity, NPC_Time, times);
	}
};
