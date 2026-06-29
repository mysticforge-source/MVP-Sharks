-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Vide = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "vide", "src")
local Container = TS.import(script, script.Parent, "container")
local css = TS.import(script, script.Parent.Parent, "theme").css
return function(props)
	local _attributes = table.clone(props)
	setmetatable(_attributes, nil)
	local _attributes_1 = table.clone(css.listcontainerlayout)
	setmetatable(_attributes_1, nil)
	return Vide.jsx(Container, _attributes, Vide.jsx("uilistlayout", _attributes_1))
end
