-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Vide = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "vide", "src")
local css = TS.import(script, script.Parent.Parent, "theme").css
return function(_param)
	local text = _param.text
	local size = _param.size
	if size == nil then
		size = css.tittlebutton.Size
	end
	local position = _param.position
	if position == nil then
		position = css.tittlebutton.Position
	end
	local corner = _param.corner
	if corner == nil then
		corner = 0.13
	end
	local aspectratio = _param.aspectratio
	if aspectratio == nil then
		aspectratio = 4.5
	end
	local activated = _param.activated
	local _condition = aspectratio
	if _condition == nil then
		_condition = size.X.Scale / size.Y.Scale
	end
	local ratio = _condition
	local _attributes = table.clone(css.tittlebutton)
	setmetatable(_attributes, nil)
	_attributes.Size = size
	_attributes.Position = position
	_attributes.Text = text
	_attributes.Activated = activated
	local _exp = Vide.jsx("uiaspectratioconstraint", {
		AspectRatio = ratio,
	})
	local _attributes_1 = table.clone(css.tittlebuttonstroke)
	setmetatable(_attributes_1, nil)
	return Vide.jsx("textbutton", _attributes, _exp, Vide.jsx("uistroke", _attributes_1), Vide.jsx("uicorner", {
		CornerRadius = UDim.new(corner, 0),
	}))
end
