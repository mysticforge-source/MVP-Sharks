// Some tools regarding input

import { BaseAction, InputManager } from "@rbxts/mechanism";

interface inputs {
	[key: string]: BaseAction;
}

namespace InputTools {
	export const inputManager = new InputManager();

	export const bind = inputManager.bind;
	export const unbind = inputManager.unbind;
	/** Bind all inputs */
	export const bindAll = (inputs: inputs) => {
		for (let [_, action] of pairs(inputs)) {
			inputManager.bind(action);
		}
	};
	/** Unbind all inputs */
	export const unbindAll = (inputs: inputs) => {
		for (let [_, action] of pairs(inputs)) {
			inputManager.unbind(action);
		}
	};
}

export default InputTools;
