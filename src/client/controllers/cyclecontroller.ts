import controlsys from "client/systems/controlsys";
import viewsys from "client/systems/viewsys";

import { Controller, OnRender, OnTick } from "@flamework/core";

import { ControlController } from "./controlcontroller";

@Controller()
/*
 * Activates ECS systems in order
 */
export class CycleController implements OnTick, OnRender {
	constructor(private readonly controlcontroller: ControlController) {}

	//
	protected TICKRATE = 1 / 60;
	protected t = 0;

	public onTick(dt: number): void {
		this.t += dt;

		// limit missed updates to a maximum of 10 updates
		// to avoid lagging over a freeze
		this.t = math.min(this.t, this.TICKRATE * 10);

		for (this.t; this.t >= this.TICKRATE; this.t -= this.TICKRATE) {
			// run systems in order
			controlsys(dt, this.controlcontroller);
		}
	}

	public onRender(dt: number): void {
		// run render systems in order
		viewsys(dt);
	}
}
