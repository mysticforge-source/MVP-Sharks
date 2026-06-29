-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
-- bridge between JECS and Vide
local source = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "vide", "src").source
local World = TS.import(script, game:GetService("ReplicatedStorage"), "TS", "ecs", "world").World
-- a source that stores a component's value, up-to-date
local sourceComp = function(maid, entity, component)
	local newSource = source(World:get(entity, component))
	maid:Add(World:changed(component, function(ent, id, newvalue)
		if ent ~= entity then
			return nil
		end
		newSource(newvalue)
	end))
	return newSource
end
return {
	sourceComp = sourceComp,
}
