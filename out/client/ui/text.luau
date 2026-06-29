-- Compiled with roblox-ts v3.0.0
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local source = TS.import(script, game:GetService("ReplicatedStorage"), "rbxts_include", "node_modules", "@rbxts", "vide", "src").source
--[[
	
	 * Collection of text used throughout the game
	 
]]
local text = {
	en = {
		Play = "Play",
		Shop = "Shop",
		Settings = "Settings",
	},
}
-- localisation language source
local lang = source("en")
-- gets localised text
local loc = function(prompt)
	return text[lang()][prompt]
end
return {
	text = text,
	lang = lang,
	loc = loc,
}
