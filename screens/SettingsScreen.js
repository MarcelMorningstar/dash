import { StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import React from 'react'

import { useDispatch } from 'react-redux'
import { setIsLoading, setUserToken } from '../slices/authSlice';

import { getAuth, signOut } from "firebase/auth";
import app from '../firebase'

export default function SettingsScreen() {
  const dispatch = useDispatch()
  const auth = getAuth(app);

  const handleSignOut = () => {
    signOut(auth).then(() => {
      dispatch(setIsLoading(false))
      dispatch(setUserToken(null))
    }).catch((error) => {
      console.log(error)
    });
  }

  return (
    <View>
      <TouchableHighlight onPress={ handleSignOut }>
        <Text>Log Out</Text>
      </TouchableHighlight>
    </View>
  )
}

const styles = StyleSheet.create({})