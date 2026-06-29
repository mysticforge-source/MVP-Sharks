-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Reflect = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@flamework", "core", "out").Reflect
local Controller = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@flamework", "core", "out").Controller
local clientMaid = TS.import(script, script.Parent.Parent, "clientmaid").clientMaid
local PlayerData = TS.import(script, script.Parent.Parent, "network", "client").PlayerData
local coins = TS.import(script, script.Parent.Parent, "ui", "sources").coins
local UserDataComponent = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "ecs", "components").UserDataComponent
local World = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "ecs", "world").World
local PlayerEntity = World:entity()
--[[
	
	 * Updates PlayerEntity component data on sync event
	 
]]
local DataController
do
	DataController = setmetatable({}, {
		__tostring = function()
			return "DataController"
		end,
	})
	DataController.__index = DataController
	function DataController.new(...)
		local self = setmetatable({}, DataController)
		return self:constructor(...) or self
	end
	function DataController:constructor()
		self.maid = clientMaid:sub()
	end
	function DataController:onStart()
		self.maid:add(PlayerData.on(function(data)
			World:set(PlayerEntity, UserDataComponent, data)
			-- update UI sources
			coins(data.coins)
		end))
	end
	do
		-- (Flamework) DataController metadata
		Reflect.defineMetadata(DataController, "identifier", "client/controllers/datacontroller@DataController")
		Reflect.defineMetadata(DataController, "flamework:implements", { "$:flamework@OnStart" })
	end
end
-- (Flamework) DataController decorators
Reflect.decorate(DataController, "$:flamework@Controller", Controller, {})
return {
	PlayerEntity = PlayerEntity,
	DataController = DataController,
}
