import React, { useRef, useState } from "react";
import { NextPage } from "next";
import LoginSignupForm from "../components/Authentication/LoginSignupForm";
import MintNFTButton from "../components/NFT/MintNFTButton";
import { useOpenfort } from "../hooks/useOpenfort";
import { EmbeddedState } from "@openfort/openfort-js";
import AccountRecovery from "../components/Authentication/AccountRecovery";
import Spinner from "../components/Shared/Spinner";
import LogoutButton from "../components/Shared/LogoutButton";
import SignMessageButton from "../components/Signatures/SignMessageButton";
import SignTypedDataButton from "../components/Signatures/SignTypedDataButton";
import EvmProviderButton from "../components/EvmProvider/EvmProviderButton";

import { useAuth } from "../contexts/AuthContext";
import CreateSessionButton from "../components/Sessions/CreateSessionButton";

const HomePage: NextPage = () => {
  const { user } = useAuth();
  const { embeddedState } = useOpenfort();
  const [message, setMessage] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSetMessage = (message: string) => {
    const newMessage = `> ${message} \n\n`;
    setMessage((prev) => prev + newMessage);
  };

  if (!user) return <LoginSignupForm />;

  if (embeddedState === EmbeddedState.EMBEDDED_SIGNER_NOT_CONFIGURED) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col px-4 sm:px-6">
        <p className="text-gray-400 mb-2">Welcome, {user.email}!</p>
        <div className="absolute top-2 right-2">
          <LogoutButton />
        </div>
        <div className="mt-8">
          <AccountRecovery />
        </div>
      </div>
    );
  }

  if (embeddedState !== EmbeddedState.READY) {
    return (
      <div className="absolute top-1/2 left-1/2 flex items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col px-4 sm:px-6">
      <p className="text-gray-400 mb-2">Welcome, {user.email}!</p>
      <div className="absolute top-2 right-2">
        <LogoutButton />
      </div>
      <div className="mb-8">
        <span className="font-medium text-black">Console: </span>
        <div className="py-4 block h-full">
          <textarea
            ref={textareaRef}
            className="no-scrollbar h-full w-full rounded-lg border-0 bg-gray-100 p-4 font-mono text-xs text-black"
            value={message}
            readOnly
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="bg-white p-4 rounded-md shadow-2xl space-y-4">
          <h2 className="flex justify-left font-medium text-xl pb-4">
            Account actions
          </h2>
          <div>
            <span className="font-medium text-black">Backend action: </span>
            <MintNFTButton handleSetMessage={handleSetMessage} />
          </div>
          <div>
            <span className="font-medium text-black">Ethers provider: </span>
            <EvmProviderButton handleSetMessage={handleSetMessage} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-md shadow-2xl space-y-4">
          <h2 className="flex justify-left font-medium text-xl pb-4">
            Signatures
          </h2>
          <div>
            <span className="font-medium text-black">Message: </span>Hello
            World!
            <SignMessageButton handleSetMessage={handleSetMessage} />
          </div>

          <div>
            <span className="font-medium text-black">Typed message: </span>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/openfort-xyz/sample-browser-nextjs-embedded-signer/blob/main/src/components/Signatures/SignTypedDataButton.tsx#L25"
              className="text-blue-600 hover:underline"
            >
              {"View typed message."}
            </a>
            <SignTypedDataButton handleSetMessage={handleSetMessage} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-md shadow-2xl space-y-4">
          <h2 className="flex justify-left font-medium text-xl pb-4">
            Session keys
          </h2>
          <div>
            <CreateSessionButton handleSetMessage={handleSetMessage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
