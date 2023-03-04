import React from 'react'
import { StyleSheet, View } from 'react-native'

export default function SectionLine() {
  return <View style={styles.line} />
}

const styles = StyleSheet.create({
  line: {
    width: '100%',
    height: 5,
    backgroundColor: '#DDDDDD'
  }
})