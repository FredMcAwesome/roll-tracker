import { trpcNext } from "../utils/trpc";
import RollInput from "./rollInput";

export default function IndexPage() {
  const { data, error, isError, isLoading } = trpcNext.getRows.useQuery();
  if (isLoading) {
    return <div>Loading...</div>;
  } else if (isError) {
    return <div>Error...</div>;
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
          <RollInput />
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
