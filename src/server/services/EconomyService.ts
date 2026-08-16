import { OnInit, Service } from "@flamework/core";
import { DataService, PlayerToEntity } from "./DataService";
import { sharkcatalog, upgradedata } from "shared/data";
import { World } from "shared/ecs/world";
import { DirtyPlayComponent, PlayComponent } from "server/components";
import { BuyUpgrade } from "server/network/server";

@Service()
/** Handles economy functions outside of DataService */
export class EconomyService implements OnInit {
	constructor(private readonly DataService: DataService) {}

	onInit(): void | Promise<void> {
		// TODO: PUT RATELIMITS AGAINST DDOS
		BuyUpgrade.on((player) => this.buyUpgrade(player));
	}

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

	public buyUpgrade(player: Player): true | "Not enough coins" | "Max upgrade" | "Error" {
		const globaldata = this.DataService.getPlayerData(player);
		if (!globaldata) return "Error";

		const data = this.DataService.getPlayerIngameData(player);
		if (!data) return "Error";

		const entity = PlayerToEntity.get(player);
		if (!entity) return "Error";

		const upgrade = data.upgrade;
		if (upgrade >= upgradedata.size() - 1) return "Max upgrade";

		if (globaldata.coins > upgradedata[upgrade + 1].cost!) {
			this.DataService.changePlayerData(player, {
				coins: globaldata.coins - upgradedata[upgrade + 1].cost!,
			});

			World.set(entity, PlayComponent, {
				...data,
				upgrade: upgrade + 1,
			});
			World.add(entity, DirtyPlayComponent);
		} else return "Not enough coins";

		return true;
	}
}
