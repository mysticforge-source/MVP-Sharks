-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
-- Clientside root Maid object
local Maid = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "better-maid", "out", "maid").Maid
local Players = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services").Players
local clientMaid = Maid.new()
clientMaid:on(Players.PlayerRemoving, function(plr)
	if plr == Players.LocalPlayer then
		clientMaid:Cleanup()
	end
end)
return {
	clientMaid = clientMaid,
}
