import { Rolls } from "../entities/rolls";
import { trpcNext } from "../utils/trpc";
import RollInput from "./rolls/rollInput";
import RollRow from "./rolls/rollRow";

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
          {data.rows.map((roll: Rolls) => {
            return <RollRow roll={roll} key={roll._id} />;
          })}
        </tbody>
      </table>
    </div>
  );
}
