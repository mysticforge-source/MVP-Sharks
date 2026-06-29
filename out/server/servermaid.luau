-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
-- Serverside root Maid object
local Maid = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "better-maid", "out", "maid").Maid
local serverMaid = Maid.new()
game:BindToClose(function()
	return serverMaid:Cleanup()
end)
return {
	serverMaid = serverMaid,
}
