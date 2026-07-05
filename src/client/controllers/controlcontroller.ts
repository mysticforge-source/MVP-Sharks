import { Controller, OnInit } from "@flamework/core";
import { OnInput } from "./inputcontroller";
import { StandardActionBuilder } from "@rbxts/mechanism";
import { Players, Workspace } from "@rbxts/services";

@Controller()
export class ControlController implements OnInput, OnInit {
	constructor() {}
	protected hitbox!: MeshPart;

	protected player = Players.LocalPlayer;

	public alignrotation!: AlignOrientation;
	public camera!: Camera;

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
	public begin(hitbox: MeshPart & { Attachment: Attachment }): void {
		this.hitbox = hitbox;

		this.camera.CameraSubject = this.hitbox;

		// add an rotation align
		this.alignrotation = new Instance("AlignOrientation");
		this.alignrotation.Parent = hitbox;
		this.alignrotation.Attachment0 = hitbox.Attachment;
		this.alignrotation.Attachment1 = new Instance("Attachment", this.camera);
		this.alignrotation.Responsiveness = 20;
		this.alignrotation.Mode = Enum.OrientationAlignmentMode.OneAttachment;
	}
}
