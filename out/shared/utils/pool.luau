-- Compiled with roblox-ts v3.0.0
--[[
	
	 * Pool object to pool repetitive instances
	 
]]
local Pool
do
	Pool = setmetatable({}, {
		__tostring = function()
			return "Pool"
		end,
	})
	Pool.__index = Pool
	function Pool.new(...)
		local self = setmetatable({}, Pool)
		return self:constructor(...) or self
	end
	function Pool:constructor()
		self.pool = {}
	end
	function Pool:add(object, cloneAmount)
		do
			local i = 1
			local _shouldIncrement = false
			while true do
				if _shouldIncrement then
					i += 1
				else
					_shouldIncrement = true
				end
				local _exp = i
				local _condition = cloneAmount
				if _condition == nil then
					_condition = 1
				end
				if not (_exp < _condition) then
					break
				end
				local obj = object:Clone()
				local _exp_1 = self.pool
				table.insert(_exp_1, obj)
			end
		end
		local _pool = self.pool
		local _object = object
		table.insert(_pool, _object)
	end
	function Pool:get()
		local _exp = self.pool
		-- ▼ Array.pop ▼
		local _length = #_exp
		local _result = _exp[_length]
		_exp[_length] = nil
		-- ▲ Array.pop ▲
		return _result
	end
	function Pool:Destroy()
		table.clear(self.pool)
	end
end
return {
	Pool = Pool,
}
