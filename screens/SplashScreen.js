import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import * as Location from 'expo-location';

import { useDispatch } from 'react-redux'
import { setOrigin } from '../slices/mainSlice';
import { setIsLoading, setUserToken } from '../slices/authSlice';

import { getAuth, onAuthStateChanged } from "firebase/auth"
import app from '../firebase'

const auth = getAuth(app)

export default function SplashScreen() {
  const [isLocated, setIsLocated] = useState(false)
  const [isAuth, setIsAuth] = useState(false)
  const dispatch = useDispatch()

  onAuthStateChanged(auth, (user) => {
    if (user) {
      dispatch(setUserToken(user.uid))
    } else {
      dispatch(setUserToken(null))
    }

    setIsAuth(true)
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()

      if (status !== 'granted') {
        console.log('Permission to access location was denied')
        return
      }

      let location = await Location.getCurrentPositionAsync({})

      dispatch(setOrigin({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      }))

      setIsLocated(true)
    })()
  }, [])

  useEffect(() => {
    if (isLocated && isAuth) {
      dispatch(setIsLoading(false))
    }
  }, [isLocated, isAuth])
  
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