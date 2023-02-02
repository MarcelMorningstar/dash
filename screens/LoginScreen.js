import React, { useRef, useState } from 'react'
import { StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, View } from 'react-native'

import { FirebaseRecaptchaVerifierModal, FirebaseRecaptchaBanner } from 'expo-firebase-recaptcha';
import { getAuth, PhoneAuthProvider, signInWithCredential } from "firebase/auth"
import app from '../firebase'

const auth = getAuth(app)

export default function LoginScreen() {
  const recaptchaVerifier = useRef(null)
  const [phoneNumber, setPhoneNumber] = useState()
  const [verificationId, setVerificationId] = useState()
  const [verificationCode, setVerificationCode] = useState()

  const [message, showMessage] = useState()

  if (!!verificationId) {
    return (
      <View style={styles.container}>
        <View style={{ width: '70%' }}>
          <Text style={{ textAlign: 'center', fontSize: 32, fontWeight: '600' }}>Verification Code</Text>
          <Text style={{ textAlign: 'center', fontSize: 16 }}>Please enter Code sent to {phoneNumber}</Text>

          <View style={styles.verifyContainer}>
            <TextInput
              editable={!!verificationId}
              placeholder="123456"
              onChangeText={setVerificationCode}
              style={styles.phoneNumberInput}
            />
            <TouchableHighlight 
              activeOpacity={0.9}
              underlayColor="#d39109"
              style={styles.btn}
              disabled={!verificationId}
              onPress={async () => {
                try {
                  const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
                  await signInWithCredential(auth, credential);
                  showMessage({ text: 'Phone authentication successful 👍' });
                } catch (err) {
                  showMessage({ text: `Error: ${err.message}`, color: 'red' });
                }
              }}
            >
              <Text style={styles.btnText}>Verify</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={app.options}
        attemptInvisibleVerification={true}
        title='Prove you are human!'
        cancelLabel='Close'
      />

      <View style={{ width: '70%' }}>
        <View style={styles.phoneContainer}>
          <TextInput 
            placeholder="Phone"
            autoCompleteType="tel"
            keyboardType="phone-pad"
            value={phoneNumber}
            textContentType="telephoneNumber"
            onChangeText={setPhoneNumber}
            style={styles.phoneNumberInput}
          />
          <TouchableHighlight 
            activeOpacity={0.9}
            underlayColor="#d39109"
            style={styles.btn}
            disabled={!phoneNumber}
            onPress={async () => {
              try {
                const phoneProvider = new PhoneAuthProvider(auth);
                const verificationId = await phoneProvider.verifyPhoneNumber(
                  phoneNumber,
                  recaptchaVerifier.current
                );
          
                setVerificationId(verificationId);
                showMessage({
                  text: 'Verification code has been sent to your phone.',
                });
              } catch (err) {
                showMessage({ text: `Error: ${err.message}`, color: 'red' });
              }
            }}
          >
            <Text style={styles.btnText}>Sign in</Text>
          </TouchableHighlight>
        </View>

        {message ? (
          <TouchableOpacity
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: 0xffffffee, justifyContent: 'center' },
            ]}
            onPress={() => showMessage(undefined)}>
            <Text
              style={{
                color: message.color || 'blue',
                fontSize: 17,
                textAlign: 'center',
                margin: 20,
              }}>
              {message.text}
            </Text>
          </TouchableOpacity>
        ) : undefined}
      </View>

      <FirebaseRecaptchaBanner 
        style={{
          position: 'absolute',
          bottom: 0,
          marginVertical: 16,
          marginHorizontal: 32
        }}
        textStyle={{ textAlign: 'center' }} 
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
  verifyContainer: {
    height: 100, 
    marginTop: 21, 
    justifyContent: "space-between"
  },
  phoneContainer: {
    height: 100,
    justifyContent: "space-between"
  },
  phoneNumberInput: {
    width: '100%',
    height: 44,
    paddingHorizontal: 12,
    backgroundColor: '#E7E7E7',
    borderRadius: 8
  },
  btn: {
    width: '100%',
    height: 44,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#F5AD17',
    borderRadius: 8
  },
  btnText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600'
  }
})