import viewsys from "client/systems/viewsys";

import { Controller, OnRender, OnTick } from "@flamework/core";

@Controller()
/*
 * activates ecs systems in order on tick
 * client-side prediction runs via simulate in movementcontroller
 */
export class CycleController implements OnTick, OnRender {
	protected TICKRATE = 1 / 60;
	protected t = 0;

	public onTick(dt: number): void {
		this.t += dt;

		// limit missed updates to a maximum of 10 to avoid lagging on freeze
		this.t = math.min(this.t, this.TICKRATE * 10);

		for (this.t; this.t >= this.TICKRATE; this.t -= this.TICKRATE) {
			// run systems in order
		}
	}

	public onRender(dt: number): void {
		// run render systems in order
		viewsys(dt);
	}
}
