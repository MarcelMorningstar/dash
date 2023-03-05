import React from 'react'
import { StyleSheet } from 'react-native'
import { Div } from './Themed'

export default function ButtonLine() {
  return <Div style={styles.line} />
}

const styles = StyleSheet.create({
  line: {
    width: '100%', 
    height: 1.4, 
    borderRadius: 4
  }
})