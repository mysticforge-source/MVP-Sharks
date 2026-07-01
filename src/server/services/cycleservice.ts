import { OnStart, OnTick, Service } from "@flamework/core";

@Service()
/*
 * Activates ECS systems in order on tick
 */
export class CycleService implements OnTick {
	public onTick(dt: number): void {}
}
