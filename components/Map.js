import React, { useEffect, useState } from 'react'
import { StyleSheet, Appearance } from 'react-native'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'

import MapColor from '../constants/Map'

import { useSelector } from 'react-redux'
import { selectTheme } from '../slices/authSlice'

export default function Map({ children, mapRef, origin, directionsView, userLocationChange, insets }) {
  const storageTheme = useSelector(selectTheme)
  const [theme, setTheme] = useState(storageTheme === 'automatic' ? Appearance.getColorScheme() : storageTheme);

  useEffect(() => {
    if (storageTheme !== 'automatic') {
      setTheme(storageTheme)
    } else {
      setTheme(Appearance.getColorScheme())
    }
  }, [storageTheme])

  Appearance.addChangeListener((T) => {
    if (storageTheme === 'automatic') {
      setTheme(T.colorScheme)
    }
  })

  return (
    <MapView
      ref={mapRef}
      initialRegion={{
        latitude: origin.latitude,
        longitude: origin.longitude,
        latitudeDelta: 0.018,
        longitudeDelta: 0.012,
      }}
      provider={PROVIDER_GOOGLE}
      showsUserLocation={!directionsView}
      onUserLocationChange={coordinate => userLocationChange(coordinate)}
      showsMyLocationButton={false}
      rotateEnabled={false}
      pitchEnabled={false}
      mapType='mutedStandard'
      mapPadding={{
        top: insets.top,
        bottom: 12
      }}
      customMapStyle={MapColor[theme]}
      style={styles.map}
    >
      { children }
    </MapView>
  )
}

const styles = StyleSheet.create({
  map: {
    flex: 1
  }
})