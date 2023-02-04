import React from 'react'
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function Layout({ navigation, children, title }) {
  const insets = useSafeAreaInsets()

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: insets.top, backgroundColor: '#F5F5F5' }}>
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