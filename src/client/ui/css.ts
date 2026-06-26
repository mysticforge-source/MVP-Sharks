import Vide, { JSX } from "@rbxts/vide";
import { Col3, Us2, V2 } from "shared/utils/shortcuts";

/*
 * A CSS module used for storing repetitive UI properties.
 */

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

// The CSS object
export const css = {
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
