import React, { useState } from "react";
import { useOpenfort } from "../../hooks/useOpenfort";
import { EmbeddedState } from "@openfort/openfort-js";
import Spinner from "../Shared/Spinner";
import { useAuth } from "../../contexts/AuthContext";

const ExportPrivateKey: React.FC<{
  handleSetMessage: (message: string) => void;
}> = ({ handleSetMessage }) => {
  const { exportPrivateKey, embeddedState, error } = useOpenfort();
  const { idToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const handleExportPrivateKey = async () => {
    if (!idToken) {
      console.error("The Openfort integration isn't ready.");
      return;
    }
    try {
      setLoading(true);
      const privateKey = await exportPrivateKey();
      setLoading(false);
      if (!privateKey) {
        throw new Error("Failed to export private key");
      }
      handleSetMessage(privateKey);
    } catch (err) {
      // Handle errors from minting process
      console.error("Failed to export private key:", err);
      alert("Failed to export private key. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <p className="text-red-500">This button will export your private key. Please be careful with it.</p>
      <button
        onClick={handleExportPrivateKey}
        disabled={embeddedState !== EmbeddedState.READY}
        className={`mt-4 w-32 px-4 py-2 bg-black text-white font-semibold rounded-lg shadow-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50`}
      >
        {loading ? <Spinner /> : "Export"}
      </button>

      {error && (
        <p className="mt-2 text-red-500">{`Error: ${error.message}`}</p>
      )}
    </div>
  );
};

export default ExportPrivateKey;
