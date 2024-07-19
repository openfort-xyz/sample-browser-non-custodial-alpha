import React, { useMemo, useState } from "react";
import { useOpenfort } from "../../hooks/useOpenfort";
import { EmbeddedState } from "@openfort/openfort-js";
import Spinner from "../Shared/Spinner";
import { useAuth } from "../../contexts/AuthContext";
import { ethers } from "ethers";
import ABI from "../../utils/openfortContractABI";
import { _TypedDataEncoder } from "ethers/lib/utils";

const SignTypedDataButton: React.FC<{
  handleSetMessage: (message: string) => void;
}> = ({ handleSetMessage }) => {
  const { signTypedData, embeddedState, error, getEvmProvider } = useOpenfort();
  const { idToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);

  const [signature, setSignature] = useState<string | null>(null);
  const [hash, setHash] = useState<string | null>(null);
  const handleSignTypedData = async () => {
    if (!idToken) {
      console.error("The Openfort integration isn't ready.");
      return;
    }
    try {
      setLoading(true);

      const signature = await signTypedData(domain, types, data);
      const hash = await _TypedDataEncoder.hash(domain, types, data);

      setHash(hash);
      setLoading(false);
      if (!signature) {
        throw new Error("Failed to sign message");
      }
      handleSetMessage(`Signature: \n${signature}`);
      setSignature(signature);
    } catch (err) {
      // Handle errors from minting process
      console.error("Failed to sign message:", err);
      alert("Failed to sign message. Please try again.");
    }
  };

  const handleVerifySignature = async () => {
    setLoadingVerify(true);
    const provider = getEvmProvider();
    const web3Provider = new ethers.providers.Web3Provider(provider);
    const signer = await web3Provider.getSigner();
    const address = await signer.getAddress();
    const iface = new ethers.utils.Interface(ABI);

    const encodedData = iface.encodeFunctionData("isValidSignature", [
      hash,
      signature,
    ]);

    // Owner of the smart account
    const verifySigner = ethers.utils.verifyTypedData(
      domain,
      types,
      data,
      signature!
    );

    handleSetMessage(
      `Recovered signer address (owner of smart account): ${verifySigner}`
    );
    const tx = {
      to: address,
      data: encodedData,
    };

    const result = await web3Provider.call(tx);
    const isValid = result.includes("0x1626ba7e");
    handleSetMessage(
      `Verification result: ${isValid ? "Valid" : "Invalid"} (${result})`
    );

    setLoadingVerify(false);
  };

  return (
    <div className="flex flex-col">
      <button
        onClick={handleSignTypedData}
        disabled={embeddedState !== EmbeddedState.READY || loading}
        className={`mt-2 w-52 px-4 py-2 bg-black text-white font-semibold rounded-lg shadow-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50`}
      >
        {loading ? <Spinner /> : "Sign Typed Message"}
      </button>
      {signature && (
        <button
          onClick={async () => {
            await handleVerifySignature();
          }}
          disabled={loadingVerify}
          className={`mt-2 w-52 px-4 py-2 bg-black text-white font-semibold rounded-lg shadow-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50`}
        >
          {loadingVerify ? <Spinner /> : "Verify Sign Message"}
        </button>
      )}

      {error && (
        <p className="mt-2 text-red-500">{`Error: ${error.message}`}</p>
      )}
    </div>
  );
};

export default SignTypedDataButton;

const domain = {
  chainId: 13337,
  version: "1.5",
  name: "Seaport",
  verifyingContract: "0x00000000000000adc04c56bf30ac9d3c0aaf14dc",
};
const types = {
  ConsiderationItem: [
    {
      name: "itemType",
      type: "uint8",
    },
    {
      name: "token",
      type: "address",
    },
    {
      name: "identifierOrCriteria",
      type: "uint256",
    },
    {
      name: "startAmount",
      type: "uint256",
    },
    {
      name: "endAmount",
      type: "uint256",
    },
    {
      name: "recipient",
      type: "address",
    },
  ],
  OrderComponents: [
    {
      name: "offerer",
      type: "address",
    },
    {
      name: "zone",
      type: "address",
    },
    {
      type: "OfferItem[]",
      name: "offer",
    },
    {
      name: "consideration",
      type: "ConsiderationItem[]",
    },
    {
      type: "uint8",
      name: "orderType",
    },
    {
      type: "uint256",
      name: "startTime",
    },
    {
      type: "uint256",
      name: "endTime",
    },
    {
      name: "zoneHash",
      type: "bytes32",
    },
    {
      name: "salt",
      type: "uint256",
    },
    {
      name: "conduitKey",
      type: "bytes32",
    },
    {
      type: "uint256",
      name: "counter",
    },
  ],
  OfferItem: [
    {
      name: "itemType",
      type: "uint8",
    },
    {
      name: "token",
      type: "address",
    },
    {
      type: "uint256",
      name: "identifierOrCriteria",
    },
    {
      type: "uint256",
      name: "startAmount",
    },
    {
      type: "uint256",
      name: "endAmount",
    },
  ],
};
const data = {
  conduitKey:
    "0x0000000000000000000000000000000000000000000000000000000000000000",
  salt: "0x1d4da48b00000000000000000000000020eaad3105285e9fe99d602d44a36d2d",
  zone: "0x0000000000000000000000000000000000000000",
  consideration: [
    {
      startAmount: "1000000000000000",
      recipient: "0x6e763b4abc583467c8e83e9ee4de626704726981",
      identifierOrCriteria: "0",
      endAmount: "1000000000000000",
      itemType: 0,
      token: "0x0000000000000000000000000000000000000000",
    },
  ],
  offer: [
    {
      identifierOrCriteria: "0",
      startAmount: "1",
      endAmount: "1",
      itemType: 3,
      token: "0xd717cc9f5f68bbc4f0bee120b26004bfd65f272e",
    },
  ],
  orderType: 1,
  startTime: 1708331093,
  zoneHash:
    "0x0000000000000000000000000000000000000000000000000000000000000000",
  offerer: "0x6e763b4abc583467c8e83e9ee4de626704726981",
  counter: "0",
  endTime: 1708935893,
};
