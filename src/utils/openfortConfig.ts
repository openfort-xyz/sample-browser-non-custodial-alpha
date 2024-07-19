import Openfort, { OpenfortConfiguration, ShieldConfiguration } from '@openfort/openfort-js';


const baseConfiguration: OpenfortConfiguration = {
  publishableKey: process.env.NEXT_PUBLIC_OPENFORT_PUBLIC_KEY!,
}
const shieldConfiguration: ShieldConfiguration = {
  shieldPublishableKey: process.env.NEXT_PUBLIC_SHIELD_API_KEY!,
  debug: false,
}

// Initialize the Openfort SDK
const openfort = new Openfort({
  baseConfiguration,
  shieldConfiguration,
})

export default openfort;
