import { trpcNext } from "../utils/trpc";
export default function IndexPage() {
  const { data, error, isError, isLoading } = trpcNext.getRows.useQuery();
  const { mutateAsync } = trpcNext.postRow.useMutation();
  if (isLoading) {
    return <div>Loading...</div>;
  } else if (isError) {
    return <div>Error...</div>;
  }

  function handleSubmit(e) {
    // Prevent the browser from reloading the page
    // e.preventDefault();

    // Read the form data
    const form = e.target;
    const formData = new FormData(form);

    // work with it as a plain object:
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
    mutateAsync({
      player: formJson.player,
      type: formJson.type,
      ...(formJson.total !== "" && { total: formJson.total }),
      ...(formJson.damage !== "" && { damage: formJson.damage }),
      note: formJson.note,
    });
  }

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Roll type</th>
            <th>Total</th>
            <th>Damage</th>
            <th>Note</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <form id="form1" method="post" onSubmit={handleSubmit}>
                <select name="player">
                  <option value="aaron">Aaron</option>
                  <option value="connor">Connor</option>
                  <option value="tegg">Tegg</option>
                  <option value="thomas">Thomas</option>
                </select>
              </form>
            </td>
            <td>
              <select form="form1" name="type">
                <optgroup label="Skill Checks">
                  <option value="skill_Acrobatics">Acrobatics</option>
                  <option value="skill_Animal Handling">Animal Handling</option>
                  <option value="skill_Arcana">Arcana</option>
                  <option value="skill_Athletics">Athletics</option>
                  <option value="skill_Deception">Deception</option>
                  <option value="skill_History">History</option>
                  <option value="skill_Insight">Insight</option>
                  <option value="skill_Intimidation">Intimidation</option>
                  <option value="skill_Investigation">Investigation</option>
                  <option value="skill_Medicine">Medicine</option>
                  <option value="skill_Nature">Nature</option>
                  <option value="skill_Perception">Perception</option>
                  <option value="skill_Performance">Performance</option>
                  <option value="skill_Persuasion">Persuasion</option>
                  <option value="skill_Religion">Religion</option>
                  <option value="skill_Sleight of Hand">Sleight of Hand</option>
                  <option value="skill_Stealth">Stealth</option>
                  <option value="skill_Survival">Survival</option>
                  <option value="skill_Tool">Tool</option>
                </optgroup>
                <optgroup label="Saving Throw">
                  <option value="savingThrow_Strength">Strength</option>
                  <option value="savingThrow_Dexterity">Dexterity</option>
                  <option value="savingThrow_Constitution">Constitution</option>
                  <option value="savingThrow_Intelligence">Intelligence</option>
                  <option value="savingThrow_Wisdom">Wisdom</option>
                  <option value="savingThrow_Charisma">Charisma</option>
                  <option value="savingThrow_Death">Death</option>
                </optgroup>
                <optgroup label="Ability Checks">
                  <option value="ability_Strength">Strength</option>
                  <option value="ability_Dexterity">Dexterity</option>
                  <option value="ability_Constitution">Constitution</option>
                  <option value="ability_Intelligence">Intelligence</option>
                  <option value="ability_Wisdom">Wisdom</option>
                  <option value="ability_Charisma">Charisma</option>
                </optgroup>
                <optgroup label="Attacks">
                  <option value="attack_Melee">Melee</option>
                  <option value="attack_Ranged">Ranged</option>
                  <option value="attack_Spell">Spell</option>
                </optgroup>
                <optgroup label="Other">
                  <option value="other_Damage">Damage</option>
                  <option value="other_Initiative">Initiative</option>
                  <option value="other_Second Wind">Second Wind</option>
                  <option value="other_Custom">Custom</option>
                </optgroup>
              </select>
            </td>
            <td>
              <input form="form1" type="number" name="total" value="" />
            </td>
            <td>
              <input form="form1" type="number" name="damage" value="" />
            </td>
            <td>
              <input form="form1" type="text" name="note" value="" />
            </td>
            <td>
              <input form="form1" type="submit" value="Save" />
            </td>
          </tr>
          {data.rows.map((roll) => {
            return (
              <tr key={roll._id}>
                <td>{roll.player}</td>
                <td>{roll.rollType}</td>
                <td>{roll.total}</td>
                <td>{roll.damage}</td>
                <td>{roll.note}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
