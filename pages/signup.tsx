import type { NextPage } from "next";
import Head from "next/head";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useState } from "react";
import { signOut, useAuth } from "../lib/authContext";
import Link from "next/link";
import Openfort, {
  OAuthProvider,
  PasswordRecovery,
} from "@openfort/openfort-js";
import { requestPin } from "../lib/create-pin";
import { useOpenfort } from "../lib/openfortContext";

const openfort = new Openfort(process.env.NEXT_PUBLIC_OPENFORT_PUBLIC_KEY!);

const Home: NextPage = () => {
  const { user, loading } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { setConfig } = useOpenfort();

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
  async function setOpenfortConfigConfig(
    chainId: number,
    publishableKey: string,
    accessToken: string
  ) {
    const openfortConfig = {
      chainID: chainId,
      publishableKey: publishableKey,
      accessToken: accessToken,
    };
    setConfig(openfortConfig);
    try {
      await openfort.configureEmbeddedSigner(chainId);
    } catch (error) {
      console.log("missing embedded signer shares", error);
      const password = requestPin();

      const passwordRecovery = new PasswordRecovery(password);
      await openfort.configureEmbeddedSignerRecovery(passwordRecovery);
    }
  }
  function createUserCredentials() {
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;
        const idToken = await userCredential.user.getIdToken();

        const token = await openfort.authorizeWithOAuthToken(
          OAuthProvider.Firebase,
          idToken
        );

        setOpenfortConfigConfig(
          80001,
          process.env.NEXT_PUBLIC_OPENFORT_PUBLIC_KEY!,
          token
        ).then((r) => {
          console.log("config set");
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

  function loginWithGoogle() {
    const googleProvider = new GoogleAuthProvider();

    signInWithPopup(auth, googleProvider)
      .then(async (result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.

        const idToken = await result.user.getIdToken();
        const token = await openfort.loginWithOAuthToken("firebase", idToken);

        setOpenfortConfigConfig(
          80001,
          process.env.NEXT_PUBLIC_OPENFORT_PUBLIC_KEY!,
          token
        ).then((r) => {
          console.log("config set");
        });
        // The signed-in user info.
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
        <title>Signup</title>
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
          <button onClick={createUserCredentials}>Signup</button>
        </div>
        <div>
          <button onClick={() => loginWithGoogle()}>Login with Google</button>
        </div>
      </div>
    </>
  );
};

export default Home;
