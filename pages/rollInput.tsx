import { ChangeEvent, useState } from "react";
import { PlayerEnum, RollTypeEnum } from "../utils/definitions";
import { trpcNext } from "../utils/trpc";

export default function RollInput() {
  const [player, setPlayer] = useState<PlayerEnum>(PlayerEnum.aaron);
  const [rollType, setRollType] = useState<RollTypeEnum>(
    RollTypeEnum.skill_Acrobatics
  );
  const [total, setTotal] = useState<number>();
  const [damage, setDamage] = useState<number>();
  const [note, setNote] = useState<string>("");

  const { mutateAsync } = trpcNext.postRow.useMutation();

  const onTotalChange = function (e: ChangeEvent<HTMLInputElement>) {
    const value = !Number.isNaN(e.target.valueAsNumber)
      ? e.target.valueAsNumber
      : null;
    if (value) setTotal(value);
  };

  const onDamageChange = function (e: ChangeEvent<HTMLInputElement>) {
    const value = !Number.isNaN(e.target.valueAsNumber)
      ? e.target.valueAsNumber
      : null;
    if (value) setDamage(value);
  };

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // Prevent the browser from reloading the page
    // e.preventDefault();
    mutateAsync({
      player: player,
      type: rollType,
      total: total,
      damage: damage,
      note: note,
    });
  }

  return (
    <tr>
      <td>
        <form id="form1" method="post" onSubmit={handleSubmit}>
          <select
            name="player"
            value={player}
            onChange={(e) => setPlayer(e.target.value as PlayerEnum)}
          >
            <option value={PlayerEnum.aaron}>Aaron</option>
            <option value={PlayerEnum.connor}>Connor</option>
            <option value={PlayerEnum.tegg}>Tegg</option>
            <option value={PlayerEnum.thomas}>Thomas</option>
          </select>
        </form>
      </td>
      <td>
        <select
          form="form1"
          name="type"
          value={rollType}
          onChange={(e) => setRollType(e.target.value as RollTypeEnum)}
        >
          <optgroup label="Skill Checks">
            <option value={RollTypeEnum.skill_Acrobatics}>Acrobatics</option>
            <option value={RollTypeEnum.skill_AnimalHandling}>
              Animal Handling
            </option>
            <option value={RollTypeEnum.skill_Arcana}>Arcana</option>
            <option value={RollTypeEnum.skill_Athletics}>Athletics</option>
            <option value={RollTypeEnum.skill_Deception}>Deception</option>
            <option value={RollTypeEnum.skill_History}>History</option>
            <option value={RollTypeEnum.skill_Insight}>Insight</option>
            <option value={RollTypeEnum.skill_Intimidation}>
              Intimidation
            </option>
            <option value={RollTypeEnum.skill_Investigation}>
              Investigation
            </option>
            <option value={RollTypeEnum.skill_Medicine}>Medicine</option>
            <option value={RollTypeEnum.skill_Nature}>Nature</option>
            <option value={RollTypeEnum.skill_Perception}>Perception</option>
            <option value={RollTypeEnum.skill_Performance}>Performance</option>
            <option value={RollTypeEnum.skill_Persuasion}>Persuasion</option>
            <option value={RollTypeEnum.skill_Religion}>Religion</option>
            <option value={RollTypeEnum.skill_SleightOfHand}>
              Sleight of Hand
            </option>
            <option value={RollTypeEnum.skill_Stealth}>Stealth</option>
            <option value={RollTypeEnum.skill_Survival}>Survival</option>
            <option value={RollTypeEnum.skill_Tool}>Tool</option>
          </optgroup>
          <optgroup label="Saving Throw">
            <option value={RollTypeEnum.savingThrow_Strength}>Strength</option>
            <option value={RollTypeEnum.savingThrow_Dexterity}>
              Dexterity
            </option>
            <option value={RollTypeEnum.savingThrow_Constitution}>
              Constitution
            </option>
            <option value={RollTypeEnum.savingThrow_Intelligence}>
              Intelligence
            </option>
            <option value={RollTypeEnum.savingThrow_Wisdom}>Wisdom</option>
            <option value={RollTypeEnum.savingThrow_Charisma}>Charisma</option>
            <option value={RollTypeEnum.savingThrow_Death}>Death</option>
          </optgroup>
          <optgroup label="Ability Checks">
            <option value={RollTypeEnum.ability_Strength}>Strength</option>
            <option value={RollTypeEnum.ability_Dexterity}>Dexterity</option>
            <option value={RollTypeEnum.ability_Constitution}>
              Constitution
            </option>
            <option value={RollTypeEnum.ability_Intelligence}>
              Intelligence
            </option>
            <option value={RollTypeEnum.ability_Wisdom}>Wisdom</option>
            <option value={RollTypeEnum.ability_Charisma}>Charisma</option>
          </optgroup>
          <optgroup label="Attacks">
            <option value={RollTypeEnum.attack_Melee}>Melee</option>
            <option value={RollTypeEnum.attack_Ranged}>Ranged</option>
            <option value={RollTypeEnum.attack_Spell}>Spell</option>
          </optgroup>
          <optgroup label="Other">
            <option value={RollTypeEnum.other_Damage}>Damage</option>
            <option value={RollTypeEnum.other_Initiative}>Initiative</option>
            <option value={RollTypeEnum.other_SecondWind}>Second Wind</option>
            <option value={RollTypeEnum.other_Custom}>Custom</option>
          </optgroup>
        </select>
      </td>
      <td>
        <input
          form="form1"
          type="number"
          name="total"
          value={total ?? ""}
          onKeyDown={(event) => {
            if (!/[0-9]/.test(event.key)) {
              event.preventDefault();
            }
          }}
          onChange={onTotalChange}
        />
      </td>
      <td>
        <input
          form="form1"
          type="number"
          name="damage"
          value={damage ?? ""}
          onKeyDown={(event) => {
            if (!/[0-9]/.test(event.key)) {
              event.preventDefault();
            }
          }}
          onChange={onDamageChange}
        />
      </td>
      <td>
        <input
          form="form1"
          type="text"
          name="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </td>
      <td>
        <input form="form1" type="submit" value="Save" />
      </td>
    </tr>
  );
}
