import React, { useState } from "react";
import { useOpenfort } from "../../hooks/useOpenfort";
import { EmbeddedState } from "@openfort/openfort-js";
import Spinner from "../Shared/Spinner";
import { useAuth } from "../../contexts/AuthContext";
import { ethers } from "ethers";
import ABI from "../../utils/openfortContractABI";
import { _TypedDataEncoder } from "ethers/lib/utils";

const providerUrl =
  "https://eu.build.onbeam.com/rpc/testnet/14bfbcc5-49c1-40e8-82c2-025c9a1834e1";

const SignTypedDataButton: React.FC<{
  handleSetMessage: (message: string) => void;
}> = ({ handleSetMessage }) => {
  const { signTypedData, embeddedState, error } = useOpenfort();
  const { idToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [hash, setHash] = useState<string | null>(null);
  const handleSignTypedData = async () => {
    if (!idToken) {
      console.error("The Openfort integration isn't ready.");
      return;
    }
    try {
      setLoading(true);
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
      const signature = await signTypedData(domain, types, data);
      const hash = await _TypedDataEncoder.hash(domain, types, data);
      console.log("hash: ", hash);
      setHash(hash);
      setLoading(false);
      if (!signature) {
        throw new Error("Failed to sign message");
      }
      handleSetMessage(signature);
      setSignature(signature);
    } catch (err) {
      // Handle errors from minting process
      console.error("Failed to sign message:", err);
      alert("Failed to sign message. Please try again.");
    }
  };

  const handleVerifySignature = async (address: string) => {
    let provider = new ethers.providers.JsonRpcProvider(providerUrl);

    const iface = new ethers.utils.Interface(ABI);

    const encodedData = iface.encodeFunctionData("isValidSignature", [
      hash,
      signature,
    ]);

    const verifySigner = ethers.utils.recoverAddress(
      hash as string,
      signature as string
    );
    console.log("verifySigner: ", verifySigner);

    const tx = {
      to: address,
      data: encodedData,
    };
    setLoading(true);
    const result = await provider.call(tx);
    setLoading(false);
    console.log("verification result: ", result);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <button
        onClick={handleSignTypedData}
        disabled={embeddedState !== EmbeddedState.READY}
        className={`mt-2 w-52 px-4 py-2 bg-black text-white font-semibold rounded-lg shadow-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50`}
      >
        {loading ? <Spinner /> : "Sign Typed Message"}
      </button>
      {signature && (
        <p className="flex max-w-sm mt-2 overflow-auto">{signature}</p>
      )}
      {signature && (
        <button
          onClick={async () => {
            await handleVerifySignature(
              "0x33Cd73AC831779e87BD2Cb0d49C0963a86CdC7D2"
            );
          }}
          className={`mt-2 w-64 px-4 py-2 bg-black text-white font-semibold rounded-lg shadow-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50`}
        >
          {loading ? <Spinner /> : "Verify Sign Typed Message"}
        </button>
      )}

      {error && (
        <p className="mt-2 text-red-500">{`Error: ${error.message}`}</p>
      )}
    </div>
  );
};

export default SignTypedDataButton;
