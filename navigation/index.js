import React from "react";
import * as SplashScreen from "expo-splash-screen";
import * as Location from 'expo-location';
import * as FileSystem from 'expo-file-system';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Ionicons, FontAwesome5, Feather } from '@expo/vector-icons';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import HistoryScreen from '../screens/HistoryScreen';
import PaymentScreen from '../screens/PaymentScreen';
import ProfileStackNavigator from './ProfileStackNavigator';
import SettingsScreen from '../screens/SettingsScreen';

import { useDispatch, useSelector } from 'react-redux';
import { selectUserToken, setUserInfo, setUserToken } from '../slices/authSlice';
import { setOrigin } from '../slices/mainSlice';

import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from "firebase/firestore";
import { auth, firestore } from '../firebase';

export default function Navigation() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  )
}

const Stack = createNativeStackNavigator()

function RootNavigator() {
  const dispatch = useDispatch()
  const userToken = useSelector(selectUserToken)

  onAuthStateChanged(auth, (user) => {
    (async () => {
      if (user) {
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

        const docSnap = await getDoc(doc(firestore, "users", user.uid))
        const fileUri = FileSystem.documentDirectory + "photo";
        
        FileSystem.downloadAsync(user.photoURL, fileUri)

        dispatch(setUserInfo({
          name: user.displayName,
          firstName: docSnap.data().firstName,
          lastName: docSnap.data().lastName,
          phone: user.phoneNumber,
          email: docSnap.data().email,
          image: user.photoURL,
          thumbnail: fileUri
        }))

        dispatch(setUserToken(user.uid))
      } else {
        dispatch(setUserToken(null))
      }

      await SplashScreen.hideAsync();
    })()
  });

  return (
    <Stack.Navigator>
      {
        userToken == null ? (
          <Stack.Screen name="SignIn" component={LoginScreen} options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
        )
      }
      
      {/* <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} /> */}
    </Stack.Navigator>
  )
}

const BottomTab = createBottomTabNavigator()

function BottomTabNavigator() {
  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      backBehavior='history'
      screenOptions={{
        tabBarShowLabel: false,
      }}>
      <BottomTab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarIcon: ({ color }) => <FontAwesome5 name="history" color={color} size={24} style={{ marginBottom: -3 }} />,
          headerShown: false,
          unmountOnBlur: true
        }}
      />
      <BottomTab.Screen
        name="Payment"
        component={PaymentScreen}
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="card-outline" color={color} size={30} style={{ marginBottom: -3 }} />,
          headerShown: false,
        }}
      />
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="car-outline" color={color} size={40} style={{ marginBottom: -3 }} />,
          headerShown: false
        }}
      />
      <BottomTab.Screen
        name="ProfileStackNavigator"
        component={ProfileStackNavigator}
        options={{
          tabBarIcon: ({ color }) => <Feather name="user" color={color} size={30} style={{ marginBottom: -3 }} />,
          headerShown: false
        }}
      />
      <BottomTab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="settings-outline" color={color} size={30} style={{ marginBottom: -3 }} />,
          headerShown: false
        }}
      /> 
    </BottomTab.Navigator>
  )
}
