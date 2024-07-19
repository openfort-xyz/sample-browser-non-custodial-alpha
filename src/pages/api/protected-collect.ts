import type { NextApiRequest, NextApiResponse } from 'next';
import openfort from '../../utils/openfortAdminConfig';

const policy_id = 'pol_be4f381c-90ac-479d-862a-36fc724c3164';
const contract_id = 'con_14eb6778-389c-441e-a908-e366007b3156';
const chainId = 13337;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const accessToken = req.headers.authorization?.split(' ')[1];
  if (!accessToken) {
    return res.status(401).send({
      error: 'You must be signed in to view the protected content on this page.',
    });
  }

  try {
    const response = await openfort.iam.verifyOAuthToken({
      provider: 'firebase',
      token: accessToken,
      tokenType: 'idToken',
    });

    if (!response?.id) {
      return res.status(401).send({
        error: 'Invalid token or unable to verify user.',
      });
    }

    const randomTokenId = Date.now()
    const playerId = response.id;
    const interaction_mint = {
      contract: contract_id,
      functionName: 'mint',
      functionArgs: [playerId, randomTokenId.toString()],
    };

    const transactionIntent = await openfort.transactionIntents.create({
      player: playerId,
      policy: policy_id,
      chainId,
      interactions: [interaction_mint],
    });

    res.send({
      data: transactionIntent,
    });
  } catch (e) {
    console.error(e);
    res.status(500).send({
      error: 'Internal server error',
    });
  }
}
