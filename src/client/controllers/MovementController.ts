import { clientMaid } from "client/clientmaid";

import { Controller, OnInit } from "@flamework/core";
import { StandardActionBuilder } from "@rbxts/mechanism";
import { Players, Workspace } from "@rbxts/services";

import { InputController, OnInput } from "./inputcont";
import { createSpring } from "@rbxts/ripple";

// to avoid server reseting network owner when stopping
const zerovec = new Vector3(0, 0.01, 0);

@Controller()
export class MovementController implements OnInput, OnInit {
	constructor(private readonly inputcontroller: InputController) {}

	protected hitbox!: MeshPart;
	protected player = Players.LocalPlayer;

	public alignrotation!: AlignOrientation;
	public positionvel!: LinearVelocity;
	public camera!: Camera;

	public movementSpeed = 25;
	public movementDirection: Vector3 = zerovec;
	public movementVelocity = zerovec;
	public movementVelocitySpring = createSpring(zerovec, {
		tension: 300,
		friction: 50,
		impulse: new Vector3(
			this.movementSpeed * 2,
			this.movementSpeed * 2,
			this.movementSpeed * 2,
		),
		velocity: new Vector3(
			this.movementSpeed,
			this.movementSpeed,
			this.movementSpeed,
		),
	});

	protected maid = clientMaid.sub();

	onInit() {
		this.camera =
			Workspace.CurrentCamera ??
			(Workspace.WaitForChild("CurrentCamera")! as Camera);
	}

	public inputs = {
		forward: new StandardActionBuilder("W").setProcessed(false),
		backward: new StandardActionBuilder("S").setProcessed(false),
		left: new StandardActionBuilder("A").setProcessed(false),
		right: new StandardActionBuilder("D").setProcessed(false),
	};

	// movement vectors added and removed from the movement direction
	// upon presses of inputs
	public movementvectors = {
		forward: new Vector3(0, 0, -1),
		backward: new Vector3(0, 0, 1),
		left: new Vector3(-1, 0, 0),
		right: new Vector3(1, 0, 0),
		up: new Vector3(0, 1, 0),
		down: new Vector3(0, -1, 0),
	};

	protected addDirection(direction: keyof typeof this.movementvectors) {
		this.movementDirection = this.movementDirection.add(
			this.movementvectors[direction],
		);
		this.updateVelocity();
	}

	protected subDirection(direction: keyof typeof this.movementvectors) {
		this.movementDirection = this.movementDirection.sub(
			this.movementvectors[direction],
		);
		this.updateVelocity();
	}

	// recalculates linearvelocity and updates it
	protected updateVelocity() {
		// normalizing to avoid diagonal speedup

		let velocity = this.movementDirection;

		if (velocity.Magnitude > zerovec.Magnitude) velocity = velocity.Unit;
		else velocity = zerovec;

		velocity = velocity.mul(this.movementSpeed);

		// lerp the velocity via spring for drifting
		this.movementVelocity = velocity;
		this.movementVelocitySpring.setGoal(velocity); //this.hitbox.CFrame.VectorToWorldSpace(velocity);

		//if (velocity.Magnitude === 0) this.movementVelocity = zerovec;
		//this.positionvel.VectorVelocity = this.movementVelocity;
	}

	// begins movement: sets hitbox, attaches camera, binds inputs
	public begin(hitbox: MeshPart & { Attachment: Attachment }): void {
		this.hitbox = hitbox;

		this.camera.CameraSubject = this.hitbox;

		// for the camera to rotate the hitbox
		this.alignrotation = hitbox.WaitForChild(
			"AlignOrientation",
		) as AlignOrientation;

		// for the inputs to move the hitbox
		this.positionvel = hitbox.WaitForChild(
			"LinearVelocity",
		) as LinearVelocity;

		// bind inputs
		for (const [direction, action] of pairs(this.inputs)) {
			this.maid.on(action.activated, () => this.addDirection(direction));
			this.maid.on(action.deactivated, () =>
				this.subDirection(direction),
			);
		}

		this.inputcontroller.bindAll(this);
	}
}
