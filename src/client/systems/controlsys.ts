import { ControlController } from "client/controllers/controlcontroller";

// runs every frame (60hz)
// aligns the hitbox orientation with the camera
export = (dt: number, controlcontroller: ControlController) => {
	if (controlcontroller.alignrotation) {
		const cameraCF = controlcontroller.camera.CFrame;

		// orientation
		// hitbox is aligned to the camera
		controlcontroller.alignrotation.CFrame = cameraCF;

		// velocity
		// hitbox moves relative to the camera
		controlcontroller.movementVelocitySpring.step(dt);
		controlcontroller.positionvel.VectorVelocity = cameraCF.VectorToWorldSpace(
			controlcontroller.movementVelocitySpring.getPosition(),
		);
	}
};
