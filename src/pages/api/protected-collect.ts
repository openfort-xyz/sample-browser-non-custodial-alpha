import type { NextApiRequest, NextApiResponse } from 'next';
import openfort from '../../utils/openfortAdminConfig';

const policy_id = 'pol_0b74cbac-146b-4a1e-98e1-66e83aef5deb';
const contract_id = 'con_42883506-04d5-408e-93da-2151e293a82b';
const chainId = 80001;
const optimistic = true;

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

    const playerId = response.id;
    const interaction_mint = {
      contract: contract_id,
      functionName: 'mint',
      functionArgs: [playerId],
    };

    const transactionIntent = await openfort.transactionIntents.create({
      player: playerId,
      policy: policy_id,
      chainId,
      optimistic,
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
