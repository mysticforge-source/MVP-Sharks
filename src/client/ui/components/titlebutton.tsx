import Vide from "@rbxts/vide"
import { css } from "../theme"

declare interface Props {
    text: string,
    size?: UDim2,
    position?: UDim2,
    corner?: number,
    aspectratio?: number,

    activated: () => void,
}

export = (
    {
        text,
        size = css.tittlebutton.Size as UDim2,
        position = css.tittlebutton.Position as UDim2,
        corner = 0.13,
        aspectratio = 4.5,
        activated
    }: Props
) => {
    const ratio = aspectratio ?? size.X.Scale/size.Y.Scale

    return (
        <textbutton
            {...css.tittlebutton}

            Size={size}
            Position={position}
            Text={text}

            Activated={activated}
        >
            <uiaspectratioconstraint AspectRatio={ratio} />
            <uistroke {...css.tittlebuttonstroke} />
            <uicorner CornerRadius={new UDim(corner, 0)} />
        </textbutton>
    );
}
