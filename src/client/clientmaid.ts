// Clientside root Maid object

import { Maid } from "@rbxts/better-maid";
import { Players } from "@rbxts/services";

export const clientMaid = new Maid;

clientMaid.on(Players.PlayerRemoving, (plr: Player) => {
    if (plr === Players.LocalPlayer) clientMaid.Cleanup()
})
