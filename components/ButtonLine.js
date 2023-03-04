import { StyleSheet, View } from 'react-native'
import React from 'react'

export default function ButtonLine() {
  return <View style={styles.line} />
}

const styles = StyleSheet.create({
  line: {
    width: '100%', 
    height: 1.4, 
    backgroundColor: '#DDDDDD',
    borderRadius: 4
  }
})