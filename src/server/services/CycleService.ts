import { OnStart, OnTick, Service } from "@flamework/core";
import { RunService } from "@rbxts/services";
import exp from "server/systems/exp";
import hunger from "server/systems/hunger";
import { Simulate } from "shared/logic/GameSimulation";
import { HitboxService } from "./HitboxService";
import levelup from "server/systems/levelup";
import network from "server/systems/network";
import { DataService } from "./DataService";

@Service()
/*
 * runs the server-authority simulation at 60hz
 * runs ECS systems onTick with lag compensation at 20hz
 */
export class CycleService implements OnStart, OnTick {
	public ECS_HZ: number = 1 / 20;
	public t: number = 0;

	constructor(
		private readonly hitboxservice: HitboxService,
		private readonly dataservice: DataService,
	) {}

	public onStart(): void {
		// bind to physics simulation step at 60hz, the authoritative game loop
		RunService.BindToSimulation((step: number) => {
			Simulate(step);
		}, Enum.StepFrequency.Hz60);
	}

	public onTick(dt: number): void {
		this.t += dt;

		// run systems in order, compensate lag
		for (this.t; this.t >= this.ECS_HZ; this.t -= this.ECS_HZ) {
			// drain hunger
			hunger(this.ECS_HZ);

			// handle exp and levels
			exp(this.ECS_HZ);

			levelup(this.ECS_HZ, this.hitboxservice);

			// lastly send the network updates for dirty data
			network(dt, this.dataservice);
		}
	}
}
