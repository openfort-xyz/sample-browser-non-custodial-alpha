import * as React from "react";
import Openfort from "@openfort/openfort-js";

const waitUntilAuthenticated = (openfort: Openfort) => {
  return new Promise((resolve, reject) => {
    const maxAttempts = 100;
    let attempts = 0;

    const checkIfAuthenticatedInterval = setInterval(async () => {
      const authenticated = await openfort.isAuthenticated();
      if (authenticated) {
        clearInterval(checkIfAuthenticatedInterval);
        resolve(true);
        return;
      } else if (attempts >= maxAttempts) {
        clearInterval(checkIfAuthenticatedInterval);
        reject(new Error("Authentication check timed out."));
      }
      attempts++;
    }, 100);
  });
};
export function CollectButton() {
  const [collectLoading, setCollectLoading] = React.useState(false);
  const [authenticated, setAuthenticated] = React.useState(false);
  const openfort = new Openfort();
  waitUntilAuthenticated(openfort).then(() => setAuthenticated(true));

  const handleCollectButtonClick = async () => {
    setCollectLoading(true);
    console.log("openfort", openfort.getAccessToken(), openfort.isLoaded());
    if (!openfort) {
      return;
    }
    try {
      while (!(await openfort.isAuthenticated())) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      console.log(openfort.getAccessToken());

      const collectResponse = await fetch(`/api/examples/protected-collect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
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
      setCollectLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        disabled={collectLoading || !authenticated}
        onClick={handleCollectButtonClick}
      >
        {collectLoading ? "Collecting..." : "Collect item"}
      </button>
    </div>
  );
}
