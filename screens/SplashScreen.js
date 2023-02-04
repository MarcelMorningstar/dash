import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, View } from 'react-native'

import * as Location from 'expo-location';

import { useDispatch } from 'react-redux'
import { setOrigin } from '../slices/mainSlice';
import { setIsLoading, setUserInfo, setUserToken } from '../slices/authSlice';

import { getAuth, onAuthStateChanged } from "firebase/auth"
import { getFirestore, doc, getDoc } from "firebase/firestore"
import { getDownloadURL, getStorage, ref } from "firebase/storage"
import app from '../firebase'

const auth = getAuth(app)
const database = getFirestore(app)
const storage = getStorage(app)

export default function SplashScreen() {
  const [isLocated, setIsLocated] = useState(false)
  const [isAuth, setIsAuth] = useState(false)
  const [notAuth, setNotAuth] = useState(false)
  const dispatch = useDispatch()

  const readUserData = async (userToken) => {
    const docSnap = await getDoc(doc(database, "users", userToken))
    let image = null

    try {
      image = await getDownloadURL(ref(storage, `users/${userToken}.jpg`))
    } catch(e) {  }

    dispatch(setUserInfo({
      ...docSnap.data(),
      image: image,
    }))

    setIsAuth(true)
  };

  onAuthStateChanged(auth, (user) => {
    if (user) {
      dispatch(setUserToken(user.uid))
      readUserData(user.uid)
    } else {
      dispatch(setUserToken(null))
      dispatch(setUserInfo({}))
      setNotAuth(true)
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

      dispatch(setOrigin({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      }))

      setIsLocated(true)
    })()
  }, [])

  useEffect(() => {
    if (isLocated && (isAuth || notAuth)) {
      dispatch(setIsLoading(false))
    }
  }, [isLocated, isAuth, notAuth])
  
  return (
    <View style={styles.container}>
      <Image 
        style={{
          width: '40%',
          resizeMode: 'contain'
        }}
        source={require("../assets/logo.png")}
      />
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