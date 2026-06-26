import Vide, { source, spring } from "@rbxts/vide"
import Container from "./components/container"
import { Menu } from "./sources"
import { Us2 } from "shared/utils/shortcuts"
import Titlebutton from "./components/titlebutton"
import text from "./text"

export = () => ( 
    <screengui 
        Name = {"Main"}
        IgnoreGuiInset = {true}
        Enabled = {true}
        ResetOnSpawn = {false}
    >
        {/* Title Screen */}
        <Container
            Visible={() => Menu() === "Title"}
        >
            <Titlebutton
                text={text.en.Play}
                position={new Us2(.5, .7)}
                size={new Us2(.3, .045)}
                aspectratio={4.5}

                activated={() => {
                    Menu("GAME")
                }}
            />

            <Titlebutton
                text={text.en.Shop}
                position={new Us2(.5, .8)}
                size={new Us2(.3, .045)}
                aspectratio={4.5}

                activated={() => {
                    Menu("Shop")
                }}
            />

            <Titlebutton
                text={text.en.Settings}
                position={new Us2(.5, .9)}
                size={new Us2(.3, .045)}
                aspectratio={4.5}

                activated={() => {
                    Menu("Settings")
                }}
            />

        </Container>

        {/* Slot Selection */}
        <Container
            Visible={() => Menu() === "Slot"}
        >
            
        </Container>

        {/* Shark Selection */}
        <Container
            Visible={() => Menu() === "Sharks"}
        >
            
        </Container>

        {/* GAME HUD */}
        <Container
            Visible={() => Menu() === "GAME"}
        >
            
        </Container>

    </screengui>
)
