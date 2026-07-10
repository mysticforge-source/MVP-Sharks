import { sharkcosts } from "shared/data";
import { Result } from "shared/logic/logictypes";
import { UserData } from "shared/networktypes";

export = class {
	public purchaseShark(data: UserData, sharkid: number): Result<UserData> {
		if (data.coins < sharkcosts[sharkid])
			return {
				success: false,
				msg: "Not enough coins",
				data: data,
			};

		return {
			success: true,
			msg: "Shark purchased",
			data: {
				...data,
				coins: data.coins - sharkcosts[sharkid],
				// TODO: owned sharks data
			},
		};
	}
};
