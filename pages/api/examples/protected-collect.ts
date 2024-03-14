import type { NextApiRequest, NextApiResponse } from "next";
import Openfort from "@openfort/openfort-node";
import Cookies from "js-cookie";

const openfort = new Openfort(
  process.env.NEXTAUTH_OPENFORT_SECRET_KEY!,
  "http://localhost:3000"
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let accessToken = req.headers.authorization;
  if (!accessToken) {
    res.statusCode = 401;
    return res.send({
      error: "You must be signed in to view the protected content on this page.",
    });
  }

  accessToken = accessToken.split("Bearer ")[1];
  if (!accessToken) {
    res.statusCode = 401;
    return res.send({
      error: "You must be signed in to view the protected content on this page.",
    });
  }


  const authResult = await openfort.iam.verifyAuthToken(accessToken);
  if (authResult) {
    const playerId = authResult.playerId;

    const policy_id = "pol_d8e4f80c-e638-480f-9d7d-a675c9678760";
    const contract_id = "con_00708c46-b492-48d6-a682-5bdbb36dc29a";
    const chainId = 80001;
    const optimistic = true;

    const interaction_mint = {
      contract: contract_id,
      functionName: "mint",
      functionArgs: [playerId],
    };

    try {
      const transactionIntent = await openfort.transactionIntents.create({
        player: playerId,
        policy: policy_id,
        chainId,
        optimistic,
        interactions: [interaction_mint],
      });

      return res.send({
        data: transactionIntent,
      });
    } catch (e: any) {
      console.log(e);
      return res.send({
        data: null,
      });
    }
  }
  res.statusCode = 401;
  res.send({
    error: "You must be signed in to view the protected content on this page.",
  });
}
