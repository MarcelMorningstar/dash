import React, { useEffect, useRef, useState } from 'react'
import { PixelRatio, Platform, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'

import DriverMarker from '../components/DriverMarker'
import SlideInMenu from '../components/SlideInMenu'
import DestinationChoice from '../components/DestinationChoice'
import DestinationAcceptance from '../components/DestinationAcceptance'

import { useSelector, useDispatch } from 'react-redux'
import { selectDestination, selectOrigin, setOrigin } from '../slices/mainSlice'
import { selectUserInfo, selectUserToken } from '../slices/authSlice'

import { getFirestore, collection, query, where, onSnapshot } from "firebase/firestore";
import { getDatabase, ref, set } from "firebase/database"
import app from '../firebase'

import { GOOGLE_API_KEY } from '@env'

const BACKGROUND_FETCH_TASK = 'background-location-task';

const database = getFirestore(app);
const db = getDatabase(app);

export default function HomeScreen() {
  const insets = useSafeAreaInsets()
  const mapRef = useRef(null)
  const [directionsView, setDirectionsView] = useState(false)
  const [destinationMenu, setDestinationMenu] = useState(false)
  const [ordered, setOrdered] = useState(false)
  const [drivers, setDrivers] = useState([])
  const dispatch = useDispatch()
  const origin = useSelector(selectOrigin)
  const destination = useSelector(selectDestination)
  const userToken = useSelector(selectUserToken)
  const userInfo = useSelector(selectUserInfo)
  let userLoactionUpdateInterval = useRef();

  useEffect(() => {
    const q = query(collection(database, "drivers"), where("active", "==", true), where("available", "==", true));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const temp = [];

      querySnapshot.forEach((doc) => {
        if (distance(origin.latitude, doc.data().location.latitude, origin.longitude, doc.data().location.longitude) < 12) {
          temp.push({
            id: doc.id,
            data: doc.data()
          });
        }
      });

      setDrivers(temp)
    });

    return () => {
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (ordered) {
      updateUserLocation()

      userLoactionUpdateInterval.current = setInterval(() => {
        updateUserLocation()
      }, 5000)
    } else {
        clearInterval(userLoactionUpdateInterval.current)
        userLoactionUpdateInterval.current = null

        unregisterBackgroundFetchAsync()
    }
  }, [ordered])

  const writeUserLocationData = (userId, location) => {
    set(ref(db, 'users/' + userId), {
      location: location
    });
  }

  const updateUserLocation = async () => {
    const data = await Location.getCurrentPositionAsync({})

    const location = {
      latitude: data.coords.latitude,
      longitude: data.coords.longitude
    }
    console.log(location)

    writeUserLocationData(userToken, location)
  }

  TaskManager.defineTask(BACKGROUND_FETCH_TASK, () => {
    updateUserLocation()
  });
  
  async function registerBackgroundFetchAsync() {
    return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
      minimumInterval: 1,
      stopOnTerminate: false,
      startOnBoot: true,
    });
  }
  
  async function unregisterBackgroundFetchAsync() {
    return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
  }

  const userLocationChange = (coordinate) => {
    if (!destination) {
      dispatch(setOrigin({
        latitude: coordinate.nativeEvent.coordinate.latitude,
        longitude: coordinate.nativeEvent.coordinate.longitude
      }))
    }
  }

  const distance = (lat1, lat2, lon1, lon2) => {
    // The math module contains a function
    // named toRadians which converts from
    // degrees to radians.
    lon1 = lon1 * Math.PI / 180;
    lon2 = lon2 * Math.PI / 180;
    lat1 = lat1 * Math.PI / 180;
    lat2 = lat2 * Math.PI / 180;

    // Haversine formula
    let dlon = lon2 - lon1;
    let dlat = lat2 - lat1;
    let a = Math.pow(Math.sin(dlat / 2), 2)
      + Math.cos(lat1) * Math.cos(lat2)
      * Math.pow(Math.sin(dlon / 2),2);

    let c = 2 * Math.asin(Math.sqrt(a));

    // Radius of earth in kilometers. Use 3956 for miles
    let r = 6371;

    // calculate the result
    return c * r;
  }

  const fitUser = () => {
    setTimeout(() => { 
      mapRef.current.animateToRegion({ 
        latitude: origin.latitude, 
        longitude: origin.longitude, 
        latitudeDelta: 0.025,
        longitudeDelta: 0.015,
      }, 1000)
    }, 1)
  }

  const fitDerection = () => {
    setTimeout(() => {
      mapRef.current.fitToSuppliedMarkers(['origin', 'destination'], {
        edgePadding: {
          top: Platform.OS === 'android' ? PixelRatio.getPixelSizeForLayoutSize(insets.top + 90) : 50,
          right: Platform.OS === 'android' ? PixelRatio.getPixelSizeForLayoutSize(0) : 50,
          left: Platform.OS === 'android' ? PixelRatio.getPixelSizeForLayoutSize(0) : 50,
          bottom: Platform.OS === 'android' ? PixelRatio.getPixelSizeForLayoutSize(330) : 400
        }
      })
    }, 100)
  }
  
  return (
    <View behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.map}>
      {
        !destination ? (
          <TouchableHighlight
            activeOpacity={0.6}
            underlayColor="#DDDDDD"
            style={{
              position: 'absolute',
              zIndex: 7,
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
            onPress={fitUser}
          >
            <MaterialIcons name="my-location" size={25} color="black" />
          </TouchableHighlight>
        ) : (
          <TouchableHighlight
            activeOpacity={0.6}
            underlayColor="#DDDDDD"
            style={{
              position: 'absolute',
              zIndex: 7,
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
            onPress={fitDerection}
          >
            <FontAwesome5 name="route" size={25} color="black" />
          </TouchableHighlight>
        )
      }
      
      <MapView
        ref={mapRef}
        initialRegion={{
          latitude: origin.latitude,
          longitude: origin.longitude,
          latitudeDelta: 0.025,
          longitudeDelta: 0.015,
        }}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={!directionsView}
        onUserLocationChange={coordinate => userLocationChange(coordinate)}
        showsMyLocationButton={false}
        rotateEnabled={false}
        pitchEnabled={false}
        mapType='terrain'
        mapPadding={{
          top: insets.top,
          bottom: destinationMenu ? 330 : 0,
        }}
        style={styles.map}
      >
        {
          !directionsView && (
            drivers.map(driver => {
              return (
                <DriverMarker key={driver.id} driver={driver} userInfo={userInfo} />
              )
            })
          )
        }

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
        <TouchableHighlight 
          activeOpacity={0.6}
          underlayColor="#DDDDDD"
          style={styles.inputField} 
          onPress={ () => setDestinationMenu(true) }
        >
          <Text style={styles.text}>Destination</Text>
        </TouchableHighlight>
      </View>

      <SlideInMenu 
        title='Your ride' 
        size={330} 
        open={destinationMenu} 
        setOpen={setDestinationMenu}
        setDirectionsView={setDirectionsView}
        fitUser={fitUser}
      >
        {
          destination ? (
            <DestinationAcceptance 
              registerBackgroundFetchAsync={registerBackgroundFetchAsync}
              unregisterBackgroundFetchAsync={unregisterBackgroundFetchAsync}
              setOrdered={setOrdered}
              setDirectionsView={setDirectionsView}
              fitUser={fitUser}
            />
          ) : (
            <DestinationChoice 
              setDirectionsView={setDirectionsView}
              fitDerection={fitDerection}
            />
          )
        }
        
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