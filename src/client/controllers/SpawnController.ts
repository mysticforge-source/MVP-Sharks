import { Controller, OnStart } from "@flamework/core";
import { SpawnFunction } from "client/network/client";
import { MovementController } from "./MovementController";
import { Players, Workspace } from "@rbxts/services";
import Signal from "@rbxts/lemon-signal";
import { clientMaid } from "client/clientmaid";

@Controller()
/*
 * controls the localplayer spawning hitbox
 * hitboxes are in workspace.serverauthority
 */
export class SpawnController implements OnStart {
	constructor(private readonly MovementController: MovementController) {}

	protected player = Players.LocalPlayer;
	protected maid = clientMaid.sub();

	public HitboxAdded = new Signal<Model>();

	/* returns the serverauthority folder */
	private getAuthorityFolder(): Instance {
		return Workspace.FindFirstChild("ServerAuthority") ?? Workspace;
	}

	/* finds localplayer hitbox in serverauthority */
	public getHitbox(): MeshPart | undefined {
		const authorityFolder = this.getAuthorityFolder();
		const hitbox = authorityFolder.FindFirstChild(this.player.Name) as MeshPart | undefined;
		return hitbox;
	}

	/* retries multiple times to spawn the hitbox */
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

	/* spawns the localplayer's hitbox and begins control */
	public async Spawn(slot: number) {
		const hitbox = await this.SpawnHitbox(slot);
		if (hitbox) {
			this.MovementController.begin(hitbox as any);
		}
	}

	public onStart(): void {
		// connect signals for hitbox addition to serverauthority
		const authorityFolder = this.getAuthorityFolder();
		this.maid.on(authorityFolder.ChildAdded, (child: Model) => {
			warn("[SpawnController] CHILD ADDED to ServerAuthority");
			this.HitboxAdded.Fire(child);
		});

		task.wait(5);
		// for testing
		const res = SpawnFunction.call(0);
		warn(`[SpawnController] Spawn result: ${res}`);

		const hitbox = this.getHitbox();
		warn(hitbox);

		if (hitbox) {
			this.MovementController.begin(hitbox as any);
		}
	}
}
