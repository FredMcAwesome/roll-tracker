import { ChangeEvent, useState } from "react";
import { AdvantageEnum, PlayerEnum, RollTypeEnum } from "../definitions";
import { trpcNext } from "../trpc";

interface IProps {
  session: number;
}

export default function RollInput({ session }: IProps) {
  const [player, setPlayer] = useState<PlayerEnum>(PlayerEnum.aaron);
  const [rollType, setRollType] = useState<RollTypeEnum>(
    RollTypeEnum.skill_Acrobatics
  );
  const [advantageStatus, setAdvantageStatus] = useState<AdvantageEnum>(
    AdvantageEnum.normal
  );
  const [naturalRoll, setNaturalRoll] = useState<number | undefined>();
  const [naturalRollAdvantage, setNaturalRollAdvantage] = useState<
    number | undefined
  >();
  const [finalRoll, setFinalRoll] = useState<number | undefined>();
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

  const onAdvantageStatusChange = function (e: ChangeEvent<HTMLSelectElement>) {
    if (Object.values(AdvantageEnum).includes(e.target.value as AdvantageEnum))
      setAdvantageStatus(e.target.value as AdvantageEnum);
  };

  const onNaturalRollChange = function (e: ChangeEvent<HTMLInputElement>) {
    let value = !Number.isNaN(e.target.valueAsNumber)
      ? e.target.valueAsNumber
      : null;
    const cleared = e.target.value === "";
    if (value) {
      if (value > 20) value = 20;
      else if (value < 1) value = 1;
      setNaturalRoll(value);
    }
    if (cleared) setNaturalRoll(undefined);
  };

  const onNaturalRollAdvantageChange = function (
    e: ChangeEvent<HTMLInputElement>
  ) {
    let value = !Number.isNaN(e.target.valueAsNumber)
      ? e.target.valueAsNumber
      : null;
    const cleared = e.target.value === "";
    if (value) {
      if (value > 20) value = 20;
      else if (value < 1) value = 1;
      setNaturalRollAdvantage(value);
    }
    if (cleared) setNaturalRollAdvantage(undefined);
  };

  const onFinalRollChange = function (e: ChangeEvent<HTMLInputElement>) {
    const value = !Number.isNaN(e.target.valueAsNumber)
      ? e.target.valueAsNumber
      : null;
    const cleared = e.target.value === "";
    if (value) setFinalRoll(value);
    if (cleared) setFinalRoll(undefined);
  };

  const onDamageChange = function (e: ChangeEvent<HTMLInputElement>) {
    const value = !Number.isNaN(e.target.valueAsNumber)
      ? e.target.valueAsNumber
      : null;
    const cleared = e.target.value === "";
    if (value) setDamage(value);
    if (cleared) setDamage(undefined);
  };

  const onNoteChange = function (e: ChangeEvent<HTMLInputElement>) {
    setNote(e.target.value);
  };

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    mutateAsync({
      player: player,
      rollType: rollType,
      advantageStatus: advantageStatus,
      naturalRoll: naturalRoll,
      naturalRollAdvantage: naturalRollAdvantage,
      finalRoll: finalRoll,
      damage: damage,
      note: note,
      session: session,
    });
  }

  return (
    <EditableRow
      data={{
        _id: -1,
        player: player,
        rollType: rollType,
        advantageStatus: advantageStatus,
        naturalRoll: naturalRoll,
        naturalRollAdvantage: naturalRollAdvantage,
        finalRoll: finalRoll,
        damage: damage,
        note: note,
      }}
      onPlayerChange={onPlayerChange}
      onRollTypeChange={onRollTypeChange}
      onAdvantageStatusChange={onAdvantageStatusChange}
      onNaturalRollChange={onNaturalRollChange}
      onNaturalRollAdvantageChange={onNaturalRollAdvantageChange}
      onFinalRollChange={onFinalRollChange}
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
    advantageStatus: AdvantageEnum;
    naturalRoll: number | undefined;
    naturalRollAdvantage: number | undefined;
    finalRoll: number | undefined;
    damage: number | undefined;
    note: string;
  };
  onPlayerChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  onRollTypeChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  onAdvantageStatusChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  onNaturalRollChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onNaturalRollAdvantageChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onFinalRollChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onDamageChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onNoteChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const EditableRow = function (props: IOtherProps) {
  const damageDisabled = function () {
    switch (props.data.rollType) {
      case RollTypeEnum.attack_Melee:
      case RollTypeEnum.attack_Ranged:
      case RollTypeEnum.attack_Spell:
      case RollTypeEnum.other_Damage:
        return false;
      default:
        return true;
    }
  };
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
        <select
          form={props.data._id + "form"}
          name="type"
          value={props.data.advantageStatus}
          onChange={props.onAdvantageStatusChange}
        >
          <AdvantageOptions />
        </select>
      </td>
      <td>
        <input
          form={props.data._id + "form"}
          type="number"
          name="naturalRoll"
          value={props.data.naturalRoll ?? ""}
          onKeyDown={(event) => {
            if (!numberOnlyRegEx.test(event.key)) {
              event.preventDefault();
            }
          }}
          onChange={props.onNaturalRollChange}
        />
      </td>
      <td>
        <input
          form={props.data._id + "form"}
          type="number"
          name="naturalRollAdvantage"
          disabled={props.data.advantageStatus === AdvantageEnum.normal}
          value={props.data.naturalRollAdvantage ?? ""}
          onKeyDown={(event) => {
            if (!numberOnlyRegEx.test(event.key)) {
              event.preventDefault();
            }
          }}
          onChange={props.onNaturalRollAdvantageChange}
        />
      </td>
      <td>
        <input
          form={props.data._id + "form"}
          type="number"
          name="finalRoll"
          value={props.data.finalRoll ?? ""}
          onKeyDown={(event) => {
            if (!numberOnlyRegEx.test(event.key)) {
              event.preventDefault();
            }
          }}
          onChange={props.onFinalRollChange}
        />
      </td>
      <td>
        <input
          form={props.data._id + "form"}
          type="number"
          name="damage"
          disabled={damageDisabled()}
          value={props.data.damage ?? ""}
          onKeyDown={(event) => {
            if (!numberOnlyRegEx.test(event.key)) {
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

const numberOnlyRegEx = new RegExp(
  /[0-9]|(Backspace)|(Delete)|(Clear)|(Cut)|(Undo)|(Redo)/
);

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

export const AdvantageOptions = function () {
  return (
    <>
      <option value={AdvantageEnum.advantage}>Advantage</option>
      <option value={AdvantageEnum.normal}>Normal</option>
      <option value={AdvantageEnum.disadvantage}>Disadvantage</option>
    </>
  );
};
