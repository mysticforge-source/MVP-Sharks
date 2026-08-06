/*
 * client-side input capture and prediction
 * captures hardware input, writes attributes, runs local prediction
 */

import { clientMaid } from "client/clientmaid";

import { Controller, OnInit } from "@flamework/core";
import { Players, RunService, Workspace } from "@rbxts/services";

import { RegisterPlayer, Simulate, UpdatePlayerLevel } from "shared/logic/GameSimulation";
import { level, shark } from "client/ui/sources";
import { World } from "shared/ecs/world";
import { PlayerEntity } from "./DataController";
import { LevelChangeIntent } from "client/state/components";
import { states } from "client/state/viewstate";

@Controller()
export class MovementController implements OnInit {
	private hitbox: MeshPart | undefined;

	private player = Players.LocalPlayer;
	private camera!: Camera;

	private rotBinding!: InputBinding;

	private maid = clientMaid.sub();

	/* returns the current hitbox for client-side prediction */
	public getHitbox(): MeshPart | undefined {
		return this.hitbox;
	}

	public onInit(): void {
		this.camera =
			Workspace.CurrentCamera ?? (Workspace.WaitForChild("CurrentCamera")! as Camera);
	}

	/* begins movement: writes camera cframe each frame and runs local prediction */
	public begin(hitbox: MeshPart): void {
		this.hitbox = hitbox;
		this.camera.CameraSubject = this.hitbox;

		// cache input binding reference
		const inputFolder = this.player.WaitForChild("Input") as Model;
		const rotAction = inputFolder
			.FindFirstChild("SharkContext")!
			.FindFirstChild("Rotation") as InputAction;
		this.rotBinding = rotAction.FindFirstChild("InputBinding") as InputBinding;

		// hopefully received by the client, IngameDataEvent
		const ingamedata = {
			sharkid: shark(),
			level: level(),
		};

		// register local player for client-side prediction
		RegisterPlayer(this.player, hitbox, ingamedata.sharkid, ingamedata.level);

		// bind to simulation for rotation input and local prediction
		this.maid.add(
			RunService.BindToSimulation((simulationStep) => {
				if (!this.hitbox) return;

				// fire rotation input with camera look vector
				this.rotBinding.Fire(this.camera.CFrame.LookVector);

				// run centralized simulation for local player prediction
				Simulate(simulationStep);
			}, Enum.StepFrequency.Hz60),
		);
		states.BindedToSimulation = true;
	}
}
