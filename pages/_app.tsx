import type { AppType } from "next/app";
import { trpcNext } from "../utils/trpc";
import "../styles/globals.css";
const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div>
      <Component {...pageProps} />
    </div>
  );
};
export default trpcNext.withTRPC(MyApp);
