import Vide from "@rbxts/vide";
import { css } from "../theme";
import Titlebutton from "../components/titlebutton";
import { Menu } from "../sources";
import text from "../text";
import Listcontainer from "../components/listcontainer";

declare interface Props {
	enabled?: Vide.Derivable<boolean>
}

export = (
	{
		enabled = true
	}: Props
) => (
	<screengui
		{...css.screen}
		Name="Title"

		Enabled={enabled}
	>
		<Listcontainer
			Position={UDim2.fromScale(.5, .6)}
			Size={UDim2.fromScale(.2, .3)}
		>
			<uiaspectratioconstraint />
			
			<Titlebutton
				text={text.en.Play}

				activated={() => {
					Menu("GAME")
				}}
			/>

			<Titlebutton
				text={text.en.Shop}

				activated={() => {
					Menu("Shop")
				}}
			/>

			<Titlebutton
				text={text.en.Settings}

				activated={() => {
					Menu("Settings")
				}}
			/>
		</Listcontainer>
	</screengui>
)
