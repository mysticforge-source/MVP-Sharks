// Some tools regarding input

import { BaseAction, InputManager } from "@rbxts/mechanism";

interface inputs {
	[key: string]: BaseAction;
}

namespace InputTools {
	export const inputManager = new InputManager();

	export const bind = (action: BaseAction) => inputManager.bind(action);
	export const unbind = (action: BaseAction) => inputManager.unbind(action);
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
