import 'dotenv/config'

export default {
  name: 'poke-frontend',
  version: '1.0.0',
  extra: {
    pokeUrl: process.env.POKE_URL,
    supabaseKey: process.env.SUPABASE_PUBLIC_KEY,
    supabaseUrl: process.env.SUPABASE_URL,
  },
}
