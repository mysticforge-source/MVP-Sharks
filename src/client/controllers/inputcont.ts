import { Controller, Modding, OnStart } from "@flamework/core";
import { BaseAction, InputManager } from "@rbxts/mechanism"

type inputBinds = Record<string, BaseAction>

export interface OnInput {
    inputs: inputBinds;
}

@Controller()
/*
 * Exposes an InputManager, allows for controllers implementing OnInput
 * to have `inputs` binded to the InputManager
 */
export class InputController {
    // private fields
    protected inputManager = new InputManager;

    // public methods

    // binds action
    public bind(action: BaseAction) {
        this.inputManager.bind(action)
    }

    // unbinds action
    public unbind(action: BaseAction) {
        this.inputManager.unbind(action)
    }

    // rebinds all actions within singleton.inputs
    public bindAll(obj: OnInput) {
        for (let [_, action] of pairs(obj.inputs)) {
            this.inputManager.bind(action);
        }
    }

    // unbinds all actions within singleton.inputs
    public unbindAll(obj: OnInput) {
        for (let [_, action] of pairs(obj.inputs)) {
            this.inputManager.unbind(action);
        }
    }

    /*
    public onStart(): void | Promise<void> {
        Modding.onListenerAdded<OnInput>(
            obj => {
                for (let [_, action] of pairs(obj.inputs)) {
                    this.inputManager.bind(action);
                }
            }
        );
        Modding.onListenerRemoved<OnInput>(
            obj => {
                for (let [_, action] of pairs(obj.inputs)) {
                    this.inputManager.unbind(action);
                }
            }
        );
    };
    */
}
