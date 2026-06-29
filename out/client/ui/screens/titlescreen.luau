-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Vide = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "vide", "src")
local css = TS.import(script, script.Parent.Parent, "theme").css
local Titlebutton = TS.import(script, script.Parent.Parent, "components", "titlebutton")
local Menu = TS.import(script, script.Parent.Parent, "sources").Menu
local text = TS.import(script, script.Parent.Parent, "text")
local Listcontainer = TS.import(script, script.Parent.Parent, "components", "listcontainer")
return function(_param)
	local enabled = _param.enabled
	if enabled == nil then
		enabled = true
	end
	local _attributes = table.clone(css.screen)
	setmetatable(_attributes, nil)
	_attributes.Name = "Title"
	_attributes.Enabled = enabled
	return Vide.jsx("screengui", _attributes, Vide.jsx(Listcontainer, {
		Position = UDim2.fromScale(.5, .6),
		Size = UDim2.fromScale(.2, .3),
	}, Vide.jsx("uiaspectratioconstraint"), Vide.jsx(Titlebutton, {
		text = text.en.Play,
		activated = function()
			Menu("GAME")
		end,
	}), Vide.jsx(Titlebutton, {
		text = text.en.Shop,
		activated = function()
			Menu("Shop")
		end,
	}), Vide.jsx(Titlebutton, {
		text = text.en.Settings,
		activated = function()
			Menu("Settings")
		end,
	})))
end
