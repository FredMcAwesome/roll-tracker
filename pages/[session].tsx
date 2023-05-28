import { Rolls } from "../entities/rolls";
import { trpcNext } from "../utils/trpc";
import RollInput from "./rolls/rollInput";
import RollRow from "./rolls/rollRow";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { useState } from "react";

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

  if (isLoading) {
    return <div>Loading...</div>;
  } else if (isError) {
    return <div>Error...</div>;
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
