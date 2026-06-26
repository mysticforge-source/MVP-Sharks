import Vide from "@rbxts/vide";
import { attr, css } from "../css";

export = (props: css.frame) => (
    <frame {...css.container} {...attr(props)}>
        {props.children}
    </frame>
)
