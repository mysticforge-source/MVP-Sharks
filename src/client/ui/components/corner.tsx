/* uicorner component */

import Vide from "@rbxts/vide";

export const Corner = ({ scale }: { scale: number }) => (
	<uicorner CornerRadius={new UDim(scale, 0)} />
);
