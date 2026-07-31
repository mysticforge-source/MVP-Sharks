/* client-side ecs components for view state */

import { Shark } from "client/controllers/ViewController";
import { World } from "shared/ecs/world";

export const SharkViewComponent = World.component<Shark>();
