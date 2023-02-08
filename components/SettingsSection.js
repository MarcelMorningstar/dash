import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default function SettingsSection({ title, children }) {
  return (
    <View>
      <Text style={styles.title}>{title}</Text>
      <View>
        { children }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  title: {
    lineHeight: 32,
    paddingHorizontal: 12,
    fontSize: 17,
    fontWeight: '500',
    color: '#F5AD17',
    backgroundColor: '#555555'
  }
})