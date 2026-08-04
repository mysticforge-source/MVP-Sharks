/* app root: mounts all ui screens */

import Vide from '@rbxts/vide';

import Titlescreen from './screens/titlescreen';
import { Menu } from './sources';
import Hud from './screens/hud';

export = () => ( 
    <>
        <Titlescreen enabled={() => Menu() === "Title"} />
        <Hud enabled={() => Menu() === "GAME"} />
    </>
)
