import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: 'green',
    padding: 10,
    margin: 10,
    borderRadius: 4,
    width: 200,
  },
  buttonTitle: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  textInput: {
    textTransform: 'uppercase',
    borderColor: 'black',
    borderStyle: 'solid',
    borderWidth: 0.2,
    fontWeight: 'bold',
    padding: 8,
    margin: 8,
    borderRadius: 4,
  },
  labelInput: { textTransform: 'uppercase', padding: 8 },
})
