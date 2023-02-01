import React, { useEffect, useState } from 'react'
import { Button, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import Layout from '../components/Layout'

import { useSelector } from 'react-redux';
import { selectUserToken } from '../slices/authSlice';

import { getFirestore, doc, getDoc } from "firebase/firestore";
import app from '../firebase'

export default function ProfileScreen({ navigation }) {
  const [data, setData] = useState({})
  const userToken = useSelector(selectUserToken)

  const readUserData = async () => {
    const database = getFirestore(app)
    const docRef = doc(database, "users", userToken)
    const docSnap = await getDoc(docRef)

    const a = docSnap.data()

    console.log(a.firstName)

    setData(docSnap.data())
  };

  useEffect(() => {
    readUserData()
  }, [])

  return (
    <Layout title='Profile' navigation={navigation}>
      <TouchableHighlight
        activeOpacity={0.6}
        underlayColor="#DDDDDD"
        style={styles.edit}
        onPress={() => navigation.navigate('EditProfile')}
      >
        <MaterialIcons name="edit" size={28} color='black' />
      </TouchableHighlight>

      <View>
        <Image
          // style={}
          source={{
            uri: '',
          }}
        />
        <Text>{ data.firstName + ' ' + data.lastName }</Text>
      </View>
    </Layout>
  )
}

const styles = StyleSheet.create({
  edit: {
    position: 'absolute',
    top: 8,
    right: 12,
    padding: 8,
    borderRadius: 32
  }
})