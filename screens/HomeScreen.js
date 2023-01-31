import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'

import SlideInMenu from '../components/SlideInMenu'

import { useSelector, useDispatch } from 'react-redux'
import { selectOrigin, setOrigin } from '../slices/mainSlice'
import { selectUserToken } from '../slices/authSlice';

import { getDatabase, ref, set } from "firebase/database";
import app from '../firebase'

export default function HomeScreen() {
  const [destinationMenu, setDestinationMenu] = useState(false)
  const dispatch = useDispatch()
  const origin = useSelector(selectOrigin)
  const userToken = useSelector(selectUserToken)
  const insets = useSafeAreaInsets();

  useEffect(() => {
    writeUserLocationData(userToken, origin);
  }, [origin])
  
  function writeUserLocationData(userId, location) {
    const database = getDatabase(app);
    
    set(ref(database, 'users/' + userId), {
      location: location
    });
  }

  return (
    <View style={styles.map}>
      <MapView
        initialRegion={{
          latitude: origin.latitude,
          longitude: origin.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        provider={PROVIDER_GOOGLE}
        showsUserLocation
        onUserLocationChange={coordinate => dispatch(setOrigin({
          latitude: coordinate.nativeEvent.coordinate.latitude,
          longitude: coordinate.nativeEvent.coordinate.longitude
        }))}
        mapType='mutedStandard'
        mapPadding={{
          top: insets.top
        }}
        style={styles.map}
      >

      </MapView>

      <View style={styles.inputContainer}>
        <TouchableHighlight style={styles.inputField} onPress={ () => setDestinationMenu(true) }>
          <Text style={styles.text}>Destination</Text>
        </TouchableHighlight>
      </View>

      <SlideInMenu title='Your ride' open={destinationMenu} setOpen={setDestinationMenu}>
        <Text>Hello</Text>
      </SlideInMenu>
    </View>
  )
}

const styles = StyleSheet.create({
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