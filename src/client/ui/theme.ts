// A CSS module used for storing repetitive UI properties.

import Vide, { JSX } from "@rbxts/vide";

// The CSS object
export const css = {
    tittlebutton: {
        TextColor3: Color3.fromRGB(252, 250, 250),
        Font: Enum.Font.GothamBold,
        AnchorPoint: new Vector2(.5, .5),
        TextScaled: true,

        Position: UDim2.fromScale(.5 ,.5),
        Size: UDim2.fromScale(.3, .045),

        BackgroundColor3: Color3.fromRGB(166, 224, 242),
    } as css.textbutton,

    tittlebuttonstroke: {
        Color: Color3.fromRGB(245, 247, 247),
        Thickness: 0.02,
        StrokeSizingMode: "ScaledSize",
        BorderStrokePosition: "Outer",
        ApplyStrokeMode: "Border"
    } as CSS<'uistroke'>,

    listcontainerlayout: {
        FillDirection: "Vertical",
        SortOrder: "LayoutOrder",
        VerticalFlex: "SpaceEvenly",
        Padding: new UDim(.1, 0)
    } as CSS<'uilistlayout'>,

    screen: {
        ResetOnSpawn: false,
        IgnoreGuiInset: true,
        Enabled: true,
        Name: "Main",
    } as css.screen,

    container: {
        BackgroundTransparency: 1,
        Size: new UDim2(1, 0, 1, 0),
        AnchorPoint: new Vector2(.5, .5),
        Position: new UDim2(.5, 0, .5, 0),
    } as css.frame
}


// Type of an object containing properties of instance T
export type CSS
    <T extends keyof JSX.IntrinsicElements> = Partial<JSX.IntrinsicElements[T]>

// Shortcuts for usual instances
export declare namespace css {
    export type frame = CSS<'frame'>
    export type screen = CSS<'screengui'>
    export type imagelabel = CSS<'imagelabel'>
    export type textlabel = CSS<'textlabel'>
    export type textbutton = CSS<'textbutton'>
    export type imagebutton = CSS<'imagebutton'>
    export type viewportframe = CSS<'viewportframe'>
}

// A shortcut function that returns properties from given 
// Vide component properties
export const props = <T extends CSS<any>>(obj?: T) => {
    if (!obj) return {};
    
    const props = {...obj};
    delete props.children;
    return props;
}

// Alias for props
export const attr = props;
