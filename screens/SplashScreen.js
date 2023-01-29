import React, { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import * as Location from 'expo-location';

import { useDispatch } from 'react-redux'
import { setOrigin } from '../slices/mainSlice';
import { setIsLoading, setUserToken } from '../slices/authSlice';

import { getAuth, onAuthStateChanged } from "firebase/auth"
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

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()

      if (status !== 'granted') {
        console.log('Permission to access location was denied')
        return
      }

      let location = await Location.getCurrentPositionAsync({})

      dispatch(setOrigin(location))
    })()
  }, [])

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