import React from 'react'
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native'

import { getAuth, signOut } from "firebase/auth";
import app from '../firebase'

const auth = getAuth(app);

export default function SettingsScreen() {
  const handleSignOut = () => {
    signOut(auth).then(() => {
      
    }).catch((error) => {
      console.log(error)
    });
  }

  return (
    <View>
      <TouchableHighlight onPress={handleSignOut}>
        <Text>Log Out</Text>
      </TouchableHighlight>
    </View>
  )
}

const styles = StyleSheet.create({})