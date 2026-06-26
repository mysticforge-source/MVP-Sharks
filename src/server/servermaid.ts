// Serverside root Maid object

import { Maid } from "@rbxts/better-maid";

export const serverMaid = new Maid;

game.BindToClose(() => serverMaid.Cleanup());
