/*
 * client-side prediction mode setup
 * enables prediction on all descendants of the serverauthority folder
 */

import { Controller, OnStart } from "@flamework/core";
import { RunService, Workspace } from "@rbxts/services";
import { clientMaid } from "client/clientmaid";

function shouldPredict(root: Instance): boolean {
	return (
		root.Name !== "PlayerRenderBall" &&
		(root.IsA("BasePart") || root.IsA("Constraint") || root.IsA("Configuration"))
	);
}

function setPredictionMode(root: Instance, mode: Enum.PredictionMode): void {
	if (shouldPredict(root)) {
		RunService.SetPredictionMode(root, mode);
	}
	for (const c of root.GetChildren()) {
		setPredictionMode(c, mode);
	}
}

@Controller()
export class AuthorityController implements OnStart {
	private maid = clientMaid.sub();

	public onStart(): void {
		const predictionMode = Enum.PredictionMode.On;

		// wait for the serverauthority folder
		const authorityModel = Workspace.FindFirstChild("ServerAuthority") as Model | undefined;
		if (!authorityModel) {
			// if it doesn't exist yet, wait for it
			const connection = Workspace.ChildAdded.Connect((child) => {
				if (child.Name === "ServerAuthority") {
					connection.Disconnect();
					setPredictionMode(child, predictionMode);
					this.watchDescendants(child, predictionMode);
				}
			});
			this.maid.add(connection);
			return;
		}

		// apply to existing descendants
		setPredictionMode(authorityModel, predictionMode);
		this.watchDescendants(authorityModel, predictionMode);

		print("[AuthorityController] Prediction mode ON for ServerAuthority descendants");

		// RunService.Rollback.Connect((t) => {
		// 	warn("rollback");
		// });
	}

	/* watches for new children added to the authority folder and enables prediction */
	private watchDescendants(root: Instance, mode: Enum.PredictionMode): void {
		this.maid.add(
			root.ChildAdded.Connect((child) => {
				setPredictionMode(child, mode);
			}),
		);
		this.maid.add(
			root.DescendantAdded.Connect((descendant) => {
				if (shouldPredict(descendant)) {
					RunService.SetPredictionMode(descendant, mode);
				}
			}),
		);
	}
}
