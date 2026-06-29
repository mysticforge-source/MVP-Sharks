-- Compiled with roblox-ts v3.0.0
--[[
	*
	 * A bunch of shortcuts
	 
]]
--[[
	*
	 * UDim2.fromScale --> new Us2
	 
]]
local Us2
do
	local super = UDim2
	Us2 = setmetatable({}, {
		__tostring = function()
			return "Us2"
		end,
		__index = super,
	})
	Us2.__index = Us2
	function Us2.new(...)
		local self = setmetatable({}, Us2)
		return self:constructor(...) or self
	end
	function Us2:constructor(xScale, yScale)
		return UDim2.new(xScale, 0, yScale, 0)
	end
end
local V2
do
	local super = Vector2
	V2 = setmetatable({}, {
		__tostring = function()
			return "V2"
		end,
		__index = super,
	})
	V2.__index = V2
	function V2.new(...)
		local self = setmetatable({}, V2)
		return self:constructor(...) or self
	end
	function V2:constructor(x, y)
		return Vector2.new(x, y)
	end
end
local V3
do
	local super = Vector3
	V3 = setmetatable({}, {
		__tostring = function()
			return "V3"
		end,
		__index = super,
	})
	V3.__index = V3
	function V3.new(...)
		local self = setmetatable({}, V3)
		return self:constructor(...) or self
	end
	function V3:constructor(x, y, z)
		return Vector3.new(x, y, z)
	end
end
local Col3
do
	local super = Color3
	Col3 = setmetatable({}, {
		__tostring = function()
			return "Col3"
		end,
		__index = super,
	})
	Col3.__index = Col3
	function Col3.new(...)
		local self = setmetatable({}, Col3)
		return self:constructor(...) or self
	end
	function Col3:constructor(R, G, B)
		local _condition = R
		if _condition == nil then
			_condition = 0
		end
		local _condition_1 = G
		if _condition_1 == nil then
			_condition_1 = R
			if _condition_1 == nil then
				_condition_1 = 0
			end
		end
		local _condition_2 = B
		if _condition_2 == nil then
			_condition_2 = G
			if _condition_2 == nil then
				_condition_2 = R
				if _condition_2 == nil then
					_condition_2 = 0
				end
			end
		end
		return Color3.new(_condition, _condition_1, _condition_2)
	end
end
return {
	Us2 = Us2,
	V2 = V2,
	V3 = V3,
	Col3 = Col3,
}
