import { ChangeEvent, useState } from "react";
import { Rolls } from "../../entities/rolls";
import {
  AdvantageEnum,
  PlayerEnum,
  RollTypeEnum,
} from "../../utils/definitions";
import { trpcNext } from "../../utils/trpc";
import { EditableRow } from "./rollInput";

interface IProps {
  roll: Rolls;
  session: number;
}
export default function RollRow(props: IProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [player, setPlayer] = useState<PlayerEnum>(props.roll.player);
  const [rollType, setRollType] = useState<RollTypeEnum>(props.roll.rollType);
  const [advantageStatus, setAdvantageStatus] = useState<AdvantageEnum>(
    props.roll.advantageStatus
  );
  const [naturalRoll, setNaturalRoll] = useState<number | undefined>(
    props.roll.naturalRoll
  );
  const [naturalRollAdvantage, setNaturalRollAdvantage] = useState<
    number | undefined
  >(props.roll.naturalRoll);
  const [finalRoll, setFinalRoll] = useState<number | undefined>(
    props.roll.finalRoll
  );
  const [hit, setHit] = useState<boolean | undefined>(props.roll.hit);
  const [damage, setDamage] = useState<number | undefined>(props.roll.damage);
  const [note, setNote] = useState<string>(props.roll.note);

  const { mutateAsync } = trpcNext.updateRow.useMutation();

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

  const onHitChange = function (e: ChangeEvent<HTMLInputElement>) {
    setHit(!hit);
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

  function flipEdit() {
    setIsEditing(!isEditing);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    mutateAsync({
      _id: props.roll._id,
      player: player,
      rollType: rollType,
      advantageStatus: advantageStatus,
      naturalRoll: naturalRoll,
      naturalRollAdvantage: naturalRollAdvantage,
      hit: hit,
      damage: damage,
      note: note,
    });
    flipEdit();
  }

  return !isEditing ? (
    <RollDisplay
      roll={{
        _id: props.roll._id,
        player: player,
        rollType: rollType,
        advantageStatus: advantageStatus,
        naturalRoll: naturalRoll,
        naturalRollAdvantage: naturalRollAdvantage,
        finalRoll: finalRoll,
        hit: hit,
        damage: damage,
        note: note,
        session: props.session,
      }}
      editing={flipEdit}
    />
  ) : (
    <EditableRow
      data={{
        _id: props.roll._id,
        player: player,
        rollType: rollType,
        advantageStatus: advantageStatus,
        naturalRoll: naturalRoll,
        naturalRollAdvantage: naturalRollAdvantage,
        finalRoll: finalRoll,
        hit: hit,
        damage: damage,
        note: note,
      }}
      onPlayerChange={onPlayerChange}
      onRollTypeChange={onRollTypeChange}
      onAdvantageStatusChange={onAdvantageStatusChange}
      onNaturalRollChange={onNaturalRollChange}
      onNaturalRollAdvantageChange={onNaturalRollAdvantageChange}
      onFinalRollChange={onFinalRollChange}
      onHitChange={onHitChange}
      onDamageChange={onDamageChange}
      onNoteChange={onNoteChange}
      handleSubmit={handleSubmit}
      key={props.roll._id + " Editable row"}
    />
  );
}

interface IBothProps {
  roll: Rolls;
  editing: () => void;
}

function RollDisplay(props: IBothProps) {
  const { mutateAsync } = trpcNext.deleteRow.useMutation();

  function handleSubmit() {
    const confirmBox = window.confirm(
      "Do you really want to delete this Roll?"
    );
    if (confirmBox === true) {
      mutateAsync({
        _id: props.roll._id,
      });
    }
  }

  return (
    <tr key={props.roll._id + " Display row"}>
      <td>{props.roll.player}</td>
      <td>{props.roll.rollType}</td>
      <td>{props.roll.advantageStatus}</td>
      <td>{props.roll.naturalRoll}</td>
      <td>{props.roll.naturalRollAdvantage}</td>
      <td>{props.roll.finalRoll}</td>
      <td>{props.roll.hit}</td>
      <td>{props.roll.damage}</td>
      <td>{props.roll.note}</td>
      <td>
        <button type="button" onClick={props.editing}>
          Edit
        </button>
      </td>
      <td>
        <form>
          <input type="submit" onClick={handleSubmit} value="Delete" />
        </form>
      </td>
    </tr>
  );
}
