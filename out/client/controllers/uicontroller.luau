-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Reflect = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@flamework", "core", "out").Reflect
local Controller = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@flamework", "core", "out").Controller
local Players = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "services").Players
local Vide = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "vide", "src")
local clientMaid = TS.import(script, script.Parent.Parent, "clientmaid").clientMaid
local AppRoot = TS.import(script, script.Parent.Parent, "ui", "AppRoot")
--[[
	
	 * Mounts AppRoot onto the PlayerGui
	 
]]
local UIController
do
	UIController = setmetatable({}, {
		__tostring = function()
			return "UIController"
		end,
	})
	UIController.__index = UIController
	function UIController.new(...)
		local self = setmetatable({}, UIController)
		return self:constructor(...) or self
	end
	function UIController:constructor()
		self.maid = clientMaid:sub()
	end
	function UIController:onStart()
		local PlayerGui = Players.LocalPlayer:WaitForChild("PlayerGui")
		self.maid:add(Vide.mount(AppRoot, PlayerGui), true)
	end
	do
		-- (Flamework) UIController metadata
		Reflect.defineMetadata(UIController, "identifier", "client/controllers/uicontroller@UIController")
		Reflect.defineMetadata(UIController, "flamework:implements", { "$:flamework@OnStart" })
	end
end
-- (Flamework) UIController decorators
Reflect.decorate(UIController, "$:flamework@Controller", Controller, { {
	loadOrder = 999,
} })
return {
	UIController = UIController,
}
