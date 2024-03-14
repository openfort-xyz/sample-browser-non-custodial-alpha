import "tailwindcss/tailwind.css";
import type { AppProps } from "next/app";
import Layout from "../components/layout";
import FirebaseProvider from "../lib/authContext";
import "../lib/firebaseConfig/init";
import "./login.css";
import SessionContextProvider from "../lib/session";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionContextProvider>
      <FirebaseProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </FirebaseProvider>
    </SessionContextProvider>
  );
}
export default MyApp;
