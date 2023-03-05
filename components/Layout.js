import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Ionicons, SafeAreaView, Text, TouchableHighlight } from './Themed'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function Layout({ navigation, backScreen, children, title }) {
  const insets = useSafeAreaInsets()

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: insets.top }}>
      <View style={styles.head}>
        <TouchableHighlight
          activeOpacity={0.6}
          style={styles.back}
          onPress={() => { 
            backScreen ? navigation.navigate(backScreen) : navigation.goBack() 
          }}
        >
          <Ionicons name="arrow-back" size={32} />
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