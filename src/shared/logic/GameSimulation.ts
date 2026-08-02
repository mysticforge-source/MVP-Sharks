/*
 * centralized simulation module for server-authority movement
 * shared by server and client, branches behavior using runservice
 */

import { RunService } from "@rbxts/services";
import { createSpring, Spring } from "@rbxts/ripple";
import { ReplicateInputs } from "./InputReplicator";
import { output } from "shared/utils/output";

const zerovec = new Vector3(0, 0.01, 0);

interface SpringState {
	spring: Spring;
	movementSpeed: number;
}

const springMap = new Map<Instance, SpringState>();

function getSpringData(hitbox: Instance): SpringState {
	let data = springMap.get(hitbox);
	if (!data) {
		data = {
			movementSpeed: 25,
			spring: createSpring(zerovec, {
				tension: 300,
				friction: 50,
				impulse: new Vector3(50, 50, 50),
				velocity: new Vector3(25, 25, 25),
			}),
		};
		springMap.set(hitbox, data);
	}
	return data;
}

/* per-player state needed by the simulation */
export interface PlayerSimulationData {
	player: Player;
	hitbox: MeshPart;
}

/* all active player simulation entries, indexed by player */
export const PlayerSimMap = new Map<Player, PlayerSimulationData>();

/* registers a player for the simulation loop */
export function RegisterPlayer(player: Player, hitbox: MeshPart): void {
	PlayerSimMap.set(player, { player, hitbox });
}

/* unregisters a player from the simulation loop */
export function UnregisterPlayer(player: Player): void {
	const data = PlayerSimMap.get(player);
	if (data) {
		springMap.delete(data.hitbox);
		PlayerSimMap.delete(player);
	}
}

/* main simulation step called from bindtosimulation on both server and client */
export function Simulate(dt: number): void {
	for (const [player, data] of PlayerSimMap) {
		const { hitbox } = data;

		// replicate input from player's input context to attributes
		ReplicateInputs(player, hitbox);

		// simulate this hitbox
		SimulateHitbox(hitbox, dt);
	}
}

/* runs one step of physics simulation for a single hitbox */
function SimulateHitbox(hitbox: MeshPart, dt: number): void {
	const data = getSpringData(hitbox);

	// read camera look vector from rotation input attribute and construct cframe
	const lookVec = hitbox.GetAttribute("Input_Rotation") as Vector3 | undefined;
	const cameraCF =
		lookVec !== undefined && lookVec.Magnitude > 0
			? CFrame.lookAt(hitbox.Position, hitbox.Position.add(lookVec))
			: new CFrame(hitbox.Position);

	// orientation: align hitbox to the camera
	const alignRotation = hitbox.FindFirstChildOfClass("AlignOrientation") as
		| AlignOrientation
		| undefined;
	if (alignRotation) {
		alignRotation.CFrame = cameraCF;
	}

	// compute movement direction from input attributes
	const moveDir = computeMoveDirection(hitbox, cameraCF);

	// spring-smoothed velocity
	let velocity = moveDir;
	if (velocity.Magnitude > zerovec.Magnitude) {
		velocity = velocity.Unit.mul(data.movementSpeed);
	} else {
		velocity = zerovec;
	}

	data.spring.setGoal(velocity);
	data.spring.step(dt);

	const positionVel = hitbox.FindFirstChildOfClass("LinearVelocity") as
		| LinearVelocity
		| undefined;
	if (positionVel) {
		positionVel.VectorVelocity = data.spring.getPosition();
	}
}

/* reads input attributes and computes a movement direction vector */
function computeMoveDirection(hitbox: Instance, cameraCF: CFrame): Vector3 {
	const inputVec = hitbox.GetAttribute("Input_Movement") as Vector2 | undefined;

	if (inputVec === undefined || inputVec.Magnitude === 0) return zerovec;

	const right = inputVec.X;
	const forward = inputVec.Y;

	const dir = cameraCF.RightVector.mul(right).add(cameraCF.LookVector.mul(forward));

	return dir.Magnitude > 0 ? dir.Unit : zerovec;
}

/* cleans up spring state for a hitbox */
export function DestroyHitbox(hitbox: Instance): void {
	springMap.delete(hitbox);
}
