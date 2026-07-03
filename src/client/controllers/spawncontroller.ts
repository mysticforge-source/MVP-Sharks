import { Controller, OnStart } from "@flamework/core";
import { SpawnFunction } from "client/network/client";

@Controller()
export class SpawnController implements OnStart {
	constructor() {}

	public onStart(): void {
		// for testing
		const res = SpawnFunction.call(0);
		warn("result: ${res}");
	}
}
