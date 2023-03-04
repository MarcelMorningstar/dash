import React, { useState } from 'react'
import { Image, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import { MaterialIcons, MaterialCommunityIcons, FontAwesome5, Feather, AntDesign, Ionicons } from '@expo/vector-icons'

import Layout from '../components/Layout'
import Logout from '../components/Logout'
import SectionLine from '../components/SectionLine'
import ButtonLine from '../components/ButtonLine'

import { useSelector } from 'react-redux'
import { selectUserInfo } from '../slices/authSlice'

export default function ProfileScreen({ navigation }) {
  const data = useSelector(selectUserInfo);
  const [logout, setLogout] = useState(false);

  return (
    <Layout title='Profile' navigation={navigation} backScreen='Home'>
      <View style={styles.container}>
        <TouchableHighlight
          activeOpacity={0.6}
          underlayColor="#DDDDDD"
          style={styles.edit}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <MaterialIcons name="edit" size={28} color='black' />
        </TouchableHighlight>

        <View style={styles.picContainer}>
          {
            !!data.image ?
              <Image
                source={{
                  uri: data.thumbnail,
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  resizeMode: 'cover',
                  borderRadius: 48
                }}
              />
            :
              <FontAwesome5 name="user-alt" size={32} color="#555555" />
          }
        </View>

        <Text style={styles.name}>{ data.name }</Text>

        <View style={styles.fieldContainer}>
          <View style={styles.field}>
            <MaterialIcons 
              name="smartphone" 
              size={30} 
              color='black' 
              style={{ marginRight: 12 }} 
            />
            <Text style={styles.textField}>{ data.phone }</Text>
          </View>
          {
            !!data.email && 
            <View style={styles.field}>
              <MaterialCommunityIcons 
                name="email-outline" 
                size={30} 
                color='black' 
                style={{ marginRight: 12 }} 
              />
              <Text style={styles.textField}>{ data.email }</Text>
            </View>
          }
        </View>

        <SectionLine />

        <View style={styles.fieldContainer}>
          <Text style={{ marginBottom: 8, fontSize: 15, fontWeight: '500' }}>My locations</Text>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => {}}
          >
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <AntDesign name="home" size={28} color="black" style={{ marginRight: 12 }} />
              <Text style={{ fontSize: 14 }}>Enter home location</Text>
            </View>
          </TouchableOpacity>

          <ButtonLine />

          <TouchableOpacity
            style={styles.btn}
            onPress={() => {}}
          >
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="briefcase-outline" size={28} color="black" style={{ marginRight: 12 }} />
              <Text style={{ fontSize: 14 }}>Enter work location</Text>
            </View>
          </TouchableOpacity>
        </View>

        <SectionLine />
        
        <View style={styles.fieldContainer}>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => setLogout(true)}
          >
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Feather name="log-out" size={28} style={{ marginRight: 12 }} />
              <Text style={{ fontSize: 14 }}>Log out</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <Logout visible={logout} setVisible={setLogout} />
    </Layout>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  picContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 96,
    height: 96,
    backgroundColor: '#DDDDDD',
    borderRadius: 48
  },
  name: {
    marginVertical: 5,
    fontSize: 24,
    fontWeight: '600'
  },
  fieldContainer: {
    width: '85%',
    marginVertical: 16
  },
  field: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    paddingHorizontal: 8,
  },
  textField: {
    fontSize: 14,
    fontWeight: '400'
  },
  edit: {
    position: 'absolute',
    top: -52,
    right: 12,
    padding: 8,
    borderRadius: 32
  },
  btn: {
    height: 44, 
    paddingHorizontal: 8, 
    justifyContent: 'center'
  }
})