import type { NextPage } from "next";
import Head from "next/head";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useState } from "react";
import { signOut, useAuth } from "../lib/authContext";
import Link from "next/link";
import { requestPin } from "../lib/create-pin";
import Openfort, {MissingRecoveryMethod, OAuthProvider, PasswordRecovery} from "@openfort/openfort-js";

const Home: NextPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { user, loading } = useAuth();
  const openfort = new Openfort(process.env.NEXT_PUBLIC_OPENFORT_PUBLIC_KEY);

  if (loading) return null;

  if (user)
    return (
      <div className="flex space-x-2">
        <h1>{"You already logged. Head to "}</h1>
        <Link href="/private" className="underline text-blue-600">
          /Private
        </Link>
      </div>
    );

  const auth = getAuth();
  function login() {
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed in

        const user = userCredential.user;
        const idToken = await userCredential.user.getIdToken();
        const token = await openfort.authenticateOAuth("firebase", idToken);

        setOpenfortConfigConfig(80001).catch((error) => {
            console.log("error", error);
            window.alert(error);
            signOut()
        });

        console.log("success", user);
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log("error", errorMessage);
        window.alert(errorMessage);
        signOut();
      });
  }

  async function setOpenfortConfigConfig(chainId: number) {
    try {
        await openfort.configureEmbeddedSigner();
    } catch (error) {
        if (error instanceof MissingRecoveryMethod) {
            const password = requestPin();

            const passwordRecovery = new PasswordRecovery(password);
            await openfort.configureEmbeddedSignerRecovery(passwordRecovery, chainId);
        }
    }
  }

  function loginWithGoogle() {
    const googleProvider = new GoogleAuthProvider();

    signInWithPopup(auth, googleProvider)
      .then(async (result) => {
        const idToken = await result.user.getIdToken();
        await openfort.authenticateOAuth(OAuthProvider.Firebase, idToken);

        setOpenfortConfigConfig(80001).catch((error) => {
            window.alert(error);
            signOut()
        });

        const user = result.user;
        console.log("sign with google", user);
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log("error", errorMessage);
        window.alert(errorMessage);
        signOut();
      });
  }

  return (
    <>
      <Head>
        <title>Signin</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="m-auto my-24 w-1/3 h-1/3 divide-y-4 space-y-1">
        <div className="space-y-1">
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            className="border border-current	"
          />
          <br />
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            className="border border-current	"
          />
          <br />
          <button onClick={() => login()}>Login</button>
        </div>
        <div>
          <button onClick={() => loginWithGoogle()}>Login with Google</button>
        </div>
      </div>
    </>
  );
};

export default Home;
