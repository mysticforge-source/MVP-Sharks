/*
 * title screen ui
 * shows when menu is set to title
 */

import Vide from '@rbxts/vide';

import Container from '../components/container';
import Titlebutton from '../components/titlebutton';
import { Menu } from '../sources';
import { css } from '../theme';

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
		<Container
			Position={UDim2.fromScale(.5, .6)}
			Size={UDim2.fromScale(.2, .3)}
		>
			<uilistlayout 
				FillDirection={"Vertical"}
				SortOrder={"LayoutOrder"}
				VerticalFlex={"SpaceEvenly"}
				HorizontalFlex={"SpaceAround"}
				Padding={new UDim(0.1, 0)}
			/>
			<uiaspectratioconstraint />
			
			<Titlebutton
				text={"Play"}

				activated={() => {
					Menu("GAME")
				}}
			/>

			<Titlebutton
				text={"Shop"}

				activated={() => {
					Menu("Shop")
				}}
			/>

			<Titlebutton
				text={"Settings"}

				activated={() => {
					Menu("Settings")
				}}
			/>
		</Container>
	</screengui>
)
