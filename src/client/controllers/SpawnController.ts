import { Controller, OnStart } from "@flamework/core";
import { SpawnResult, SpawnSlot } from "client/network/client";
import { MovementController } from "./MovementController";
import { Players, Workspace } from "@rbxts/services";
import Signal from "@rbxts/lemon-signal";
import { clientMaid } from "client/clientmaid";
import { Menu } from "client/ui/sources";

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
	public authorityFolder = Workspace.WaitForChild("ServerAuthority");

	/* finds localplayer hitbox in serverauthority */
	public getHitbox(): MeshPart | undefined {
		const hitbox = this.authorityFolder.FindFirstChild(this.player.Name) as
			| MeshPart
			| undefined;
		return hitbox;
	}

	public onStart(): void {
		// connect signals for hitbox addition to serverauthority
		this.maid.on(this.authorityFolder.ChildAdded, (child: Model) => {
			warn("[SpawnController] CHILD ADDED to ServerAuthority");
			this.HitboxAdded.Fire(child);
		});

		this.maid.add(
			SpawnResult.on(() => {
				let hitbox = this.getHitbox();
				if (!hitbox) {
					task.wait(1);
					hitbox = this.getHitbox();
				}
				if (hitbox) {
					task.wait();
					this.MovementController.begin(hitbox as any);
					Menu("GAME");
				}
			}),
		);
	}
}
