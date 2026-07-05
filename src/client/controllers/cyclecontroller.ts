import { Controller, OnTick } from "@flamework/core";
import { ControlController } from "./controlcontroller";

@Controller()
/*
 * Activates ECS systems in order
 */
export class CycleController implements OnTick {
	constructor(private readonly controlcontroller: ControlController) {}

	protected TICKRATE = 1 / 60;
	protected t = 0;

	public onTick(dt: number): void {
		this.t += dt;

		// limit missed updates to a maximum of 10 updates
		// to avoid lagging over a freeze
		this.t = math.min(this.t, this.TICKRATE * 10);

		for (this.t; this.t >= this.TICKRATE; this.t -= this.TICKRATE) {
			// run systems in order
			this.controlcontroller.alignSystem(dt);
		}
	}
}
