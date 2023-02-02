import React from 'react'
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'
import Layout from '../components/Layout'

import { useSelector } from 'react-redux'
import { selectUserInfo } from '../slices/authSlice'

export default function ProfileScreen({ navigation }) {
  const data = useSelector(selectUserInfo);

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

      <View style={styles.container}>
        {/* <Image
          // style={}
          source={{
            uri: '',
          }}
        /> */}
        <Text style={styles.name}>{ data.firstName + ' ' + data.lastName }</Text>

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
      </View>
    </Layout>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  name: {
    fontSize: 20,
    fontWeight: '600'
  },
  fieldContainer: {
    width: '82%',
    marginVertical: 20
  },
  field: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5
  },
  textField: {
    fontSize: 14,
    fontWeight: '400'
  },
  edit: {
    position: 'absolute',
    top: 8,
    right: 12,
    padding: 8,
    borderRadius: 32
  }
})