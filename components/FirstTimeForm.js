import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import { PrimaryTouchableHighlight, View, Text, TextInput } from './Themed'

import Overlay from './Overlay'

import { useDispatch } from 'react-redux'
import { setUserInfo } from '../slices/authSlice'

import { doc, setDoc } from "firebase/firestore"; 
import { auth, firestore } from '../firebase'

export default function FirstTimeForm({ userToken }) {
  const dispatch = useDispatch()
  const [displayName, setDisplayName] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')

  const saveProfile = async () => {
    await setDoc(doc(firestore, "users", userToken), {
      displayName: displayName,
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: auth.currentUser.phoneNumber,
      photoURL: auth.currentUser.photoURL,
      addresses: {},
      paymentMethod: 'cash'
    }).then(() => {
      dispatch(setUserInfo({
        displayName: displayName,
        firstName: firstName,
        lastName: lastName,
        phoneNumber: auth.currentUser.phoneNumber,
        email: email,
        photoURL: auth.currentUser.photoURL,
        thumbnail: auth.currentUser.photoURL,
        addresses: {},
        paymentMethod: 'cash'
      }))
    })
  }

  return (
    <Overlay visible={true}>
      <View style={styles.modalView}>
        <Text style={styles.title}>Welcome</Text>

        <View style={styles.inputConatiner}>
          <TextInput 
            placeholder='Display Name'
            onChangeText={setDisplayName}
            value={displayName}
            style={styles.input}
          />
          <TextInput 
            placeholder='First Name'
            onChangeText={setFirstName}
            value={firstName}
            style={styles.input}
          />
          <TextInput 
            placeholder='Last Name'
            onChangeText={setLastName}
            value={lastName}
            style={styles.input}
          />
          <TextInput 
            placeholder='Email'
            onChangeText={setEmail}
            value={email}
            style={styles.input}
          />
        </View>

        <PrimaryTouchableHighlight
          style={styles.btn}
          onPress={() => {
            if (displayName.lenght < 2) {
              return
            }

            if (firstName.lenght < 2) {
              return
            }

            if (lastName.lenght < 2) {
              return
            }

            saveProfile()
          }}
        >
          <Text style={styles.btnText}>Join us</Text>
        </PrimaryTouchableHighlight>
      </View>
    </Overlay>
  )
}

const styles = StyleSheet.create({
  modalView: {
    width: '70%',
    padding: 20,
    borderRadius: 21,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    textAlign: 'center',
    fontSize: 21
  },
  inputConatiner: {
    marginTop: 8,
    marginBottom: 16
  },
  input: {
    width: '100%',
    height: 48,
    marginVertical: 4,
    paddingHorizontal: 16,
    fontSize: 16,
    borderRadius: 12
  },
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    borderRadius: 12
  },
  btnText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white'
  }
})