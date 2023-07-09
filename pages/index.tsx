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
import { Bar, Chart } from "react-chartjs-2";
import { trpcNext } from "../utils/trpc";
import { PlayerEnum } from "../utils/definitions";
import { Rolls } from "../entities/rolls";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Colors
);

export default function IndexPage() {
  const maxSession = parseInt(process.env.NEXT_PUBLIC_SESSION_NUMBER || "1");
  const { data, error, isError, isLoading } = trpcNext.getRows.useQuery(0);
  const [session, setSession] = useState(0);
  const [rollData, setRollData] = useState(() => {
    const rolls = getD20RollValues(data?.rows, session);
    return {
      labels: Object.values(PlayerEnum),
      datasets: [
        {
          type: "bar" as const,
          label: "Average D20 Rolls",
          data: rolls.average,
          order: 2,
        },
        {
          type: "scatter" as const,
          label: "Minimum D20 Roll",
          data: rolls.minimum,
          pointRadius: 7,
          pointHoverRadius: 10,
          borderWidth: 2,
          order: 1,
        },
        {
          type: "scatter" as const,
          label: "Maximum D20 Roll",
          data: rolls.maximum,
          pointRadius: 7,
          pointHoverRadius: 10,
          borderWidth: 2,
          order: 1,
        },
      ],
    };
  });

  useEffect(() => {
    const rolls = getD20RollValues(data?.rows, session);
    setRollData({
      labels: Object.values(PlayerEnum),
      datasets: [
        {
          type: "bar" as const,
          label: "Average D20 Rolls",
          data: rolls.average,
          order: 2,
        },
        {
          type: "scatter" as const,
          label: "Minimum D20 Roll",
          data: rolls.minimum,
          pointRadius: 7,
          pointHoverRadius: 10,
          borderWidth: 2,
          order: 1,
        },
        {
          type: "scatter" as const,
          label: "Maximum D20 Roll",
          data: rolls.maximum,
          pointRadius: 7,
          pointHoverRadius: 10,
          borderWidth: 2,
          order: 1,
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
  return <Chart type="bar" data={data} />;
};

const getD20RollValues = function (rows: Rolls[] | undefined, session: number) {
  const playerList: Array<{
    rolls: number;
    totalRoll: number;
    minimumRoll: number | undefined;
    maximumRoll: number | undefined;
  }> = [
    {
      rolls: 0,
      totalRoll: 0,
      minimumRoll: undefined,
      maximumRoll: undefined,
    },
    {
      rolls: 0,
      totalRoll: 0,
      minimumRoll: undefined,
      maximumRoll: undefined,
    },
    {
      rolls: 0,
      totalRoll: 0,
      minimumRoll: undefined,
      maximumRoll: undefined,
    },
    {
      rolls: 0,
      totalRoll: 0,
      minimumRoll: undefined,
      maximumRoll: undefined,
    },
  ];
  if (rows === undefined) return {};
  const selectedRow = rows.filter((row) => {
    if (session == 0) return true;
    return row.session == session;
  });
  selectedRow.forEach((element) => {
    let playerNumber = 0;
    switch (element.player) {
      case PlayerEnum.aaron:
        playerNumber = 0;
        break;
      case PlayerEnum.connor:
        playerNumber = 1;
        break;
      case PlayerEnum.tegg:
        playerNumber = 2;
        break;
      case PlayerEnum.thomas:
        playerNumber = 3;
        break;
    }
    if (element.naturalRoll !== undefined) {
      playerList[playerNumber].rolls++;

      playerList[playerNumber].totalRoll += element.naturalRoll;
      const min = playerList[playerNumber].minimumRoll;
      if (min === undefined || min > element.naturalRoll) {
        playerList[playerNumber].minimumRoll = element.naturalRoll;
      }
      const max = playerList[playerNumber].maximumRoll;
      if (max === undefined || max < element.naturalRoll) {
        playerList[playerNumber].maximumRoll = element.naturalRoll;
      }
    }
  });
  if (playerList[0].rolls === 0) playerList[0].rolls = 1;
  if (playerList[1].rolls === 0) playerList[1].rolls = 1;
  if (playerList[2].rolls === 0) playerList[2].rolls = 1;
  if (playerList[3].rolls === 0) playerList[3].rolls = 1;

  return {
    average: {
      aaron: playerList[0].totalRoll / playerList[0].rolls,
      connor: playerList[1].totalRoll / playerList[1].rolls,
      tegg: playerList[2].totalRoll / playerList[2].rolls,
      thomas: playerList[3].totalRoll / playerList[3].rolls,
    },
    minimum: {
      aaron: playerList[0].minimumRoll,
      connor: playerList[1].minimumRoll,
      tegg: playerList[2].minimumRoll,
      thomas: playerList[3].minimumRoll,
    },
    maximum: {
      aaron: playerList[0].maximumRoll,
      connor: playerList[1].maximumRoll,
      tegg: playerList[2].maximumRoll,
      thomas: playerList[3].maximumRoll,
    },
  };
};
