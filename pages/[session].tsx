import { Rolls } from "../entities/rolls";
import { trpcNext } from "../utils/trpc";
import RollInput from "../components/rolls/rollInput";
import RollRow from "../components/rolls/rollRow";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { PlayerEnum, zodPlayerEnum } from "../utils/definitions";
import { useEffect, useState } from "react";

interface ISession {
  sessionIn: string | undefined;
}

export const getServerSideProps: GetServerSideProps<ISession> = async function (
  context
) {
  let page = context?.query?.session;
  if (Array.isArray(page)) page = page[0];

  return { props: { sessionIn: page } };
};

export default function Page({ sessionIn }: ISession) {
  const [rain, setRain] = useState<PlayerEnum | "None">();
  const { mutateAsync } = trpcNext.setIsThatRain.useMutation();
  const router = useRouter();
  const goToStats = () => {
    router.push("/");
  };
  const goToCurrentSession = () => {
    router.push("/" + maxSession);
  };

  const maxSession = parseInt(process.env.NEXT_PUBLIC_SESSION_NUMBER || "1");
  let session = parseInt(sessionIn || "");
  if (session === undefined) session = maxSession;
  // console.log(`maxSession = ${maxSession}`);
  // console.log(`sessionIn = ${sessionIn}`);
  // console.log(`session = ${session}`);
  const { data, error, isError, isLoading } =
    trpcNext.getRows.useQuery(session);
  const rainResult = trpcNext.getIsThatRain.useQuery(session);

  useEffect(() => {
    if (rainResult.data !== undefined) setRain(rainResult.data);
  }, [rainResult.data]);

  if (isLoading) {
    return <div>Loading...</div>;
  } else if (isError) {
    return <div>Error...</div>;
  }

  function handleSubmit(e: React.ChangeEvent<HTMLSelectElement>) {
    const player = zodPlayerEnum.safeParse(e.target.value);

    if (player.success) {
      setRain(player.data);
      mutateAsync({
        session: session,
        player: player.data,
      });
    }
  }

  return (
    <div>
      <div className="navbar">
        <button type="submit" onClick={goToStats} className="btn m-2">
          Go to Stat overview
        </button>
        <button type="submit" onClick={goToCurrentSession} className="btn m-2">
          Go to current session (Session {maxSession})
        </button>
        <label className="label navbar-end">
          Is that Rain?
          <select
            name="player"
            className="select select-primary ml-2"
            value={rain}
            onChange={handleSubmit}
          >
            <IsThatRainOptions />
          </select>
        </label>
      </div>
      <h1 className="hero text-xl">Session {session}</h1>
      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Roll type</th>
            <th>Advantage?</th>
            <th>Nat Roll</th>
            <th>Adv Roll</th>
            <th>Final Roll</th>
            <th>Hit?</th>
            <th>Damage</th>
            <th>Note</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <RollInput session={session} />
          {data.rows.map((roll: Rolls) => {
            return <RollRow roll={roll} key={roll._id} session={session} />;
          })}
        </tbody>
      </table>
    </div>
  );
}

export const IsThatRainOptions = function () {
  return (
    <>
      <option value={"None"}>No one</option>
      <option value={PlayerEnum.aaron}>Aaron</option>
      <option value={PlayerEnum.connor}>Connor</option>
      <option value={PlayerEnum.tegg}>Tegg</option>
      <option value={PlayerEnum.thomas}>Thomas</option>
    </>
  );
};
