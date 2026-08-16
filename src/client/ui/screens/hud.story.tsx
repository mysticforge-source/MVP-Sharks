import Hud from "./hud";
import Vide from "@rbxts/vide";

// export = {
// 	vide: Vide,
// 	story: () => {
// 		return <Hud enabled={true} />;
// 	},
// };

export = (frame: Instance) => Vide.mount(() => <Hud />, frame);
