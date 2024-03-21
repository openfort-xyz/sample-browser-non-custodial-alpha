import {useEffect, useMemo, useState} from "react";
import {NextPage} from "next";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import Openfort, {
  EmbeddedState,
  MissingRecoveryMethod,
  OAuthProvider,
  PasswordRecovery,
  TokenType
} from "@openfort/openfort-js";
import Image from "next/image";
import {signOut as signout} from "@firebase/auth";

const Demo: NextPage = () => {
  const [allowLogout, setAllowLogout] = useState(true);
  const [allowLogin, setAllowLogin] = useState(true);
  const [allowSetPasswordRecovery, setAllowSetPasswordRecovery] = useState(true);
  const [allowMint, setAllowMint] = useState(true);
  const [isLogin, setIsLogin] = useState(true);
  const [getState, setState]  = useState(EmbeddedState.NONE);
  const [polling, setPolling] = useState(true);
  const auth = getAuth();
  const openfort = useMemo(() => new Openfort(process.env.NEXT_PUBLIC_OPENFORT_PUBLIC_KEY), []);

  useEffect(() => {
    if (!openfort || !polling) return;

    const interval = setInterval(async () => {
      const state = openfort.getEmbeddedState();
      setState(state);

      if (state === EmbeddedState.READY) {
        clearInterval(interval);
        setPolling(false);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [openfort, polling]);

  const toggleLoginSignup = () => {
    setIsLogin(!isLogin);
  };

  async function loginSignup() {
    try {
      setAllowLogin(false);
      const email = (
          document.querySelector('input[name="email"]') as HTMLInputElement
      ).value;
      const password = (
          document.querySelector('input[name="password"]') as HTMLInputElement
      ).value;
      let userCredential;
      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
      } else {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
      }
      const idToken = await userCredential.user.getIdToken();
      await authenticateWithOpenfort(idToken);
    } catch (error) {
      console.log(error);
      window.alert(error);
      await logout();
    } finally {
      setAllowLogin(true);
    }
  }

  async function loginWithGoogle() {
    try {
      setAllowLogin(false);
      const googleProvider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      await authenticateWithOpenfort(idToken);
    } catch (error) {
      console.log(error);
      window.alert(error);
      await logout();
    } finally {
      setAllowLogin(true);
    }
  }

  async function authenticateWithOpenfort(identityToken: string) {
    try {
      const accessToken = await openfort.authenticateWithOAuth(
        OAuthProvider.Firebase,
        identityToken,
        TokenType.IdToken
      );
      await openfort.configureEmbeddedSigner();
    } catch (error) {
      if (!(error instanceof MissingRecoveryMethod)) {
        console.log(error);
        window.alert(error);
        await logout();
      }
    }
  }

  async function setPasswordRecovery() {
    try {
      setAllowSetPasswordRecovery(false);
      const password = (
          document.querySelector(
            'input[name="passwordRecovery"]'
          ) as HTMLInputElement
      ).value;

      if (password.length < 4) {
        alert("Password recovery must be at least 4 characters");
        return;
      }

      console.log("password");
      const passwordRecovery = new PasswordRecovery(password);
      console.log("configuring recovery method");
      await openfort.configureEmbeddedSignerRecovery(passwordRecovery, 80001);
      console.log("configured recovery method");
    } catch (error) {
      console.log(error);
      window.alert(error);
      await logout();
    } finally {
      setAllowSetPasswordRecovery(true);
    }
  }

  async function mint () {
    setAllowMint(false);
    try {
      const collectResponse = await fetch(`/api/examples/protected-collect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openfort.getAccessToken()}`,
        },
      });

      if (!collectResponse.ok) {
        alert("Failed to mint NFT status: " + collectResponse.status);
        return;
      }
      const collectResponseJSON = await collectResponse.json();

      if (collectResponseJSON.data?.nextAction) {
        const response = await openfort.sendSignatureTransactionIntentRequest(
          collectResponseJSON.data.id,
          collectResponseJSON.data.nextAction.payload.userOpHash
        );
        console.log("response", response);
        document.getElementById('minted-nft-link')!.setAttribute('href', `https://mumbai.polygonscan.com/tx/${response.response?.transactionHash}`);
        document.getElementById('minted-nft-link')!.innerText = `Minted NFT: ${response.response?.transactionHash}`;

      }
      console.log("success:", collectResponseJSON.data);
      alert("Action performed successfully");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setAllowMint(true);
    }
  }

  async function logout() {
    setAllowLogout(false);
    await signout(auth);
    await openfort.logout();
    setPolling(true);
    setAllowLogout(true);
  }

  const nftImageBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAADtUlEQVR4Xu3dsXEVQRBF0fkGseDgiAAUAK5CUCryiUAh4CoM4eBQhIIBm8Ohqqv5V35Xz7y++7pndkv/9vXXw58Dfx+fnyD6nJ+v3yhe81PyK3h6/Zr/FgCGgBZAAdb8AWD1zwGmCdb8WP8A0AKohWn+AGgIJAamAdb8zQBU/k4BRy1YCdb8WP9mAC1AAMzeo9QC0AKmAdb8ARAAXQULA/oETrfQHECq37uA0ylg+GWWOlAOkAM0AwgD+gSunwFEvH8RqwLqGhQAza/x3AJ0ARofAKZgAJh+fBWM6Tk8AFDCWgAKqOG1AFMwBzD9agGoH4fnACZhDmD65QCoH4fnACZhDmD65QCoH4fnACZhDmD65QCoH4fnACZhDmD65QCoH4fnACZhDmD67XeAt8cX+v8A+jLk08MbleDH9y8Ur8HT61cHvAWAIRAA+FHktIBW/nOm158D1AKI4VoAyZcD8BQ8baFY/1pAp4DZU0wzQDMAmVgzAMnXDNAMMHyRVQuoBZCH1QJIvlpALaAWYP/suXsAe5nVDNAMQE2sGYDkawbgGUAtDOs3Hq43qarfuAPoBsYriAsIAPzFEdR/PDwAAoAgVAetBZD8HpwD5ABEUQ5A8s0H5wA5AFGYA5B888E5QA5AFOYAJN98cA6QAxCFOQDJNx+cA+QARGEOQPLNB+cAOQBROO4AtPqCxxXgl0HjO2gBpEAAkHz7gwNgfw1pBwFA8u0PDoD9NaQdBADJtz84APbXkHYQACTf/uAA2F9D2kEAkHz7gwNgfw1pBwFA8u0PDoD9NaQdBADJtz84APbXkHbAPxihHyTQ6q9g/aJG82/ffwAgAQEw/ElXDmD/pCsHyAEe6DeDtlsg1v9s338OgAQEQDMAImThOgPlAKZ/LWC7BWL9AyAAnpQhiq8F4O8WkvpX8PYHoBkACQiATgGIkIXXAmoBRFAtgORrBlg/BGH91++fPwj58P5MGv7+/Erxmp+SX8HT69f8AYAEaAEUYM0fAAHwQq+DpwnW/Fj/WoAWQC1M8wfAYw4gEEwDrPmbAaT6nQLOUQtWgjU/1r8ZQAsQALP3KLUAtIBpgDV/AARApwBhQJ/A6RaaA0j1OwV0CsgBehtIHlIL6HUwAaQOxDMArf4Knn4C7n39AYAEbAc4AALA7gFQv1oAzkCqfw6ACtYC7lzAAAgAUkCPcZT8Cq4FoII5wJ0LGAABQArUAobfJVD1/oObzGYAJKAWcOcCBkAAkALNAM0ABJAGNwOggttbwF+kxELNGVJ15QAAAABJRU5ErkJggg=="

  return (
    <div className="login-signup-container">
      <div className="logo">
        <svg viewBox="0 0 39 11" aria-hidden="true" className="block h-8 w-auto">
          <path className="fill-zinc-400" transform="translate(0, 5) scale(0.04)"
            d="m75.9 72.3h18.2v32.4h-18.2zm94.8 32.3h-18.2v-87.1h-135v87.1h-18.2v-105.2h13.5v-0.1h157.9v0.1zm-36.5-50.7h-0.1v50.7h-18.2v-50.7h-61.9v50.7h-18.2v-66.5-2.4h98.4z"></path>
          <path className="fill-zinc-400" transform="scale(0.04) translate(220, 90)"
            d="m48.4 137.1q-14.9 0-25.8-6.7-10.9-6.7-16.8-18.5-5.9-11.7-5.9-27.1 0-15.5 6.1-27.3 6-11.7 16.9-18.3 10.9-6.5 25.5-6.5 14.8 0 25.7 6.6 10.9 6.7 16.9 18.5 5.9 11.7 5.9 27 0 15.5-6 27.2-6 11.8-16.9 18.4-10.9 6.7-25.6 6.7zm0-18.1q14.2 0 21.2-9.5 7-9.6 7-24.7 0-15.5-7.1-24.8-7.1-9.3-21.1-9.3-9.6 0-15.9 4.4-6.2 4.3-9.2 12-3 7.6-3 17.7 0 15.5 7.1 24.9 7.2 9.3 21 9.3zm68.6 59.3v-142.9h17v8.9q2.6-2.7 5.6-4.8 9.5-6.8 23.5-6.8 14 0 24.1 6.8 10.1 6.8 15.6 18.6 5.5 11.8 5.5 26.7 0 14.8-5.5 26.7-5.4 11.8-15.4 18.7-10.1 6.9-23.9 6.9-14.2 0-23.8-6.9-1.8-1.3-3.5-2.8v50.9c0 0-19.2 0-19.2 0zm43.9-58.5q9.1 0 15.1-4.7 6-4.7 9-12.6 3-7.9 3-17.7 0-9.7-3-17.6-3-7.9-9.1-12.5-6.1-4.7-15.7-4.7-8.9 0-14.8 4.4-5.8 4.4-8.6 12.3-2.8 7.8-2.8 18.1 0 10.3 2.8 18.1 2.7 7.9 8.7 12.4 5.9 4.5 15.4 4.5zm111.4 17.3q-14.7 0-25.8-6.5-11.2-6.4-17.4-18-6.1-11.6-6.1-26.9 0-16.2 6-28.1 6.1-11.9 17-18.4 10.9-6.5 25.4-6.5 15.1 0 25.7 7 10.7 7 15.9 19.9 5.3 12.9 4.2 30.7h-9.5v-0.3h-9.6v0.3h-54.1v0.7h-0.4q1.1 11.9 6.9 19.1 7.3 8.9 20.9 9 9 0 15.5-4.1 6.6-4.1 10.2-11.7l18.8 5.9q-5.8 13.3-17.5 20.6-11.7 7.3-26.1 7.3zm19.2-79.2q-6.4-8.3-19.4-8.3-14.3 0-21.6 9.1-4.9 6.2-6.5 16.2v0.5l53-0.1v-0.3h0.5q-1.3-11-6-17.1zm43.4 76.4v-98.9h17.1v11.9q4.1-5.2 9.9-8.8 9.5-5.7 22.8-5.7 10.3 0 17.3 3.3 6.9 3.3 11.3 8.6 4.3 5.4 6.6 11.7 2.3 6.3 3.1 12.4 0.8 6 0.8 10.6v55h-19.4v-48.7q0-5.8-0.9-11.9-1-6-3.7-11.3-2.7-5.2-7.6-8.4-4.9-3.2-12.8-3.2-5.1 0-9.7 1.7-4.6 1.7-8 5.4-3.4 3.8-5.4 9.9-2 6.2-2 15v51.4zm105.4-83.5v-15.4h16.4v-3.5q0-3.7 0.3-8 0.3-4.2 1.6-8.4 1.3-4.2 4.5-7.7 3.7-4.1 8.2-5.8 4.5-1.8 8.9-2 4.5-0.3 8.2-0.3h12.5v15.8h-11.5q-6.8-0.1-10.2 3.3-3.3 3.3-3.3 9.5v7.1h25v15.4h-25v83.5h-19.2v-83.5zm114.5 86.3q-14.8 0-25.7-6.7-10.9-6.7-16.8-18.5-5.9-11.7-5.9-27.1 0-15.5 6-27.3 6.1-11.7 17-18.3 10.9-6.5 25.4-6.5 14.9 0 25.8 6.6 10.9 6.7 16.8 18.5 6 11.7 6 27 0 15.5-6 27.2-6 11.8-16.9 18.4-10.9 6.7-25.7 6.7zm0-18.1q14.2 0 21.2-9.5 7-9.6 7-24.7 0-15.5-7.1-24.8-7.1-9.3-21.1-9.3-9.6 0-15.8 4.4-6.3 4.3-9.3 12-3 7.6-3 17.7 0 15.5 7.1 24.9 7.2 9.3 21 9.3zm68.7-83.6h17.1v15.8q1.1-1.9 2.3-3.7 3-3.9 6.8-6.5 3.8-2.8 8.4-4.3 4.6-1.5 9.5-1.8 4.8-0.3 9.3 0.5v17.9q-4.8-1.2-10.7-0.7-5.9 0.6-10.9 3.8-4.7 3-7.4 7.3-2.7 4.3-3.9 9.6-1.2 5.2-1.2 11.1v49.9h-19.3zm17.1 15.8q-0.5 0.9-1 1.8h1zm42.7-0.4v-15.4h19v-27.5h19.2v27.5h29.4v15.4h-29.4v43.7q0 5.9 0.2 10.3 0.1 4.4 1.9 7.4 3.2 5.7 10.4 6.5 7.2 0.8 16.9-0.6v16.2q-9.3 1.9-18.3 1.6-9-0.3-16-3.5-7.1-3.2-10.7-10.1-3.2-6.1-3.4-12.5-0.2-6.3-0.2-14.4v-44.6z"></path>
        </svg>
      </div>
      {getState !== EmbeddedState.NONE && getState !== EmbeddedState.UNAUTHENTICATED ? (
        <>
          <div className="logout-container">
            {allowLogout ? (
              <div>
                <a className="logout-text" onClick={logout}>Logout</a>
              </div>
            ) : (
              <div>
                <div className="dot">...</div>
              </div>
            )}
          </div>
        </>
      ) : null}
      {getState === EmbeddedState.CREATING_ACCOUNT || getState === EmbeddedState.READY ? (
        <>
          <h2 className="login-signup-title">{"NFTs"}</h2>
          <div className="nft-container">
            <Image className="nft-image" src={nftImageBase64} alt={"NFT"} width={128} height={128}/>
          </div>
          <div className="button-group">
            <a id='minted-nft-link' className="nft-link" href="#" target="_blank" rel="noreferrer noopener"></a>
          </div>
          <div className="button-group">
            {allowMint ? (<div>
              <button className="mint-nft-btn" disabled={getState !== EmbeddedState.READY} onClick={mint}>
                {"Mint NFT"}
              </button>
            </div>) : (<div>
              <div className="spinner"></div>
            </div>)}
          </div>
        </>
      ) : null}

      {getState === EmbeddedState.MISSING_RECOVERY_METHOD ? (
        <>
          <h2 className="login-signup-title">
            {"Enter your recovery pin"}
          </h2>
          <div className="input-group">
            <div className="recovery-input-group">
              <input
                type="number"
                name="passwordRecovery"
                placeholder="Pin recovery"
              />
            </div>
            <div className="button-group">
              {allowSetPasswordRecovery ? (
                <button className="login-login-btn" onClick={setPasswordRecovery}>
                  {"Submit"}
                </button>
              ) : (
                <div>
                  <div className="spinner"></div>
                </div>
              )}
            </div>
          </div>
        </>
      ) : null}
      {getState === EmbeddedState.UNAUTHENTICATED ? (
        <>
          <h2 className="login-signup-title">
            {isLogin ? "Sign in to account" : "Sign up for an account"}
          </h2>
          <div className="input-group">
            <input type="email" name="email" placeholder="Email"/>
          </div>
          <div className="input-group">
            <input type="password" name="password" placeholder="Password"/>
          </div>
          {allowLogin ? <div>
            <div className="button-group">
              <button className="login-login-btn" onClick={loginSignup}>
                {isLogin ? "Login" : "Signup"}
              </button>
            </div>
            <div className="button-group">
              <button className="google-login-btn" onClick={loginWithGoogle}>
                    Continue with Google
              </button>
            </div>
          </div> : <div className="button-group"><div className="spinner"></div></div>}
          <div className="toggle-text">
            {isLogin ? (
              <p>
                      Not registered? <span onClick={toggleLoginSignup}>Sign up</span>
                      .
              </p>
            ) : (
              <p>
                      Already registered?{" "}
                <span onClick={toggleLoginSignup}>Sign in</span>.
              </p>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default Demo;
