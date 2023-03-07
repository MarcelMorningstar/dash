import React, { useEffect, useRef, useState } from 'react'
import { Image, Keyboard, KeyboardAvoidingView, Platform, StatusBar, StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import PhoneInput from "react-native-phone-number-input";

import * as Cellular from 'expo-cellular';

import { FirebaseRecaptchaVerifierModal, FirebaseRecaptchaBanner } from 'expo-firebase-recaptcha';
import { PhoneAuthProvider, signInWithCredential } from "firebase/auth"
import { app, auth } from '../firebase'

export default function LoginScreen() {
  const recaptchaVerifier = useRef(null)
  const [countryCode, setCountryCode] = useState(null)
  const [phoneNumber, setPhoneNumber] = useState()
  const [verificationId, setVerificationId] = useState()
  const [verificationCode, setVerificationCode] = useState()

  const [message, showMessage] = useState()

  useEffect(() => {
    (async () => {
      const cellular = await Cellular.getIsoCountryCodeAsync();

      setCountryCode(cellular.toUpperCase())
    })()
  }, [])

  if (!!verificationId) {
    return (
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.content}>
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
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    )
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={app.options}
        attemptInvisibleVerification={true}
        title='Prove you are human!'
        cancelLabel='Close'
      />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.content}>
          <Image 
            style={{
              flex: 4,
              width: '42%',
              resizeMode: 'contain'
            }}
            source={require("../assets/icon.png")}
          />
          
          <View style={{ flex: 6, width: '70%' }}>
            <View style={styles.phoneContainer}>
              {
                !!countryCode && (
                  <PhoneInput 
                    defaultCode={countryCode}
                    defaultValue={phoneNumber}
                    onChangeFormattedText={(text) => {
                      setPhoneNumber(text);
                    }}
                    containerStyle={{
                      width: '100%',
                      borderRadius: 8
                    }}
                    textContainerStyle={{
                      backgroundColor: '#E7E7E7',
                      borderRadius: 8
                    }}
                  />
                )
              }
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
          
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flexGrow: 1, height: 1, marginRight: 12, backgroundColor: '#888888' }} />
          
              <Text 
                style={{ 
                  marginVertical: 30, 
                  fontSize: 13, 
                  fontWeight: '300', 
                  color: '#555555', 
                  textTransform: 'uppercase' 
                }}
              >
                Or sign in with
              </Text>
          
              <View style={{ flexGrow: 1, height: 1, marginLeft: 12, backgroundColor: '#888888' }} />
            </View>
          
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
              <TouchableHighlight 
                activeOpacity={0.9}
                underlayColor="#DDDDDD"
                style={styles.socialBtn}
                onPress={() => {}}
              >
                <Image 
                  style={styles.socialImage}
                  source={require("../assets/google.png")}
                />
              </TouchableHighlight>
          
              <TouchableHighlight 
                activeOpacity={0.9}
                underlayColor="#DDDDDD"
                style={styles.socialBtn}
                onPress={() => {}}
              >
                <Image 
                  style={styles.socialImage}
                  source={require("../assets/facebook.png")}
                />
              </TouchableHighlight>
            </View>
          </View>

          <FirebaseRecaptchaBanner 
            style={{
              position: 'relative',
              bottom: 0,
              marginVertical: 24,
              marginHorizontal: 32
            }}
            textStyle={{ textAlign: 'center' }} 
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%', 
    height: '100%',
    paddingTop: StatusBar.currentHeight + 12,
    backgroundColor: '#F5F5F5'
  },
  verifyContainer: {
    height: 100, 
    marginTop: 21, 
    justifyContent: "space-between"
  },
  phoneContainer: {
    height: 116,
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
  },
  socialBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
    marginHorizontal: 10,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 35,
    elevation: 4,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25
  },
  socialImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain'
  }
})