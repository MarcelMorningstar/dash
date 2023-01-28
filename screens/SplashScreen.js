import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { useDispatch } from 'react-redux'
import { setIsLoading, setUserToken } from '../slices/authSlice';

import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth"
import app from '../firebase'

export default function SplashScreen() {
  const dispatch = useDispatch()
  const auth = getAuth(app)

  onAuthStateChanged(auth, (user) => {
    if (user) {
      dispatch(setIsLoading(false))
      dispatch(setUserToken(user.uid))
    } else {
      dispatch(setIsLoading(false))
      dispatch(setUserToken(null))
    }
  });

  return (
    <View style={styles.container}>
      <Text>SplashScreen</Text>
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
})