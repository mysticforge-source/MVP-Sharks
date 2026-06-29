-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Reflect = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@flamework", "core", "out").Reflect
local Service = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@flamework", "core", "out").Service
--[[
	
	 * Activates ECS systems in order on tick
	 
]]
local CycleService
do
	CycleService = setmetatable({}, {
		__tostring = function()
			return "CycleService"
		end,
	})
	CycleService.__index = CycleService
	function CycleService.new(...)
		local self = setmetatable({}, CycleService)
		return self:constructor(...) or self
	end
	function CycleService:constructor()
	end
	function CycleService:onTick(dt)
	end
	do
		-- (Flamework) CycleService metadata
		Reflect.defineMetadata(CycleService, "identifier", "server/services/cycleservice@CycleService")
		Reflect.defineMetadata(CycleService, "flamework:implements", { "$:flamework@OnTick" })
	end
end
-- (Flamework) CycleService decorators
Reflect.decorate(CycleService, "$:flamework@Service", Service, {})
return {
	CycleService = CycleService,
}
