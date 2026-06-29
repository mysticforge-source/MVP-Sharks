-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Vide = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "vide", "src")
local _theme = TS.import(script, script.Parent.Parent, "theme")
local attr = _theme.attr
local css = _theme.css
return function(props)
	local _attributes = table.clone(css.container)
	setmetatable(_attributes, nil)
	for _k, _v in attr(props) do
		_attributes[_k] = _v
	end
	return Vide.jsx("frame", _attributes, props.children)
end
