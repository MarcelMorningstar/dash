import React, { useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView, StyleSheet, View } from 'react-native'
import { Feather, FontAwesome5, Ionicons, Text, TouchableHighlight } from '../components/Themed'

import Layout from '../components/Layout'
import SettingsSection from '../components/SettingsSection'
import Logout from '../components/Logout'

import { useSelector, useDispatch } from 'react-redux';
import { selectTheme, setTheme } from '../slices/authSlice';

export default function SettingsScreen({ navigation }) {
  const dispatch = useDispatch()
  const theme = useSelector(selectTheme)
  const [logout, setLogout] = useState(false)

  const setStorageTheme = async (value) => {
    try {
      await AsyncStorage.setItem('theme', value)
      dispatch(setTheme(value))
    } catch(e) {

    }
  }

  return (
    <Layout title='Settings' navigation={navigation} backScreen='Home'>
      <ScrollView>
        <SettingsSection title='Preferences'>
          <TouchableHighlight 
            activeOpacity={0.6}
            style={styles.option}
            onPress={() => {}}
          >
            <View style={styles.optionContainer}>
              <View style={styles.optionLabel}>
                <Ionicons name="language" size={24} style={styles.optionIcon} />
                <Text style={styles.optionText}>Language</Text>
              </View>
              <Text style={styles.optionText}>Value</Text>
            </View>
          </TouchableHighlight>

          <TouchableHighlight 
            activeOpacity={0.6}
            style={styles.option}
            onPress={() => setStorageTheme('automatic')}
          >
            <View style={styles.optionContainer}>
              <View style={styles.optionLabel}>
                <FontAwesome5 name="moon" size={24} style={styles.optionIcon} />
                <Text style={styles.optionText}>Theme</Text>
              </View>
              <Text style={styles.optionText}>{ theme }</Text>
            </View>
          </TouchableHighlight>
        </SettingsSection>

        <SettingsSection title='Account Action'>
          <TouchableHighlight 
            activeOpacity={0.6}
            style={styles.option}
            onPress={() => navigation.navigate('ProfileStackNavigator', { screen: 'EditProfile' })}
          >
            <View style={styles.optionLabel}>
              <FontAwesome5 name="user-circle" size={24} style={styles.optionIcon} />
              <Text style={styles.optionText}>Edit Profile</Text>
            </View>
          </TouchableHighlight>

          <TouchableHighlight 
            activeOpacity={0.6}
            style={styles.option}
            onPress={() => {}}
          >
            <View style={styles.optionLabel}>
              <FontAwesome5 name="history" size={24} style={styles.optionIcon} />
              <Text style={styles.optionText}>Clear Ride History</Text>
            </View>
          </TouchableHighlight>

          <TouchableHighlight 
            activeOpacity={0.6}
            style={styles.option}
            onPress={() => setLogout(true)}
          >
            <View style={styles.optionLabel}>
              <Feather name="log-out" size={24} style={styles.optionIcon} />
              <Text style={styles.optionText}>Log Out</Text>
              <Logout visible={logout} setVisible={setLogout} />
            </View>
          </TouchableHighlight>
        </SettingsSection>
      </ScrollView>
    </Layout>
  )
}

const styles = StyleSheet.create({
  option: {
    justifyContent: 'center',
    width: '100%',
    height: 48,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD'
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  optionLabel: {
    flexDirection: 'row'
  },
  optionIcon: {
    marginRight: 8
  },
  optionText: {
    fontSize: 16,
    textTransform: 'capitalize'
  }
})