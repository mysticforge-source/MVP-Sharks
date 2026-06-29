-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Vide = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "vide", "src")
local AppRoot = TS.import(script, script.Parent, "AppRoot")
--[[
	
	 * Storybook function. Vide.mount returns the destructor
	
]]
return function(target)
	return Vide.mount(AppRoot, target)
end
