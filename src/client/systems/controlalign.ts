import { ControlController } from "client/controllers/controlcontroller";

// runs every frame (60hz)
export = (dt: number, controlcontroller: ControlController) => {
	if (controlcontroller.alignrotation)
		// //
		controlcontroller.alignrotation.CFrame = controlcontroller.camera.CFrame;
};
