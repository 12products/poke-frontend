import { CardField, useConfirmPayment } from '@stripe/stripe-react-native'
import { Alert, ScrollView, TextInput, Button } from 'react-native'
import { useState } from 'react'

import { POKE_URL } from '../../constants'

export default function SettingsScreen() {
  const [name, setName] = useState('')
  const { confirmPayment, loading } = useConfirmPayment()

  const handleSubscribePress = async () => {
    Alert.alert('hello')
    return
    const response = await fetch(`${POKE_URL}/stripe/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentMethodType: 'card',
        currency: 'usd',
      }),
    })

    const { clientsecret } = await response.json()

    const { error, paymentIntent } = await confirmPayment(clientsecret, {
      type: 'Card',
      setupFutureUsage: 'OffSession',
      billingDetails: { name },
    })

    if (error) {
      Alert.alert(`Error code: ${error?.code}`)
    } else if (paymentIntent) {
      Alert.alert('Succes', `Payment successful: ${paymentIntent}`)
    }
  }

  return (
    <ScrollView>
      <TextInput
        autoCapitalize="none"
        placeholder="Name"
        keyboardType="name-phone-pad"
        onChangeText={(value: string) => setName(value)}
      />
      <CardField
        postalCodeEnabled={true}
        placeholder={{ number: '4242 4242 4242 4242' }}
        cardStyle={{
          backgroundColor: '#FFFFFF',
          textColor: '#000000',
        }}
        style={{ width: '100%', height: 50, marginVertical: 30 }}
        onCardChange={(cardDetails) => {
          console.log({ cardDetails })
        }}
        onFocus={(focusedField) => {
          console.log({ focusedField })
        }}
      />
      <Button
        title="Subscribe"
        onPress={handleSubscribePress}
        disabled={loading}
      />
    </ScrollView>
  )
}
