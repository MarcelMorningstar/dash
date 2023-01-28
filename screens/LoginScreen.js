import React, { useState } from 'react'
import { StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native'

import { useDispatch } from 'react-redux'
import { setIsLoading, setUserToken } from '../slices/authSlice';

import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import app from '../firebase'

export default function LoginScreen() {
  const [phone, setPhone] = useState('')
  const dispatch = useDispatch()
  const auth = getAuth(app)

  function handleSignIn() {
    signInWithEmailAndPassword(auth, 'fake@gmail.com', '123456')
      .then((userCredential) => {
        const user = userCredential.user

        dispatch(setIsLoading(false))
        dispatch(setUserToken(user.uid))
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message

        dispatch(setIsLoading(false))
        dispatch(setUserToken(null))
      })
  }

  return (
    <View style={styles.container}>
      <TextInput 
        placeholder="Phone"
        keyboardType="phone-pad"
        value={phone}
        onChange={text => setPhone(text)}
      />
      <TouchableHighlight 
        activeOpacity={0.9}
        underlayColor="#d39109"
        style={styles.btn}
        onPress={ () => handleSignIn() }
      >
        <Text style={styles.btnText}>Sign in</Text>
      </TouchableHighlight>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5'
  },
  btn: {
    width: '70%',
    height: 42,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#F5AD17',
    borderRadius: 12
  },
  btnText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600'
  }
})