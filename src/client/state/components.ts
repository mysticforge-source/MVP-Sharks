/* client-side ecs components for view state */

import { NPC, Shark } from "client/controllers/ViewController";
import { World } from "shared/ecs/world";

export const SharkViewComponent = World.component<Shark>();
export const NPCViewComponent = World.component<NPC>();

export const LevelChangeIntent = World.entity();
