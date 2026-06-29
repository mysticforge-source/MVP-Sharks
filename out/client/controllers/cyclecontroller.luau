-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Reflect = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@flamework", "core", "out").Reflect
local Controller = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@flamework", "core", "out").Controller
--[[
	
	 * Activates ECS systems in order
	 
]]
local CycleController
do
	CycleController = setmetatable({}, {
		__tostring = function()
			return "CycleController"
		end,
	})
	CycleController.__index = CycleController
	function CycleController.new(...)
		local self = setmetatable({}, CycleController)
		return self:constructor(...) or self
	end
	function CycleController:constructor()
	end
	function CycleController:onTick(dt)
	end
	do
		-- (Flamework) CycleController metadata
		Reflect.defineMetadata(CycleController, "identifier", "client/controllers/cyclecontroller@CycleController")
		Reflect.defineMetadata(CycleController, "flamework:implements", { "$:flamework@OnTick" })
	end
end
-- (Flamework) CycleController decorators
Reflect.decorate(CycleController, "$:flamework@Controller", Controller, {})
return {
	CycleController = CycleController,
}
