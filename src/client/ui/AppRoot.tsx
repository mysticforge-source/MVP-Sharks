import Vide, { source, spring } from "@rbxts/vide"
import Container from "./components/container"
import { Menu } from "./sources"
import { Us2 } from "shared/utils/shortcuts"
import Titlebutton from "./components/titlebutton"
import Titlescreen from "./screens/titlescreen"

export = () => ( 
    <>
        <Titlescreen enabled={() => Menu() === "Title"} />
    </>
)
