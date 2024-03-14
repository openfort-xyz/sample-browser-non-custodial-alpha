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
import Openfort, {
  MissingRecoveryMethod,
  OAuthProvider,
  PasswordRecovery,
} from "@openfort/openfort-js";

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
  async function login() {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const idToken = await userCredential.user.getIdToken();
      await openfort.authenticateOAuth(OAuthProvider.Firebase, idToken);
      await setOpenfortConfigConfig(80001);
    } catch (error) {
      console.log(error);
      window.alert(error);
      await signOut();
    }
  }

  async function setOpenfortConfigConfig(chainId: number) {
    try {
      await openfort.configureEmbeddedSigner();
    } catch (error) {
      if (error instanceof MissingRecoveryMethod) {
        const password = requestPin();

        const passwordRecovery = new PasswordRecovery(password);
        await openfort.configureEmbeddedSignerRecovery(
          passwordRecovery,
          chainId
        );
      }
    }
  }

  async function loginWithGoogle() {
    try {
      const googleProvider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      await openfort.authenticateOAuth(OAuthProvider.Firebase, idToken);
      await setOpenfortConfigConfig(80001);
    } catch (error) {
      console.log(error);
      window.alert(error);
      await signOut();
    }
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
          <button onClick={login}>Login</button>
        </div>
        <div>
          <button onClick={loginWithGoogle}>Login with Google</button>
        </div>
      </div>
    </>
  );
};

export default Home;
