import {
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native'

import { SettingsScreenNavigationProps } from '../../types'
import useIAP from '../../hooks/useIAP'
import useAuth from '../../hooks/useAuth'
import tw from '../../lib/tailwind'

function SettingsScreen({ navigation }: SettingsScreenNavigationProps) {
  const { purchaseSubscription, products, isProcessing } = useIAP()
  const { activeSubscription, logOut } = useAuth()

  return (
    <SafeAreaView style={tw`h-full flex justify-center`}>
      {products.length > 0 && (
        <View>
          {activeSubscription ? (
            <>
              <Text style={tw`text-6xl mb-2 text-center`}>🙏</Text>

              <Text
                style={tw`text-2xl uppercase font-bold px-4 mb-2 text-center`}
              >
                Thanks for the support!
              </Text>

              <TouchableOpacity
                style={tw`w-full bg-black min-h-28 flex justify-center`}
                activeOpacity={1}
                onPress={() => purchaseSubscription(products[0])}
              >
                {isProcessing ? (
                  <ActivityIndicator />
                ) : (
                  <Text
                    style={tw`text-4xl text-center font-bold uppercase p-2 text-white`}
                  >
                    Manage Subscription
                  </Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={tw`px-4`}>
                <Text style={tw`text-2xl uppercase font-bold mb-2 text-center`}>
                  Thanks for using poke!{' '}
                </Text>

                <Text style={tw`text-2xl mb-2 text-center`}>
                  If you want to support the development of this app, consider
                  subscribing to get unlimited reminders.
                </Text>

                <Text style={tw`text-2xl mb-2 text-center`}>
                  We know, another app with subscriptions. 🙄 But hey, it costs
                  less than a coffee.
                </Text>

                <Text style={tw`uppercase font-bold text-4xl text-center`}>
                  {products?.[0]?.price} per month
                </Text>
              </View>

              <TouchableOpacity
                style={tw`w-full bg-black mt-4 min-h-14 flex justify-center`}
                activeOpacity={1}
                onPress={() => purchaseSubscription(products[0])}
              >
                {isProcessing ? (
                  <ActivityIndicator />
                ) : (
                  <Text
                    style={tw`text-4xl text-center font-bold uppercase p-2 text-white`}
                  >
                    Subscribe
                  </Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>
      )}

      <TouchableOpacity
        style={tw`w-full bg-black mt-4`}
        activeOpacity={1}
        onPress={async () => {
          await logOut()
        }}
      >
        <Text
          style={tw`text-4xl text-center font-bold uppercase p-2 text-white`}
        >
          Logout
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default SettingsScreen
