import Vide from "@rbxts/vide"
import { V2 } from "shared/utils/shortcuts"
import { titleButtonBgColor, titleButtonStroke, titleButtonStrokeColor, titleButtonTextColor, titleButtonTextFont } from "../theme"

export = (
    props: {
        text: string,
        size: UDim2,
        position: UDim2,
        corner?: number,
        aspectratio?: number,

        activated: () => void,
    }
) => (
    <textbutton
        Text={props.text}
        Size={props.size}
        Position={props.position}
        AnchorPoint={new V2(.5, .5)}
        Activated={props.activated}
        TextScaled={true}
        TextColor3={titleButtonTextColor}
        Font={titleButtonTextFont}

        BackgroundColor3={titleButtonBgColor}
    >
        <uiaspectratioconstraint 
            AspectRatio={props.aspectratio ?? (props.size.X.Scale/props.size.Y.Scale)} 
        />
        <uistroke 
            StrokeSizingMode={"ScaledSize"}
            BorderStrokePosition={"Outer"}
            Color={titleButtonStrokeColor}
            Thickness={titleButtonStroke}
            ApplyStrokeMode={"Border"}
        />
        <uicorner 
            CornerRadius={new UDim(props.corner ?? 0.13, 0)} 
        />
    </textbutton>
)
