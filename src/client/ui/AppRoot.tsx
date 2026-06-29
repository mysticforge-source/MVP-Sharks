import Vide from '@rbxts/vide';

import Titlescreen from './screens/titlescreen';
import { Menu } from './sources';

export = () => ( 
    <>
        <Titlescreen enabled={() => Menu() === "Title"} />
    </>
)
