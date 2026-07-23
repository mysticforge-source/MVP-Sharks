import { MovementController } from "client/controllers/MovementController";

// runs every frame (60hz)
// aligns the hitbox orientation with the camera
export = (dt: number, MovementController: MovementController) => {
	if (MovementController.alignrotation) {
		const cameraCF = MovementController.camera.CFrame;

		// orientation
		// hitbox is aligned to the camera
		MovementController.alignrotation.CFrame = cameraCF;

		// velocity
		// hitbox moves relative to the camera
		MovementController.movementVelocitySpring.step(dt);
		MovementController.positionvel.VectorVelocity =
			cameraCF.VectorToWorldSpace(
				MovementController.movementVelocitySpring.getPosition(),
			);
	}
};
