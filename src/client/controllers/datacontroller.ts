import { Controller, OnStart } from "@flamework/core";
import { clientMaid } from "client/clientmaid";
import { PlayerData } from "client/network/client";
import { coins } from "client/ui/sources";
import { UserDataComponent } from "shared/ecs/components";
import { World } from "shared/ecs/world";

export const PlayerEntity = World.entity();

@Controller()
/*
 * Updates PlayerEntity component data on sync event
 */
export class DataController implements OnStart {
    protected maid = clientMaid.sub()

    public onStart(): void {
        this.maid.add(
            PlayerData.on(data => {
                World.set(PlayerEntity, UserDataComponent, data);

                // update UI sources

                coins(data.coins);
            })
        );
    }
}
