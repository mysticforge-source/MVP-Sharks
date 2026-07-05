import { Controller, OnStart } from "@flamework/core";
import { SpawnFunction } from "client/network/client";
import { ControlController } from "./controlcontroller";
import { Players, Workspace } from "@rbxts/services";

@Controller()
export class SpawnController implements OnStart {
	constructor(private readonly controlcontroller: ControlController) {}
	protected player = Players.LocalPlayer;

	public getHitbox(): MeshPart | undefined {
		const hitbox = Workspace.Shared.Hitboxes.FindFirstChild(this.player.Name) as MeshPart | undefined;
		return hitbox;
	}

	/** retries multiple times to spawn the hitbox, sends a maximum of 2 calls */
	public async Spawn(slot: number): Promise<MeshPart | undefined> {
		let res = SpawnFunction.call(0);
		if (res === "Fail") {
			// cooldown between requests
			task.wait(0.5);
			res = SpawnFunction.call(0);
		}
		if (res === "Fail") return;

		return this.getHitbox();
	}

	public onStart(): void {
		task.wait(5);
		// for testing
		const res = SpawnFunction.call(0);
		warn(`result: ${res}`);

		const hitbox = this.getHitbox()!;
		warn(hitbox);

		// it definitely is a meshpart with an attachment
		this.controlcontroller.begin(hitbox as any);
	}
}
