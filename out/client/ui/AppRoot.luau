-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Vide = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "vide", "src")
local Menu = TS.import(script, script.Parent, "sources").Menu
local Titlescreen = TS.import(script, script.Parent, "screens", "titlescreen")
return function()
	return Vide.jsx(Vide.Fragment, nil, Vide.jsx(Titlescreen, {
		enabled = function()
			return Menu() == "Title"
		end,
	}))
end
