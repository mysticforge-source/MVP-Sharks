import { OnStart, Service } from "@flamework/core";
import { RunService } from "@rbxts/services";
import { Simulate } from "shared/logic/GameSimulation";

@Service()
/*
 * runs the centralized server-authority simulation at 60hz via bindtosimulation
 * iterates all registered players, processes input, applies physics
 */
export class CycleService implements OnStart {
	public onStart(): void {
		// bind to physics simulation step at 60hz, the authoritative game loop
		RunService.BindToSimulation((step: number) => {
			Simulate(step);
		}, Enum.StepFrequency.Hz60);
	}
}
