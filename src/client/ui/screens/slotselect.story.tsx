import Vide from "@rbxts/vide";
import Slotselect from "./slotselect";

export = (frame: Instance) => Vide.mount(() => <Slotselect enabled={() => true} />, frame);
