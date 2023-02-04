import React, { useEffect, useRef, useState } from 'react'
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'

import SlideInMenu from '../components/SlideInMenu'

import { useSelector, useDispatch } from 'react-redux'
import { selectDestination, selectOrigin, setDestination, setOrigin } from '../slices/mainSlice'
import { selectUserToken } from '../slices/authSlice'

import { getDatabase, ref, set } from "firebase/database"
import app from '../firebase'

import { GOOGLE_API_KEY } from '@env'

export default function HomeScreen() {
  const insets = useSafeAreaInsets()
  const mapRef = useRef(null)
  const childRef = useRef(null)
  const [directionsView, setDirectionsView] = useState(false)
  const [destinationMenu, setDestinationMenu] = useState(false)
  const dispatch = useDispatch()
  const origin = useSelector(selectOrigin)
  const destination = useSelector(selectDestination)
  const userToken = useSelector(selectUserToken)

  useEffect(() => {
    writeUserLocationData(userToken, origin);
  }, [origin])
  
  function writeUserLocationData(userId, location) {
    const database = getDatabase(app);
    
    set(ref(database, 'users/' + userId), {
      location: location
    });
  }

  const userLocationChange = (coordinate) => {
    if (!destination) {
      dispatch(setOrigin({
        latitude: coordinate.nativeEvent.coordinate.latitude,
        longitude: coordinate.nativeEvent.coordinate.longitude
      }))
    }
  }

  const fitDerection = () => {
    childRef.current.close()
    
    setTimeout(() => {
      setDirectionsView(true)

      mapRef.current.fitToSuppliedMarkers(['origin', 'destination'], {
        edgePadding: {
          top: Platform.OS === "ios" ? 50 : 0,
          right: Platform.OS === "ios" ? 50 : 0,
          left: Platform.OS === "ios" ? 50 : 0,
          bottom: Platform.OS === "ios" ? 50 : 0,
        }
      })
    }, 100)
  }
  
  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.map}>
      <TouchableHighlight
        activeOpacity={0.6}
        underlayColor="#DDDDDD"
        style={{
          position: 'absolute',
          zIndex: 100,
          top: insets.top + 12,
          right: 16,
          justifyContent: 'center',
          alignItems: 'center',
          width: 50,
          height: 50,
          padding: 8,
          backgroundColor: 'white',
          borderRadius: 25,
          elevation: 7,
          shadowColor: 'black',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.25
        }}
        onPress={() => { 
          mapRef.current.animateToRegion({ 
            latitude: origin.latitude, 
            longitude: origin.longitude, 
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }, 1000)
        }}
      >
        <MaterialIcons name="my-location" size={25} color="black" />
      </TouchableHighlight>

      <MapView
        ref={mapRef}
        initialRegion={{
          latitude: origin.latitude,
          longitude: origin.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={!directionsView}
        onUserLocationChange={coordinate => userLocationChange(coordinate)}
        showsMyLocationButton={false}
        rotateEnabled={false}
        mapType='terrain'
        mapPadding={{
          top: insets.top
        }}
        style={styles.map}
      >
        {
          origin && destination && (
            <Marker 
              identifier='origin'
              coordinate={{
                latitude: origin.latitude,
                longitude: origin.longitude,
              }}
            />
          )
        }

        {
          origin && destination && (
            <Marker 
              identifier='destination'
              coordinate={{
                latitude: destination.latitude,
                longitude: destination.longitude,
              }}
            />
          )
        }

        {
          origin && destination && (
            <MapViewDirections 
              origin={origin}
              destination={destination}
              apikey={GOOGLE_API_KEY}
              strokeWidth={4}
              strokeColor="black"
            />
          )
        }
      </MapView>

      <View style={styles.inputContainer}>
        <TouchableHighlight style={styles.inputField} onPress={ () => setDestinationMenu(true) }>
          <Text style={styles.text}>Destination</Text>
        </TouchableHighlight>
      </View>

      <SlideInMenu ref={childRef} title='Your ride' size={320} open={destinationMenu} setOpen={setDestinationMenu}>
        <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            height: 44,
            marginVertical: 4,
            paddingHorizontal: 12,
            backgroundColor: '#D7D7D7',
            borderRadius: 12
          }}
        >
          <Text style={{ fontSize: 18 }}>My Location</Text>
        </View>

        <GooglePlacesAutocomplete 
          placeholder='Type in your destination'
          nearbyPlacesAPI='GooglePlacesSearch'
          query={{
            key: GOOGLE_API_KEY,
            language: 'en',
          }}
          fetchDetails={true}
          minLength={2}
          styles={{
            container: {
              flex: 0,
              marginVertical: 4,
            },
            textInput: {
              fontSize: 18,
              backgroundColor: '#FFF',
              borderRadius: 12
            },
            listView: {
              height: 130
            }
          }}
          enablePoweredByContainer={false}
          onPress={(data, details = null) => {
            dispatch(setDestination({
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng
            }))
      
            fitDerection()
          }}
        />
      </SlideInMenu>
    </KeyboardAvoidingView>
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