/*
 * copies input state from inputcontext into input_* attributes on the player's physics part
 * server replicates for all players, client only for local player
 */

import { Players, RunService } from "@rbxts/services";

export function ReplicateInputs(player: Player, hitbox: Instance): void {
	// guard: server does all players, client only does local player
	if (!(RunService.IsServer() || Players.LocalPlayer === player)) return;

	// input context is always cloned into player.Input.SharkContext
	const inputContext = player
		.FindFirstChild("Input")!
		.FindFirstChild("SharkContext") as ServerStorage["Input"]["SharkContext"];

	// handle movement input
	const movement = inputContext.Movement;
	const binding = movement.InputBinding;

	const dir2d = movement.GetState() as Vector2;
	const scale = binding.Scale;
	const clamp = binding.ClampMagnitudeToOne;
	const v2s = binding.Vector2Scale;

	let value = dir2d.mul(v2s).mul(scale);

	if (clamp) {
		value = value.Magnitude > 0 ? value.Unit : value;
	}

	const moveStateKey = `Input_${movement.Name}`;
	const prevMove = hitbox.GetAttribute(moveStateKey);

	hitbox.SetAttribute(`PrevInput_${movement.Name}`, prevMove);
	hitbox.SetAttribute(moveStateKey, value);

	// handle rotation input (camera look vector)
	const rotation = inputContext.Rotation;
	const rotValue = rotation.GetState() as Vector3;

	const rotStateKey = `Input_${rotation.Name}`;
	const prevRot = hitbox.GetAttribute(rotStateKey);

	hitbox.SetAttribute(`PrevInput_${rotation.Name}`, prevRot);
	hitbox.SetAttribute(rotStateKey, rotValue);
}
