import {useEffect, useState} from "react";
import { NextPage } from "next";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import Openfort, {
  MissingRecoveryMethod,
  OAuthProvider,
  PasswordRecovery,
} from "@openfort/openfort-js";
import { signOut } from "../lib/authContext";
import { useSession } from "../lib/session";
import Image from "next/image";
const LoginSignup: NextPage = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showPasswordRecovery, setShowPasswordRecovery] = useState(false);
  const [showNFTs, setShowNFTs] = useState(false);
  const [allowMint, setAllowMint] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const session = useSession();
  const auth = getAuth();
  const openfort = new Openfort(process.env.NEXT_PUBLIC_OPENFORT_PUBLIC_KEY);

  useEffect(() => {
    if (!session) return;
    const updateStates = () => {
      setShowLogin(!session.isLoggedIn());
      setShowPasswordRecovery(session.isLoggedIn() && !session.isLoaded());
      setShowNFTs(session.isLoaded());
      setAllowMint(session.isLoaded() && session.isAccountCreated());
    }

    updateStates();
  }, [session]);

  async function waitForAccountCreation() {
    while (!await openfort.isAuthenticated()) {
      setTimeout(waitForAccountCreation, 250);
    }

    session!.setAccountCreated(true);
  }


  const togglePasswordRecovery = () => {
    setShowPasswordRecovery(!showPasswordRecovery);
  };
  const toggleLoginSignup = () => {
    setIsLogin(!isLogin);
  };

  async function loginSignup() {
    try {
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
    }
  }

  async function loginWithGoogle() {
    try {
      const googleProvider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      await authenticateWithOpenfort(idToken);
    } catch (error) {
      console.log(error);
      window.alert(error);
      await logout();
    }
  }

  async function authenticateWithOpenfort(identityToken: string) {
    try {
      session!.setIdentityToken(identityToken);
      const accessToken = await openfort.authenticateOAuth(
        OAuthProvider.Firebase,
        identityToken
      );
      session!.setAccessToken(accessToken);
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
      const password = (
        document.querySelector(
          'input[name="passwordRecovery"]'
        ) as HTMLInputElement
      ).value;
      const passwordRecovery = new PasswordRecovery(password);
      const chain = (
        document.querySelector('input[name="chain"]') as HTMLInputElement
      ).value;
      await openfort.configureEmbeddedSignerRecovery(
        passwordRecovery,
        parseInt(chain, 10)
      );
      session!.setRecoveryPassword(password);
      await waitForAccountCreation();
    } catch (error) {
      console.log(error);
      window.alert(error);
      await logout();
    }
  }
  
  async function mint () {
    setAllowMint(false);
    try {
      const collectResponse = await fetch(`/api/examples/protected-collect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session!.accessToken}`,
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
    session!.deleteAccessToken();
    session!.deleteIdentityToken();
    session!.deleteRecoveryPassword();
    session!.deleteAccountCreated();
    await signOut();
  }

  const nftImageBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAADtUlEQVR4Xu3dsXEVQRBF0fkGseDgiAAUAK5CUCryiUAh4CoM4eBQhIIBm8Ohqqv5V35Xz7y++7pndkv/9vXXw58Dfx+fnyD6nJ+v3yhe81PyK3h6/Zr/FgCGgBZAAdb8AWD1zwGmCdb8WP8A0AKohWn+AGgIJAamAdb8zQBU/k4BRy1YCdb8WP9mAC1AAMzeo9QC0AKmAdb8ARAAXQULA/oETrfQHECq37uA0ylg+GWWOlAOkAM0AwgD+gSunwFEvH8RqwLqGhQAza/x3AJ0ARofAKZgAJh+fBWM6Tk8AFDCWgAKqOG1AFMwBzD9agGoH4fnACZhDmD65QCoH4fnACZhDmD65QCoH4fnACZhDmD65QCoH4fnACZhDmD65QCoH4fnACZhDmD67XeAt8cX+v8A+jLk08MbleDH9y8Ur8HT61cHvAWAIRAA+FHktIBW/nOm158D1AKI4VoAyZcD8BQ8baFY/1pAp4DZU0wzQDMAmVgzAMnXDNAMMHyRVQuoBZCH1QJIvlpALaAWYP/suXsAe5nVDNAMQE2sGYDkawbgGUAtDOs3Hq43qarfuAPoBsYriAsIAPzFEdR/PDwAAoAgVAetBZD8HpwD5ABEUQ5A8s0H5wA5AFGYA5B888E5QA5AFOYAJN98cA6QAxCFOQDJNx+cA+QARGEOQPLNB+cAOQBROO4AtPqCxxXgl0HjO2gBpEAAkHz7gwNgfw1pBwFA8u0PDoD9NaQdBADJtz84APbXkHYQACTf/uAA2F9D2kEAkHz7gwNgfw1pBwFA8u0PDoD9NaQdBADJtz84APbXkHbAPxihHyTQ6q9g/aJG82/ffwAgAQEw/ElXDmD/pCsHyAEe6DeDtlsg1v9s338OgAQEQDMAImThOgPlAKZ/LWC7BWL9AyAAnpQhiq8F4O8WkvpX8PYHoBkACQiATgGIkIXXAmoBRFAtgORrBlg/BGH91++fPwj58P5MGv7+/Erxmp+SX8HT69f8AYAEaAEUYM0fAAHwQq+DpwnW/Fj/WoAWQC1M8wfAYw4gEEwDrPmbAaT6nQLOUQtWgjU/1r8ZQAsQALP3KLUAtIBpgDV/AARApwBhQJ/A6RaaA0j1OwV0CsgBehtIHlIL6HUwAaQOxDMArf4Knn4C7n39AYAEbAc4AALA7gFQv1oAzkCqfw6ACtYC7lzAAAgAUkCPcZT8Cq4FoII5wJ0LGAABQArUAobfJVD1/oObzGYAJKAWcOcCBkAAkALNAM0ABJAGNwOggttbwF+kxELNGVJ15QAAAABJRU5ErkJggg=="

  return (
    <div className="login-signup-container">
      {showNFTs ? (
        <>
          <h2 className="login-signup-title">{"NFTs"}</h2>
          <div className="nft-container">
            <Image className="nft-image" src={nftImageBase64} alt={"NFT"} width={128} height={128}/>
          </div>
          <div className="button-group">
            <button className="mint-nft-btn" disabled={!allowMint} onClick={mint}>
              {"Mint NFT"}
            </button>
          </div>
        </>
      ) : null}

      {showPasswordRecovery ? (
        <>
          <h2 className="login-signup-title">
            {"Enter your recovery password"}
          </h2>
          <div className="input-group">
            <div className="recovery-input-group">
              <a className="chain-label">Chain</a>
              <input
                type="number"
                name="chain"
                value="80001"
                placeholder="Chain"
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                name="passwordRecovery"
                placeholder="Password recovery"
              />
            </div>
            <div className="button-group">
              <button className="login-login-btn" onClick={setPasswordRecovery}>
                {"Submit"}
              </button>
            </div>
          </div>
        </>
      ) : null}
      {showLogin ? (
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
          <div className="button-group">
            <button className="login-login-btn" onClick={loginSignup}>
              {isLogin ? "Login" : "Signup"}
            </button>
          </div>
          <div className="button-group">
            <button className="google-login-btn" onClick={loginWithGoogle}>
                  Login with Google
            </button>
          </div>
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
      <a className="close-btn" onClick={logout}>Sign out</a>
    </div>
  );
};

export default LoginSignup;
