import React from 'react'
import { Marker } from 'react-native-maps'

export default function DriverMarker({ driver }) {
  return (
    <Marker
      identifier={driver.id}
      coordinate={{
        latitude: driver.location.latitude,
        longitude: driver.location.longitude,
      }}
      anchor={{ x: 0.5, y: 0.5 }}
      image={driver.available ? require('../assets/car.png') : require('../assets/InactiveCar.png')}
    />
  )
}
