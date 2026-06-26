// bridge between JECS and Vide

import { Maid } from "@rbxts/better-maid";
import { Entity } from "@rbxts/jecs";
import { source } from "@rbxts/vide";
import { World } from "shared/ecs/world";

// a source that stores a component's value, up-to-date
export const sourceComp = (maid: Maid, entity: Entity, component: Entity) => {
    const newSource = source(World.get(entity, component));

    maid.Add(
        World.changed(component, (ent, id, newvalue) => {
            if (ent !== entity) return;
            newSource(newvalue);
        })
    );

    return newSource;
}
