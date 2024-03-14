import React, { useEffect } from "react";
import Cookies from "js-cookie";

type Props = {
  children: React.ReactNode;
};

type SessionContext = {
  identityToken: string | null;
  accessToken: string | null;
  recoveryPassword: string | null;
  accountCreated: boolean;
  setIdentityToken: (token: string) => void;
  deleteIdentityToken: () => void;
  setAccessToken: (token: string) => void;
  deleteAccessToken: () => void;
  setRecoveryPassword: (password: string) => void;
  deleteRecoveryPassword: () => void;
  setAccountCreated: (created: boolean) => void;
  deleteAccountCreated: () => void;
  isLoggedIn: () => boolean;
  isLoaded: () => boolean;
  isAccountCreated: () => boolean;
};

const sessionContext = React.createContext<SessionContext | null>(null);

export default function SessionContextProvider({ children }: Props) {
  const [identityToken, setIdentityToken] = React.useState<string | null>(null);
  const [accessToken, setAccessToken] = React.useState<string | null>(null);
  const [recoveryPassword, setRecoveryPassword] = React.useState<string | null>(
    null
  );
  const [accountCreated, setAccountCreated] = React.useState<boolean>(false);

  useEffect(() => {
    const storedIdentityToken = Cookies.get("identityToken");
    const storedAccessToken = Cookies.get("accessToken");
    const storedRecoveryPassword = Cookies.get("recoveryPassword");
    const storedAccountCreated = Cookies.get("accountCreated");

    if (storedIdentityToken) setIdentityToken(storedIdentityToken);
    if (storedAccessToken) setAccessToken(storedAccessToken);
    if (storedRecoveryPassword) setRecoveryPassword(storedRecoveryPassword);
    if (storedAccountCreated)
      setAccountCreated(storedAccountCreated === "true");
  }, []);

  const updateCookieAndState = (
    key: string,
    value: string,
    setState: React.Dispatch<React.SetStateAction<any>>
  ) => {
    Cookies.set(key, value);
    setState(value);
  };

  const isLoggedIn = () => identityToken !== null && accessToken !== null;
  const isLoaded = () => isLoggedIn() && recoveryPassword !== null;
  const isAccountCreated = () => isLoaded() && accountCreated;

  const contextValue = {
    identityToken,
    accessToken,
    recoveryPassword,
    accountCreated,
    setIdentityToken: (token: string) =>
      updateCookieAndState("identityToken", token, setIdentityToken),
    deleteIdentityToken: () => {
      Cookies.remove("identityToken");
      setIdentityToken(null);
    },
    setAccessToken: (token: string) =>
      updateCookieAndState("accessToken", token, setAccessToken),
    deleteAccessToken: () => {
      Cookies.remove("accessToken");
      setAccessToken(null);
    },
    setRecoveryPassword: (password: string) =>
      updateCookieAndState("recoveryPassword", password, setRecoveryPassword),
    deleteRecoveryPassword: () => {
      Cookies.remove("recoveryPassword");
      setRecoveryPassword(null);
    },
    setAccountCreated: (created: boolean) =>
      updateCookieAndState(
        "accountCreated",
        created.toString(),
        setAccountCreated
      ),
    deleteAccountCreated: () => {
      Cookies.remove("accountCreated");
      setAccountCreated(false);
    },
    isLoggedIn,
    isLoaded,
    isAccountCreated,
  };

  return (
    <sessionContext.Provider value={contextValue}>
      {children}
    </sessionContext.Provider>
  );
}

export function useSession() {
  return React.useContext(sessionContext);
}
