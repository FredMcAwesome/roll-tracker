import type { AppType } from "next/app";
import { trpcNext } from "../utils/trpc";
const MyApp: AppType = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};
export default trpcNext.withTRPC(MyApp);
