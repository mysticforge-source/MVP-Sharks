import { Controller, OnTick } from "@flamework/core";

@Controller()
/*
 * Activates ECS systems in order
 */
export class CycleController implements OnTick {
    public onTick(dt: number): void {
        
    }
}
