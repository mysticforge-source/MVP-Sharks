-- Compiled with roblox-ts v3.0.0
-- A CSS module used for storing repetitive UI properties.
-- The CSS object
local css = {
	tittlebutton = {
		TextColor3 = Color3.fromRGB(252, 250, 250),
		Font = Enum.Font.GothamBold,
		AnchorPoint = Vector2.new(.5, .5),
		TextScaled = true,
		Position = UDim2.fromScale(.5, .5),
		Size = UDim2.fromScale(.3, .045),
		BackgroundColor3 = Color3.fromRGB(166, 224, 242),
	},
	tittlebuttonstroke = {
		Color = Color3.fromRGB(245, 247, 247),
		Thickness = 0.02,
		StrokeSizingMode = "ScaledSize",
		BorderStrokePosition = "Outer",
		ApplyStrokeMode = "Border",
	},
	listcontainerlayout = {
		FillDirection = "Vertical",
		SortOrder = "LayoutOrder",
		VerticalFlex = "SpaceEvenly",
		Padding = UDim.new(.1, 0),
	},
	screen = {
		ResetOnSpawn = false,
		IgnoreGuiInset = true,
		Enabled = true,
		Name = "Main",
	},
	container = {
		BackgroundTransparency = 1,
		Size = UDim2.new(1, 0, 1, 0),
		AnchorPoint = Vector2.new(.5, .5),
		Position = UDim2.new(.5, 0, .5, 0),
	},
}
-- Type of an object containing properties of instance T
-- Shortcuts for usual instances
-- A shortcut function that returns properties from given 
-- Vide component properties
local props = function(obj)
	if not obj then
		return {}
	end
	local _object = table.clone(obj)
	setmetatable(_object, nil)
	local props = _object
	props.children = nil
	return props
end
-- Alias for props
local attr = props
return {
	css = css,
	props = props,
	attr = attr,
}
