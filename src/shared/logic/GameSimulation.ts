/*
 * centralized simulation module for server-authority movement
 * shared by server and client, interpolates speed over ~1 second
 */

import { Maid } from "@rbxts/better-maid";
import { ReplicateInputs } from "./InputReplicator";
import { getSpeed } from "../utils/ageLevel";
import { output } from "shared/utils/output";

const zerovec = new Vector3(0, 0.01, 0);

let frame = 0;

/* how long it takes to lerp speed from current to target */
export const speedLerpDuration = 0.3;

interface PlayerSimulationData {
	player: Player;
	hitbox: MeshPart;
	sharkId: number;
	level: number;
	movementSpeed: number;
	/* current interpolated speed */
	currentSpeed: number;
	/* speed we are lerping toward */
	targetSpeed: number;
	maid: Maid;
}

/* all active player simulation entries, indexed by player */
export const PlayerSimMap = new Map<Player, PlayerSimulationData>();

/* module-level maid for shared cleanup */
const simMaid = new Maid();

/* registers a player for the simulation loop with shark id and level */
export function RegisterPlayer(
	player: Player,
	hitbox: MeshPart,
	sharkId: number,
	level: number,
): void {
	const maid = simMaid.sub();

	const data: PlayerSimulationData = {
		player,
		hitbox,
		sharkId,
		level,
		movementSpeed: getSpeed(sharkId, level),
		currentSpeed: 0,
		targetSpeed: 0,
		maid,
	};

	PlayerSimMap.set(player, data);
}

/* call when a player's level changes to update their shark speed */
export function UpdatePlayerLevel(player: Player, level: number): void {
	const data = PlayerSimMap.get(player);
	if (!data) return;

	data.level = level;
	data.movementSpeed = getSpeed(data.sharkId, level);

	warn(`speed changed, new speed: ${data.movementSpeed}`);

	/* retarget speed if currently moving */
	if (data.targetSpeed > 0) {
		data.targetSpeed = data.movementSpeed;
	}
}

/* unregisters a player from the simulation loop */
export function UnregisterPlayer(player: Player): void {
	const data = PlayerSimMap.get(player);
	if (data) {
		data.maid.Destroy();
		PlayerSimMap.delete(player);
	}
}

/* main simulation step called from bindtosimulation on both server and client */
export function Simulate(dt: number): void {
	frame += 1;

	for (const [player, data] of PlayerSimMap) {
		// replicate input from player's input context to attributes
		ReplicateInputs(player, data.hitbox);

		// simulate this player's hitbox
		SimulateHitbox(data, dt);
	}
}

/* runs one step of physics simulation for a single hitbox */
function SimulateHitbox(data: PlayerSimulationData, dt: number): void {
	const hitbox = data.hitbox;

	// read camera look vector from rotation input attribute and construct cframe
	const lookVec = hitbox.GetAttribute("Input_Rotation") as Vector3 | undefined;
	const cameraCF =
		lookVec !== undefined && lookVec.Magnitude > 0
			? CFrame.lookAt(hitbox.Position, hitbox.Position.add(lookVec))
			: new CFrame(hitbox.Position);

	// orientation: align hitbox to the camera
	const alignRotation = hitbox.FindFirstChildOfClass("AlignOrientation")!;
	alignRotation.CFrame = cameraCF;

	// compute movement direction from input attributes
	const moveDir = computeMoveDirection(hitbox, cameraCF);

	// set target speed: max while moving, zero when idle
	data.targetSpeed = moveDir.Magnitude > zerovec.Magnitude ? data.movementSpeed : 0;

	// linearly interpolate current speed toward target over ~1 second
	//const lerpFactor = math.min(1 / 60 / speedLerpDuration, 1);
	//data.currentSpeed = data.currentSpeed + (data.targetSpeed - data.currentSpeed) * lerpFactor;

	data.currentSpeed = data.targetSpeed;

	// apply interpolated speed along the movement direction
	const velocity = moveDir.Unit.mul(data.currentSpeed);

	//output(velocity.Magnitude, data.currentSpeed);

	const positionVel = hitbox.FindFirstChildOfClass("LinearVelocity")!;
	positionVel.VectorVelocity = velocity;
}

/* reads input attributes and computes a movement direction vector */
function computeMoveDirection(hitbox: Instance, cameraCF: CFrame): Vector3 {
	const inputVec = hitbox.GetAttribute("Input_Movement") as Vector2 | undefined;

	if (inputVec === undefined || inputVec.Magnitude === 0) return zerovec;

	const right = inputVec.X;
	const forward = inputVec.Y;

	const dir = cameraCF.RightVector.mul(right).add(cameraCF.LookVector.mul(forward));

	//output(dir.Magnitude, "at frame", frame);

	return dir.Unit;
}

/* cleans up simulation state for a hitbox */
export function DestroyHitbox(hitbox: Instance): void {
	for (const [player, data] of PlayerSimMap) {
		if (data.hitbox === hitbox) {
			data.maid.Destroy();
			PlayerSimMap.delete(player);
			break;
		}
	}
}
