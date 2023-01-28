import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import { useSelector } from 'react-redux'
import { selectOrigin } from '../slices/mainSlice'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'

export default function HomeScreen() {
  const [loading, setLoading] = useState(true)

  const origin = useSelector(selectOrigin)

  useEffect(() => {
    if (origin) {
      setLoading(false)
    }

    console.log(origin)
  }, [origin])

  if (loading) {
    return <Text>Loading...</Text>
  }

  return (
    <View style={styles.container}>
      <MapView
        initialRegion={{
          latitude: origin.coords.latitude,
          longitude: origin.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
        mapType='mutedStandard'
        style={styles.map}
      >

      </MapView>

      <View style={styles.inputContainer}>
        <TouchableHighlight style={styles.inputField}>
          <Text style={styles.text}>Destination</Text>
        </TouchableHighlight>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    flex: 1
  },
  inputContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 32,
    alignItems: 'center',
  },
  inputField: {
    justifyContent: 'center',
    width: '80%',
    height: 50,
    paddingHorizontal: 12,
    backgroundColor: "#FFF",
    borderRadius: 16,
    elevation: 4,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25
  },
  text: {
    fontSize: 18,
    color: 'rgba(0, 0, 0, .4)'
  }
})