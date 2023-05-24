import { ChangeEvent, useState } from "react";
import { Rolls } from "../../entities/rolls";
import { PlayerEnum, RollTypeEnum } from "../../utils/definitions";
import { trpcNext } from "../../utils/trpc";
import { EditableRow } from "./rollInput";

interface IProps {
  roll: Rolls;
}
export default function RollRow(props: IProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [player, setPlayer] = useState<PlayerEnum>(props.roll.player);
  const [rollType, setRollType] = useState<RollTypeEnum>(props.roll.rollType);
  const [total, setTotal] = useState<number | undefined>(props.roll.total);
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

  function flipEdit() {
    setIsEditing(!isEditing);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    mutateAsync({
      _id: props.roll._id,
      player: player,
      rollType: rollType,
      total: total,
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
        total: total,
        damage: damage,
        note: note,
      }}
      editing={flipEdit}
    />
  ) : (
    <EditableRow
      data={{
        _id: props.roll._id,
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
      <td>{props.roll.total}</td>
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
