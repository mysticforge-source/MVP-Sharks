import { Controller } from "@flamework/core";
import { OnInput } from "./inputcontroller";
import { StandardActionBuilder } from "@rbxts/mechanism";

@Controller()
export class ControlController implements OnInput {
	constructor() {}
	protected hitbox!: MeshPart;

	public inputs = {
		forward: new StandardActionBuilder("W"),
		backward: new StandardActionBuilder("S"),
		left: new StandardActionBuilder("A"),
		right: new StandardActionBuilder("D"),
	};

	// begins movement: sets hitbox, attaches camera, binds inputs
	public begin(hitbox: MeshPart): void {
		this.hitbox = hitbox;
	}
}
