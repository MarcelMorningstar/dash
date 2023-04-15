import React, { useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Feather, FontAwesome, FontAwesome5, Ionicons, PrimaryView, SecondaryView, Text, TouchableHighlight } from '../components/Themed'

import Layout from '../components/Layout'
import SettingsSection from '../components/SettingsSection'
import Overlay from '../components/Overlay';
import Logout from '../components/Logout'

import { useSelector, useDispatch } from 'react-redux';
import { selectTheme, setTheme } from '../slices/authSlice';
import { PrimaryTouchableHighlight } from '../components/Themed';

export default function SettingsScreen({ navigation }) {
  const dispatch = useDispatch()
  const theme = useSelector(selectTheme)
  const [themeForm, setThemeForm] = useState(false)
  const [tempTheme, setTempTheme] = useState(theme)
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
            onPress={() => setThemeForm(true)}
          >
            <View style={styles.optionContainer}>
              <View style={styles.optionLabel}>
                <FontAwesome5 name="moon" size={24} style={styles.optionIcon} />
                <Text style={styles.optionText}>Theme</Text>
              </View>
              <Text style={styles.optionText}>{ theme }</Text>
              <Overlay visible={themeForm}>
                <SecondaryView style={[styles.modalView, styles.column, { width: '60%' }]}>
                  <View style={{ marginBottom: 20 }}>
                    <TouchableOpacity style={styles.themeBtn} onPress={() => setTempTheme('automatic')}>
                      <View style={[styles.row, { justifyContent: 'space-between', alignItems: 'center' }]}>
                        <View style={[styles.row, { alignItems: 'center' }]}>
                          <View style={{ width: 36, alignItems: 'center', marginRight: 8 }}><FontAwesome name="mobile" size={36} /></View>
                          <Text style={{ fontSize: 14 }}>Automatic</Text>
                        </View>
                        {
                          tempTheme == 'automatic' && <PrimaryView style={styles.circle} />
                        }
                      </View>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.themeBtn} onPress={() => setTempTheme('light')}>
                      <View style={[styles.row, { justifyContent: 'space-between', alignItems: 'center' }]}>
                        <View style={[styles.row, { alignItems: 'center' }]}>
                          <View style={{ width: 36, alignItems: 'center', marginRight: 8 }}><Feather name="sun" size={28} /></View>
                          <Text style={{ fontSize: 14 }}>Light</Text>
                        </View>
                        {
                          tempTheme == 'light' && <PrimaryView style={styles.circle} />
                        }
                      </View>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.themeBtn} onPress={() => setTempTheme('dark')}>
                      <View style={[styles.row, { justifyContent: 'space-between', alignItems: 'center' }]}>
                        <View style={[styles.row, { alignItems: 'center' }]}>
                          <View style={{ width: 36, alignItems: 'center', marginRight: 8 }}><Feather name="moon" size={28} /></View>
                          <Text style={{ fontSize: 14 }}>Dark</Text>
                        </View>
                        {
                          tempTheme == 'dark' && <PrimaryView style={styles.circle} />
                        }
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={[styles.row]}>
                    <PrimaryTouchableHighlight
                      style={[styles.button, { marginRight: 4 }]}
                      onPress={() => { setStorageTheme(tempTheme); setThemeForm(false)}}
                    >
                      <Text style={{ color: 'white', fontWeight: '500' }}>Save</Text>
                    </PrimaryTouchableHighlight>
                    <TouchableOpacity
                      style={[styles.button, { marginLeft: 4, backgroundColor: '#F0F0F0' }]}
                      onPress={() => setThemeForm(false)}
                    >
                        <Text style={{ color: 'black', fontWeight: '500' }}>Back</Text>
                    </TouchableOpacity>
                  </View>
                </SecondaryView>
              </Overlay>
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
  row: {
    display: 'flex',
    flexDirection: 'row'
  },
  column: {
    display: 'flex',
    flexDirection: 'column'
  },
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
  },
  modalView: {
    padding: 20,
    borderRadius: 21,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  themeBtn: {
    height: 44, 
    paddingHorizontal: 8, 
    justifyContent: 'center'
  },
  circle: {
    width: 21,
    height: 21,
    backgroundColor: 'transparant',
    borderWidth: 5,
    borderRadius: 12,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16
  }
})