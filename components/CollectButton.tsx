import * as React from "react";
import { useOpenfort } from "../lib/openfortContext";
import Openfort, { EmbeddedSigner } from "@openfort/openfort-js";

export function CollectButton() {
  const [collectLoading, setCollectLoading] = React.useState(false);
  const { config } = useOpenfort();

  const handleCollectButtonClick = async () => {
    try {
      setCollectLoading(true);

      const collectResponse = await fetch(`/api/examples/protected-collect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const collectResponseJSON = await collectResponse.json();

      if (collectResponseJSON.data?.nextAction) {
        console.log("config", config);
        const signer = new EmbeddedSigner(
          config.chainID,
          config.publishableKey,
          config.accessToken,
          config.password
        );
        const openfort = new Openfort(config.publishableKey, signer);
        const response = await openfort.sendSignatureTransactionIntentRequest(
          collectResponseJSON.data.id,
          collectResponseJSON.data.nextAction.payload.userOpHash
        );
        console.log("response", response);
        signer.dispose();
      }

      console.log("success:", collectResponseJSON.data);
      alert("Action performed successfully");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setCollectLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        disabled={collectLoading}
        onClick={handleCollectButtonClick}
      >
        {collectLoading ? "Collecting..." : "Collect item"}
      </button>
    </div>
  );
}
