import "tailwindcss/tailwind.css";
import type { AppProps } from "next/app";
import Layout from "../components/layout";
import FirebaseProvider from "../lib/authContext";
import "../lib/firebaseConfig/init";
import {defaultOpenfortConfig, OpenfortProvider} from "../lib/openfortContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
      <OpenfortProvider openfortConfig={defaultOpenfortConfig}>
        <FirebaseProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </FirebaseProvider>
      </OpenfortProvider>
  );
}
export default MyApp;
