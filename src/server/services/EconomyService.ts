import { Service } from "@flamework/core";
import { DataService } from "./DataService";
import { sharkcatalog } from "shared/data";

@Service()
/** Handles economy functions outside of DataService */
export class EconomyService {
	constructor(private readonly DataService: DataService) {}

	/** Buy the shark successfully (true) or some problem occurs */
	public buyShark(player: Player, shark: number): true | "Not enough coins" | "Error" {
		const data = this.DataService.getPlayerData(player);
		if (!data) return "Error";

		const sharkdata = sharkcatalog[shark];
		if (!sharkdata) return "Error";

		if (data.sharkcoins < sharkdata.cost) {
			throw "Not enough coins";
		}

		this.DataService.changePlayerData(player, {
			sharkcoins: data.sharkcoins - sharkdata.cost,
		});

		return true;
	}
}
