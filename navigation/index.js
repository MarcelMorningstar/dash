import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Ionicons, FontAwesome5, Feather } from '@expo/vector-icons';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import HistoryScreen from '../screens/HistoryScreen';
import PaymentScreen from '../screens/PaymentScreen';
import ProfileStackNavigator from './ProfileStackNavigator';
import SettingsScreen from '../screens/SettingsScreen';

import { useSelector } from 'react-redux';
import { selectIsLoading, selectUserToken } from '../slices/authSlice';

export default function Navigation() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  )
}

const Stack = createNativeStackNavigator()

function RootNavigator() {
  const isLoading = useSelector(selectIsLoading)
  const userToken = useSelector(selectUserToken)

  if (isLoading) {
    return <SplashScreen />
  }

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
        }}
      />
      <BottomTab.Screen
        name="Payment"
        component={PaymentScreen}
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="card-outline" color={color} size={30} style={{ marginBottom: -3 }} />,
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
        }}
      /> 
    </BottomTab.Navigator>
  )
}
