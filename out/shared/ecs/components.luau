-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
-- ECS Components used by both client and server
local World = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "ecs", "world").World
-- user data component
local UserDataComponent = World:component()
-- shared components
local HealthComponent = World:component()
return {
	UserDataComponent = UserDataComponent,
	HealthComponent = HealthComponent,
}
