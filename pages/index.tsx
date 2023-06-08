import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartData,
  ChartOptions,
  Colors,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { trpcNext } from "../utils/trpc";
import { PlayerEnum } from "../utils/definitions";
import { Rolls } from "../entities/rolls";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Colors
);

export default function IndexPage() {
  const maxSession = parseInt(process.env.NEXT_PUBLIC_SESSION_NUMBER || "1");
  const { data, error, isError, isLoading } = trpcNext.getRows.useQuery(0);
  const [session, setSession] = useState(0);
  const [rollData, setRollData] = useState({
    labels: Object.values(PlayerEnum),
    datasets: [
      {
        label: "Average D20 Rolls",
        data: formatData(data?.rows, session),
      },
    ],
  });

  useEffect(() => {
    setRollData({
      labels: Object.values(PlayerEnum),
      datasets: [
        {
          label: "Average D20 Rolls",
          data: formatData(data?.rows, session),
        },
      ],
    });
  }, [session, data]);

  const router = useRouter();
  const [route, setRoute] = useState("");
  const handleSubmit = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push("/" + route);
  };
  const goToCurrentSession = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push("/" + maxSession);
  };
  return (
    <div>
      <form onSubmit={handleSubmit} className="flex mt-2 gap-1">
        <label htmlFor="route" className="label">
          Go to session:
        </label>
        <input
          type="text"
          name="route"
          className="px-2"
          onChange={(e) => {
            setRoute(e.target.value);
          }}
        />
        <button type="submit" className="btn">
          Submit
        </button>
        <button type="button" className="btn" onClick={goToCurrentSession}>
          Go to Current Session ({maxSession})
        </button>
      </form>
      <h1 className="hero text-xl">
        {session !== 0 ? "Session " + session : "All sessions"}
      </h1>
      {!isLoading && !isError && <MyChart data={rollData} />}
      <select
        name="session"
        value={session}
        className="select select-info"
        onChange={(e) => {
          const value = !Number.isNaN(e.target.value)
            ? parseInt(e.target.value)
            : null;
          const cleared = e.target.value === "";
          if (value !== null) setSession(value);
        }}
      >
        <SessionOptions maxSession={maxSession} />
      </select>
    </div>
  );
}

interface ISessionProps {
  maxSession: number;
}

const SessionOptions = function (props: ISessionProps) {
  const sessionArray = Array.from(
    { length: props.maxSession },
    (_, i) => i + 1
  );
  return (
    <>
      <option key={"All"} value={0}>
        All Sessions
      </option>
      {sessionArray.map((session) => {
        return (
          <option key={session} value={session}>
            Session {session}
          </option>
        );
      })}
    </>
  );
};

const MyChart = function ({ data }: any) {
  return <Bar data={data} />;
};

const formatData = function (rows: Rolls[] | undefined, session: number) {
  let aaron = { rolls: 0, totalRoll: 0 },
    connor = { rolls: 0, totalRoll: 0 },
    tegg = { rolls: 0, totalRoll: 0 },
    thomas = { rolls: 0, totalRoll: 0 };
  if (rows === undefined) return {};
  const selectedRow = rows.filter((row) => {
    if (session == 0) return true;
    return row.session == session;
  });
  selectedRow.forEach((element) => {
    switch (element.player) {
      case PlayerEnum.aaron:
        if (element.naturalRoll !== undefined) aaron.rolls++;
        aaron.totalRoll += element.naturalRoll || 0;
        break;
      case PlayerEnum.connor:
        if (element.naturalRoll !== undefined) connor.rolls++;
        connor.totalRoll += element.naturalRoll || 0;
        break;
      case PlayerEnum.tegg:
        if (element.naturalRoll !== undefined) tegg.rolls++;
        tegg.totalRoll += element.naturalRoll || 0;
        break;
      case PlayerEnum.thomas:
        if (element.naturalRoll !== undefined) thomas.rolls++;
        thomas.totalRoll += element.naturalRoll || 0;
        break;
    }
  });
  if (aaron.rolls === 0) aaron.rolls = 1;
  if (connor.rolls === 0) connor.rolls = 1;
  if (tegg.rolls === 0) tegg.rolls = 1;
  if (thomas.rolls === 0) thomas.rolls = 1;
  return {
    aaron: aaron.totalRoll / aaron.rolls,
    connor: connor.totalRoll / connor.rolls,
    tegg: tegg.totalRoll / tegg.rolls,
    thomas: thomas.totalRoll / thomas.rolls,
  };
};
