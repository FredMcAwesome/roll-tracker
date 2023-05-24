import { ChangeEvent, useState } from "react";
import { PlayerEnum, RollTypeEnum } from "../../utils/definitions";
import { trpcNext } from "../../utils/trpc";

export default function RollInput() {
  const [player, setPlayer] = useState<PlayerEnum>(PlayerEnum.aaron);
  const [rollType, setRollType] = useState<RollTypeEnum>(
    RollTypeEnum.skill_Acrobatics
  );
  const [total, setTotal] = useState<number>();
  const [damage, setDamage] = useState<number>();
  const [note, setNote] = useState<string>("");

  const { mutateAsync } = trpcNext.postRow.useMutation();

  const onPlayerChange = function (e: ChangeEvent<HTMLSelectElement>) {
    if (Object.values(PlayerEnum).includes(e.target.value as PlayerEnum))
      setPlayer(e.target.value as PlayerEnum);
  };

  const onRollTypeChange = function (e: ChangeEvent<HTMLSelectElement>) {
    if (Object.values(RollTypeEnum).includes(e.target.value as RollTypeEnum))
      setRollType(e.target.value as RollTypeEnum);
  };

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

  const onNoteChange = function (e: ChangeEvent<HTMLInputElement>) {
    setNote(e.target.value);
  };

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    mutateAsync({
      player: player,
      rollType: rollType,
      total: total,
      damage: damage,
      note: note,
    });
  }

  return (
    <EditableRow
      data={{
        _id: -1,
        player: player,
        rollType: rollType,
        total: total,
        damage: damage,
        note: note,
      }}
      onPlayerChange={onPlayerChange}
      onRollTypeChange={onRollTypeChange}
      onTotalChange={onTotalChange}
      onDamageChange={onDamageChange}
      onNoteChange={onNoteChange}
      handleSubmit={handleSubmit}
      key={"New row"}
    />
  );
}

interface IOtherProps {
  data: {
    _id: number;
    player: PlayerEnum;
    rollType: RollTypeEnum;
    total: number | undefined;
    damage: number | undefined;
    note: string;
  };
  onPlayerChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  onRollTypeChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  onTotalChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onDamageChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onNoteChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const EditableRow = function (props: IOtherProps) {
  return (
    <tr>
      <td>
        <form
          id={props.data._id + "form"}
          method="post"
          onSubmit={props.handleSubmit}
        >
          <select
            name="player"
            value={props.data.player}
            onChange={props.onPlayerChange}
          >
            <PlayerOptions />
          </select>
        </form>
      </td>
      <td>
        <select
          form={props.data._id + "form"}
          name="type"
          value={props.data.rollType}
          onChange={props.onRollTypeChange}
        >
          <SkillCheckOptions />
        </select>
      </td>
      <td>
        <input
          form={props.data._id + "form"}
          type="number"
          name="total"
          value={props.data.total ?? ""}
          onKeyDown={(event) => {
            if (!/[0-9]/.test(event.key)) {
              event.preventDefault();
            }
          }}
          onChange={props.onTotalChange}
        />
      </td>
      <td>
        <input
          form={props.data._id + "form"}
          type="number"
          name="damage"
          value={props.data.damage ?? ""}
          onKeyDown={(event) => {
            if (!/[0-9]/.test(event.key)) {
              event.preventDefault();
            }
          }}
          onChange={props.onDamageChange}
        />
      </td>
      <td>
        <input
          form={props.data._id + "form"}
          type="text"
          name="note"
          value={props.data.note}
          onChange={props.onNoteChange}
        />
      </td>
      <td>
        <input form={props.data._id + "form"} type="submit" value="Save" />
      </td>
    </tr>
  );
};

export const PlayerOptions = function () {
  return (
    <>
      <option value={PlayerEnum.aaron}>Aaron</option>
      <option value={PlayerEnum.connor}>Connor</option>
      <option value={PlayerEnum.tegg}>Tegg</option>
      <option value={PlayerEnum.thomas}>Thomas</option>
    </>
  );
};

export const SkillCheckOptions = function () {
  return (
    <>
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
        <option value={RollTypeEnum.skill_Intimidation}>Intimidation</option>
        <option value={RollTypeEnum.skill_Investigation}>Investigation</option>
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
        <option value={RollTypeEnum.savingThrow_Dexterity}>Dexterity</option>
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
        <option value={RollTypeEnum.ability_Constitution}>Constitution</option>
        <option value={RollTypeEnum.ability_Intelligence}>Intelligence</option>
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
    </>
  );
};
