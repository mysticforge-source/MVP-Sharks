import { Controller, OnInit } from "@flamework/core";
import { OnInput } from "./inputcontroller";
import { StandardActionBuilder } from "@rbxts/mechanism";
import { Players, Workspace } from "@rbxts/services";

@Controller()
export class ControlController implements OnInput, OnInit {
	constructor() {}
	protected hitbox!: MeshPart;

	protected player = Players.LocalPlayer;
	protected camera!: Camera;

	onInit(): void | Promise<void> {
		this.camera = Workspace.CurrentCamera ?? (Workspace.WaitForChild("CurrentCamera")! as Camera);
	}

	public inputs = {
		forward: new StandardActionBuilder("W"),
		backward: new StandardActionBuilder("S"),
		left: new StandardActionBuilder("A"),
		right: new StandardActionBuilder("D"),
	};

	// begins movement: sets hitbox, attaches camera, binds inputs
	public begin(hitbox: MeshPart): void {
		this.hitbox = hitbox;

		this.camera.CameraSubject = this.hitbox;

		// add an rotation align
		const alignrot = new Instance("AlignOrientation");
		alignrot.Parent = hitbox;
		alignrot.Attachment0 = new Instance("Attachment", hitbox);
		alignrot.Attachment1 = new Instance("Attachment", this.camera);
		alignrot.Responsiveness = 50;
	}
}
