/*
 * view system: syncs shark models to hitboxes
 * runs on render thread via cyclecontroller
 */

import { NPCViewComponent, SharkViewComponent } from "client/state/components";
import { npccatalog } from "shared/data";
import { World } from "shared/ecs/world";

const npc_lerpSpeed = 4; //2.5

export default (dt: number) => {
	// render player models
	for (const [entity, data] of World.query(SharkViewComponent)) {
		data.sharkModel.PrimaryPart?.PivotTo(data.hitbox.ViewAttachment.WorldCFrame);

		// play the attack animation if attack amount value is different
		const attackAmount = data.hitbox.GetAttribute("AttackAmount") as number;
		if (attackAmount !== data.prev_attacks) {
			data.attack_track.Play();

			World.set(entity, SharkViewComponent, {
				...data,
				prev_attacks: attackAmount,
			});
		}
	}

	// render npc models
	for (const [entity, data] of World.query(NPCViewComponent)) {
		data.npcModel.PrimaryPart?.PivotTo(
			data.npcModel.PrimaryPart?.CFrame.Lerp(
				data.hitbox.ViewAttachment.WorldCFrame,
				1 - math.exp(-npc_lerpSpeed * dt),
			),
		);

		const hp = data.hitbox.GetAttribute("HP") as number;
		const maxhp = npccatalog[data.npcId].health;

		// figure out the hp display
		data.npcModel.Display.HP.Green.Size = UDim2.fromScale(hp / maxhp, 1);

		data.npcModel.Display.HPText.Text = `${hp}/${maxhp}`;

		// data.npcModel.PrimaryPart?.PivotTo(data.hitbox.ViewAttachment.WorldCFrame);

		// play the attack animation if attack amount value is different
		const attackAmount = data.hitbox.GetAttribute("AttackAmount") as number;
		if (attackAmount !== data.prev_attacks) {
			data.attack_track.Play();

			World.set(entity, NPCViewComponent, {
				...data,
				prev_attacks: attackAmount,
			});
		}
	}
};
