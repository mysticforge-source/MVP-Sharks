// ECS Components used by both client and server

import { UserData } from "shared/networktypes";
import { World } from "./world";

// user data component
export const UserDataComponent = World.component<UserData>();

// shared components
export const HealthComponent = World.component<{max: number, current: number}>();
