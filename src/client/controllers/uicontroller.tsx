import { Controller, OnStart } from "@flamework/core";
import { Players } from "@rbxts/services"
import Vide from "@rbxts/vide";
import { clientMaid } from "client/clientmaid";
import AppRoot from "client/ui/AppRoot";

@Controller(
    {loadOrder: 999}
)
/*
 * Mounts AppRoot onto the PlayerGui
 */
export class UIController implements OnStart {
    protected maid = clientMaid.sub();

    public onStart(): void {
        const PlayerGui = Players.LocalPlayer.WaitForChild("PlayerGui") as PlayerGui;

        this.maid.add(
            Vide.mount(AppRoot, PlayerGui), true
        );
    }
}
