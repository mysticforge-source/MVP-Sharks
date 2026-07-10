import { Controller, OnStart } from "@flamework/core";
import { SpawnFunction } from "client/network/client";
import { ControlController } from "./controlcontroller";
import { Players, Workspace } from "@rbxts/services";
import Signal from "@rbxts/lemon-signal";
import { clientMaid } from "client/clientmaid";

@Controller()
/**
 * Controls the localplayer spawning hitbox
 */
export class SpawnController implements OnStart {
	constructor(private readonly controlcontroller: ControlController) {}

	protected player = Players.LocalPlayer;
	protected maid = clientMaid.sub();

	public HitboxAdded = new Signal<Model>();

	/** Finds localplayer hitbox in workspace */
	public getHitbox(): MeshPart | undefined {
		const hitbox = Workspace.Shared.Hitboxes.FindFirstChild(this.player.Name) as MeshPart | undefined;
		return hitbox;
	}

	/** Retries multiple times to spawn the hitbox, sends a maximum of 2 calls */
	public async SpawnHitbox(slot: number): Promise<MeshPart | undefined> {
		let res = SpawnFunction.call(0);
		if (res === "Fail") {
			// cooldown between requests
			task.wait(0.5);
			res = SpawnFunction.call(0);
		}
		if (res === "Fail") return;

		return this.getHitbox();
	}

	/** Spawns the localplayer's hitbox and begins control */
	public async Spawn(slot: number) {
		const hitbox = await this.SpawnHitbox(slot);
		if (hitbox) {
			this.controlcontroller.begin(hitbox as any);
		}
	}

	public onStart(): void {
		// connect signals
		this.maid.on(Workspace.Shared.Hitboxes.ChildAdded, (child: Model) => {
			warn("CHILD ADDED");
			this.HitboxAdded.Fire(child);
		});

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
