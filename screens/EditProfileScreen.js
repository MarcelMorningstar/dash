import React from 'react'
import { StyleSheet, Text } from 'react-native'
import Layout from '../components/Layout'

import { getFirestore, doc, updateDoc } from "firebase/firestore";
import app from '../firebase'

export default function EditProfileScreen({ navigation }) {
  // async function writeUserData(name) {
  //   const database = getFirestore(app)

  //   await updateDoc(doc(database, "users", userToken), {
  //     firstName: name
  //   })
  // }

  return (
    <Layout title='Edit Profile' navigation={navigation}>
      <Text>EditProfileScreen</Text>
    </Layout>
  )
}

const styles = StyleSheet.create({})