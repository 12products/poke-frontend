import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'
// import { SUPABASE_URL, SUPABASE_PUBLIC_KEY } from '@env'

const supabase = createClient("https://gzhjlacqlfiynevglhlf.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MTI1MDEzMSwiZXhwIjoxOTU2ODI2MTMxfQ.H2e0Mpl21Mik8T43e1lVpdP9Hn81FxdzlOELRYlomTg", {
    localStorage: AsyncStorage,
    detectSessionInUrl: false
})

export { supabase };
