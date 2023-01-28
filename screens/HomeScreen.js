import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useSelector } from 'react-redux'
import { selectOrigin } from '../slices/mainSlice'
import MapView from 'react-native-maps'

export default function HomeScreen() {
  const origin = useSelector(selectOrigin)

  return (
    <View style={styles.container}>
      <MapView
        initialRegion={{
          latitude: origin.location.lat,
          longitude: origin.location.lng,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        mapType='mutedStandard'
        style={styles.map}
      >

      </MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    width: '100%',
    height: '100%'
  }
})