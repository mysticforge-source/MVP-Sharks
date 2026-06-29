-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Reflect = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@flamework", "core", "out").Reflect
local Controller = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@flamework", "core", "out").Controller
local InputManager = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "mechanism", "out").InputManager
--[[
	
	 * Exposes an InputManager, allows for controllers implementing OnInput
	 * to have `inputs` binded to the InputManager
	 
]]
local InputController
do
	InputController = setmetatable({}, {
		__tostring = function()
			return "InputController"
		end,
	})
	InputController.__index = InputController
	function InputController.new(...)
		local self = setmetatable({}, InputController)
		return self:constructor(...) or self
	end
	function InputController:constructor()
		self.inputManager = InputManager.new()
	end
	function InputController:bind(action)
		self.inputManager:bind(action)
	end
	function InputController:unbind(action)
		self.inputManager:unbind(action)
	end
	function InputController:bindAll(obj)
		for _, action in pairs(obj.inputs) do
			self.inputManager:bind(action)
		end
	end
	function InputController:unbindAll(obj)
		for _, action in pairs(obj.inputs) do
			self.inputManager:unbind(action)
		end
	end
	do
		-- (Flamework) InputController metadata
		Reflect.defineMetadata(InputController, "identifier", "client/controllers/inputcontroller@InputController")
	end
end
-- (Flamework) InputController decorators
Reflect.decorate(InputController, "$:flamework@Controller", Controller, {})
return {
	InputController = InputController,
}
