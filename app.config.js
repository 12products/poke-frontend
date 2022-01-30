import 'dotenv/config'

export default {
  name: 'poke-frontend',
  version: '1.0.0',
  extra: {
    pokeUrl: process.env.POKE_URL,
    supabasePublicKey: process.env.SUPABASE_PUBLIC_KEY,
    supabaseUrl: process.env.SUPABASE_URL,
  },
  android: {
    package: 'xyz.twelveproducts.poke',
  },
  ios: {
    bundleIdentifier: 'xyz.twelveproducts.poke',
  },
}
