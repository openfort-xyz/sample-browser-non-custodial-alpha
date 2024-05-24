import Openfort from '@openfort/openfort-js';

const openfortConfig = {
  publicKey: process.env.NEXT_PUBLIC_OPENFORT_PUBLIC_KEY!,
  shieldApiKey: process.env.NEXT_PUBLIC_SHIELD_API_KEY,
  shieldEncryptionShare: process.env.NEXT_PUBLIC_SHIELD_ENCRYPTION_SHARE,
};

// Initialize the Openfort SDK
const openfort = new Openfort(openfortConfig.publicKey, openfortConfig.shieldApiKey, openfortConfig.shieldEncryptionShare);

export default openfort;
