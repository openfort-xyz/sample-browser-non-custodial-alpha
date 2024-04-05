import Openfort from '@openfort/openfort-js';

// Replace the following with your Openfort project's specific configuration
const openfortConfig = {
  publicKey: process.env.NEXT_PUBLIC_OPENFORT_PUBLIC_KEY!,
  shieldApiKey: process.env.NEXT_PUBLIC_SHIELD_API_KEY,
  shieldEncryptionShare: process.env.NEXT_PUBLIC_SHIELD_ENCRYPTION_SHARE,
  // Add any other configuration parameters required by your Openfort setup
};

// Initialize the Openfort SDK
const openfort = new Openfort(openfortConfig.publicKey, openfortConfig.shieldApiKey, openfortConfig.shieldEncryptionShare);

// Optionally, configure additional Openfort settings or initialize more services here

export { openfort };
