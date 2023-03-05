import React from 'react'
import { Marker } from 'react-native-maps'

export default function DriverMarker({ driver }) {
  return (
    <Marker
      identifier={driver.id}
      coordinate={{
        latitude: driver.data.location.latitude,
        longitude: driver.data.location.longitude,
      }}
      anchor={{ x: 0.5, y: 0.5 }}
      image={require('../assets/car.png')}
    />
  )
}
