import React from 'react'
import { StyleSheet, Appearance } from 'react-native'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'

import MapColor from '../constants/Map'

export default function Map({ children, mapRef, origin, directionsView, destinationMenu, userLocationChange, insets }) {
  const theme = Appearance.getColorScheme();

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
        bottom: destinationMenu ? 330 : 0,
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