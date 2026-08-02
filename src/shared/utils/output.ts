// utility for printing with [SERVER] or [CLIENT] prefix depending on execution context

import { RunService } from "@rbxts/services";

export function output(...params: unknown[]): void {
	if (RunService.IsServer()) {
		print("[SERVER]", ...params);
	} else {
		print("[CLIENT]", ...params);
	}
}
