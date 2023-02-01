import React from 'react'
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export default function Layout({ navigation, children, title }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.head}>
        <TouchableHighlight
          activeOpacity={0.6}
          underlayColor="#DDDDDD"
          style={styles.back}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={32} color='black' />
        </TouchableHighlight>
        <Text style={styles.title}>{ title }</Text>
      </View>

      { children }
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    marginTop: StatusBar.currentHeight
  },
  head: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    marginHorizontal: 16
  },
  back: {
    padding: 5,
    borderRadius: 32
  },
  title: {
    fontSize: 21,
    fontWeight: '600',
    marginLeft: 16
  }
})