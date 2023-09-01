import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BarController,
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
  ScatterController,
  Title,
  Tooltip,
} from "chart.js";
import { Bar, Chart } from "react-chartjs-2";
import { trpcNext } from "../utils/trpc";
import { PlayerEnum, RollTypeEnum } from "../utils/definitions";
import { Rolls } from "../entities/rolls";
import { ISkillCheckProps } from "../components/rolls/rollInput";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  BarController,
  ScatterController,
  Title,
  Tooltip,
  Legend,
  Colors
);

export default function IndexPage() {
  const maxSession = parseInt(process.env.NEXT_PUBLIC_SESSION_NUMBER || "1");
  const { data, error, isError, isLoading } = trpcNext.getRows.useQuery(0);
  const [session, setSession] = useState(0);
  const [d20RollData, setD20RollData] = useState(() => {
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
  const [attackRollData, setAttackRollData] = useState(() => {
    const attackRolls = getAttackRollValues(data?.rows, session);
    const healing = getHealing(data?.rows, session);
    return {
      labels: Object.values(PlayerEnum),
      datasets: [
        {
          type: "bar" as const,
          label: "Total Damage",
          data: attackRolls.totalDamage,
          order: 2,
        },
        {
          type: "scatter" as const,
          label: "Average Damage Rolls",
          data: attackRolls.averageDamage,
          pointRadius: 7,
          pointHoverRadius: 10,
          borderWidth: 2,
          order: 1,
        },
        {
          type: "scatter" as const,
          label: "D20 Attack Hit Percentage",
          data: attackRolls.hitPercentage,
          pointRadius: 7,
          pointHoverRadius: 10,
          borderWidth: 2,
          order: 1,
        },
        {
          type: "bar" as const,
          label: "Total Healing",
          data: healing,
          order: 2,
        },
      ],
    };
  });

  useEffect(() => {
    const d20Rolls = getD20RollValues(data?.rows, session);
    const attackRolls = getAttackRollValues(data?.rows, session);
    const healing = getHealing(data?.rows, session);
    setD20RollData({
      labels: Object.values(PlayerEnum),
      datasets: [
        {
          type: "bar" as const,
          label: "Average D20 Rolls",
          data: d20Rolls.average,
          order: 2,
        },
        {
          type: "scatter" as const,
          label: "Minimum D20 Roll",
          data: d20Rolls.minimum,
          pointRadius: 7,
          pointHoverRadius: 10,
          borderWidth: 2,
          order: 1,
        },
        {
          type: "scatter" as const,
          label: "Maximum D20 Roll",
          data: d20Rolls.maximum,
          pointRadius: 7,
          pointHoverRadius: 10,
          borderWidth: 2,
          order: 1,
        },
      ],
    });
    setAttackRollData({
      labels: Object.values(PlayerEnum),
      datasets: [
        {
          type: "bar" as const,
          label: "Total Damage",
          data: attackRolls.totalDamage,
          order: 2,
        },
        {
          type: "scatter" as const,
          label: "Average Damage Rolls",
          data: attackRolls.averageDamage,
          pointRadius: 7,
          pointHoverRadius: 10,
          borderWidth: 2,
          order: 1,
        },
        {
          type: "scatter" as const,
          label: "D20 Attack Hit Percentage",
          data: attackRolls.hitPercentage,
          pointRadius: 7,
          pointHoverRadius: 10,
          borderWidth: 2,
          order: 1,
        },
        {
          type: "bar" as const,
          label: "Total Healing",
          data: healing,
          order: 2,
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
      </h1>
      {!isLoading && !isError && (
        <MyChart data={d20RollData} title={"D20 Rolls"} />
      )}
      {!isLoading && !isError && (
        <MyChart data={attackRollData} title={"Attack Rolls"} />
      )}
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

const MyChart = function ({ data, title }: any) {
  return (
    <Chart
      type="bar"
      data={data}
      options={{
        plugins: {
          title: {
            display: true,
            text: title,
            padding: {
              top: 20,
              bottom: 10,
            },
          },
        },
      }}
    />
  );
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

const getAttackRollValues = function (
  rows: Rolls[] | undefined,
  session: number
) {
  const playerList: Array<{
    rolls: number;
    totalDamage: number;
    hits: number;
    misses: number;
  }> = [
    {
      rolls: 0,
      totalDamage: 0,
      hits: 0,
      misses: 0,
    },
    {
      rolls: 0,
      totalDamage: 0,
      hits: 0,
      misses: 0,
    },
    {
      rolls: 0,
      totalDamage: 0,
      hits: 0,
      misses: 0,
    },
    {
      rolls: 0,
      totalDamage: 0,
      hits: 0,
      misses: 0,
    },
  ];
  if (rows === undefined) return {};
  const selectedRow = rows.filter((row) => {
    if (session == 0) return true;
    return row.session == session;
  });
  selectedRow.forEach((element) => {
    if (
      !(
        element.rollType === RollTypeEnum.attack_Melee ||
        element.rollType === RollTypeEnum.attack_Ranged ||
        element.rollType === RollTypeEnum.attack_Spell ||
        element.rollType === RollTypeEnum.other_Damage ||
        element.rollType === RollTypeEnum.other_HaloOfSpores ||
        (element.rollType === RollTypeEnum.other_Custom &&
          element.damage !== undefined)
      )
    ) {
      return;
    }
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
    if (element.damage !== undefined) {
      playerList[playerNumber].totalDamage += element.damage;
    }
    if (element.naturalRoll !== undefined) {
      playerList[playerNumber].rolls++;
      if (element.hit) {
        playerList[playerNumber].hits++;
      } else {
        playerList[playerNumber].misses++;
      }
    }
  });
  // checks to avoid divide by 0 errors
  const averageDamage = [0, 0, 0, 0];
  if (playerList[0].hits !== 0)
    averageDamage[0] = playerList[0].totalDamage / playerList[0].hits;
  if (playerList[1].hits !== 0)
    averageDamage[1] = playerList[1].totalDamage / playerList[1].hits;
  if (playerList[2].hits !== 0)
    averageDamage[2] = playerList[2].totalDamage / playerList[2].hits;
  if (playerList[3].hits !== 0)
    averageDamage[3] = playerList[3].totalDamage / playerList[3].hits;

  const hitPercentage = [0, 0, 0, 0];
  if (playerList[0].rolls !== 0) {
    hitPercentage[0] =
      playerList[0].hits / (playerList[0].hits + playerList[0].misses);
  }
  if (playerList[1].rolls !== 0) {
    hitPercentage[1] =
      playerList[1].hits / (playerList[1].hits + playerList[1].misses);
  }
  if (playerList[2].rolls !== 0) {
    hitPercentage[2] =
      playerList[2].hits / (playerList[2].hits + playerList[2].misses);
  }
  if (playerList[3].rolls !== 0) {
    hitPercentage[3] =
      playerList[3].hits / (playerList[3].hits + playerList[3].misses);
  }

  return {
    averageDamage: {
      aaron: averageDamage[0],
      connor: averageDamage[1],
      tegg: averageDamage[2],
      thomas: averageDamage[3],
    },
    hitPercentage: {
      aaron: hitPercentage[0] * 100,
      connor: hitPercentage[1] * 100,
      tegg: hitPercentage[2] * 100,
      thomas: hitPercentage[3] * 100,
    },
    totalDamage: {
      aaron: playerList[0].totalDamage,
      connor: playerList[1].totalDamage,
      tegg: playerList[2].totalDamage,
      thomas: playerList[3].totalDamage,
    },
  };
};

const getHealing = function (rows: Rolls[] | undefined, session: number) {
  if (rows === undefined) return;
  const selectedRow = rows.filter((row) => {
    if (session == 0) return true;
    return row.session == session;
  });

  const playerList: Array<number> = [0, 0, 0, 0];

  selectedRow.forEach((element) => {
    if (
      element.rollType === RollTypeEnum.healing &&
      element.damage !== undefined
    ) {
      switch (element.player) {
        case PlayerEnum.aaron:
          playerList[0] += element.damage;
          break;
        case PlayerEnum.connor:
          playerList[1] += element.damage;
          break;
        case PlayerEnum.tegg:
          playerList[2] += element.damage;
          break;
        case PlayerEnum.thomas:
          playerList[3] += element.damage;
          break;
      }
    }
  });
  return {
    aaron: playerList[0],
    connor: playerList[1],
    tegg: playerList[2],
    thomas: playerList[3],
  };
};
