import Openfort, { OpenfortConfiguration, ShieldConfiguration } from '@openfort/openfort-js';


const baseConfiguration: OpenfortConfiguration = {
  publishableKey: process.env.NEXT_PUBLIC_OPENFORT_PUBLIC_KEY!,
}
const shieldConfiguration: ShieldConfiguration = {
  shieldPublishableKey: process.env.NEXT_PUBLIC_SHIELD_API_KEY!,
  debug: false,
}

if(!process.env.NEXT_PUBLIC_OPENFORT_PUBLIC_KEY || !process.env.NEXT_PUBLIC_SHIELD_API_KEY || !process.env.NEXT_PUBLIC_CHAIN_ID || !process.env.NEXT_PUBLIC_POLICY_ID || !process.env.NEXT_PUBLIC_CONTRACT_ID) {
  throw new Error('Missing Openfort environment variables');
}

// Initialize the Openfort SDK
const openfort = new Openfort({
  baseConfiguration,
  shieldConfiguration,
})

export default openfort;