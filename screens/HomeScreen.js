import React, { useEffect, useRef, useState } from 'react'
import { Appearance, PixelRatio, Platform, StyleSheet, Text, View } from 'react-native'
import { TouchableHighlight, MaterialCommunityIcons } from '../components/Themed'
import * as BackgroundFetch from 'expo-background-fetch'
import * as TaskManager from 'expo-task-manager'
import * as Location from 'expo-location'
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Marker } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'

import Map from '../components/Map'
import DriverMarker from '../components/DriverMarker'
import SlideInMenu from '../components/order/SlideInMenu'
import Type from '../components/order/Type'
import DestinationChoice from '../components/order/DestinationChoice'
import DestinationAcceptance from '../components/order/DestinationAcceptance'
import ProcessingOrder from '../components/order/ProcessingOrder'

import Colors from '../constants/Colors'

import { useSelector, useDispatch } from 'react-redux'
import { selectDestination, selectOrigin, setDestination, setOrigin } from '../slices/mainSlice'
import { selectUserInfo, selectUserToken } from '../slices/authSlice'
import { selectOrderInformation, selectOrderToken, selectOrderType, setOrderInformation, setOrderToken } from '../slices/orderSlice'

import { collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { ref, set } from "firebase/database"
import { firestore, database } from '../firebase'

import { GOOGLE_API_KEY } from '@env'

const BACKGROUND_FETCH_TASK = 'background-location-task';

export default function HomeScreen() {
  const theme = Appearance.getColorScheme()
  const insets = useSafeAreaInsets()

  const mapRef = useRef(null)
  const childRef = useRef(null)

  let userLoactionUpdateInterval = useRef()

  const dispatch = useDispatch()
  const origin = useSelector(selectOrigin)
  const destination = useSelector(selectDestination)
  const userToken = useSelector(selectUserToken)
  const userInfo = useSelector(selectUserInfo)
  const orderToken = useSelector(selectOrderToken)
  const orderType = useSelector(selectOrderType)
  const orderInformation = useSelector(selectOrderInformation)

  const [typeMenu, setTypeMenu] = useState(false)
  const [directionsView, setDirectionsView] = useState(false)
  const [destinationMenu, setDestinationMenu] = useState(false)
  const [drivers, setDrivers] = useState([])
  const [status, setStatus] = useState('')

  const styles = StyleSheet.create({
    inputContainer: {
      position: 'absolute',
      bottom: 32,
      display: 'flex',
      flexDirection: 'row', 
      alignSelf: 'center',
      width: '75%',
    },
    inputField: {
      justifyContent: 'center',
      height: 50,
      backgroundColor: "#FFF",
      borderRadius: 12,
      elevation: 4,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.25
    },
    centerBtn: {
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
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.25
    }
  })

  useEffect(() => {
    const q = query(collection(firestore, "drivers"), where("active", "==", true), where("available", "==", true));

    const driverUnsubscribe = onSnapshot(q, (querySnapshot) => {
      const temp = [];

      querySnapshot.forEach((doc) => {
        if (distance(origin.latitude, doc.data().location.latitude, origin.longitude, doc.data().location.longitude) < 12) {
          temp.push({
            id: doc.id,
            data: doc.data()
          });
        }
      })

      setDrivers(temp)
    });

    return () => {
      driverUnsubscribe()
    }
  }, [])

  useEffect(() => {
    if (status == 'in wait') {
      registerBackgroundFetchAsync() 

      updateUserLocation()
      userLoactionUpdateInterval.current = setInterval(() => {
        updateUserLocation()
      }, 5000)

      const orderUpdates = onSnapshot(doc(firestore, "calls", orderToken), (snapshot) => {
        let data = snapshot.data()

        console.log(data)
  
        setStatus(data.status)
      });
    } else {
      unregisterBackgroundFetchAsync()

      clearInterval(userLoactionUpdateInterval.current)
      userLoactionUpdateInterval.current = null
    }
  }, [status])

  const updateUserLocation = async () => {
    const data = await Location.getCurrentPositionAsync({})

    const location = {
      latitude: data.coords.latitude,
      longitude: data.coords.longitude
    }

    writeUserLocationData(userToken, location)
  }

  const writeUserLocationData = (userId, location) => {
    set(ref(database, 'users/' + userId), {
      location: location
    });
  }

  const cancelOrder = async (orderToken) => {
    dispatch(setDestination(null))
    dispatch(setOrderToken(null))
    dispatch(setOrderInformation(null))

    const callRef = doc(firestore, "calls", orderToken);

    await updateDoc(callRef, {
      status: 'canceled'
    });
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
        latitudeDelta: 0.018,
        longitudeDelta: 0.012,
      }, 1000)
    }, 1)
  }

  const fitDerection = (delay) => {
    setTimeout(() => {
      mapRef.current.fitToSuppliedMarkers(['origin', 'destination'], {
        edgePadding: {
          top: Platform.OS === 'android' ? PixelRatio.getPixelSizeForLayoutSize(insets.top + 90) : 50,
          right: Platform.OS === 'android' ? PixelRatio.getPixelSizeForLayoutSize(0) : 50,
          left: Platform.OS === 'android' ? PixelRatio.getPixelSizeForLayoutSize(0) : 50,
          bottom: Platform.OS === 'android' ? PixelRatio.getPixelSizeForLayoutSize(destinationMenu ? 330 : 0) : destinationMenu ? 400 : 70
        }
      })
    }, delay)
  }
  
  return (
    <View behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      {
        !destination ? (
          <TouchableHighlight
            activeOpacity={0.6}
            style={styles.centerBtn}
            onPress={fitUser}
          >
            <MaterialIcons name="my-location" size={25} color="black" />
          </TouchableHighlight>
        ) : (
          <TouchableHighlight
            activeOpacity={0.6}
            style={styles.centerBtn}
            onPress={() => fitDerection(100)}
          >
            <FontAwesome5 name="route" size={25} color="black" />
          </TouchableHighlight>
        )
      }
      
      <Map mapRef={mapRef} origin={origin} directionsView={directionsView} destinationMenu={destinationMenu} userLocationChange={userLocationChange} insets={insets}>
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
              strokeColor={Colors[theme]['primary']}
            />
          )
        }
      </Map>

      {
        !directionsView && (
          <View style={styles.inputContainer}>
            <TouchableHighlight
              activeOpacity={0.6}
              underlayColor="#DDDDDD"
              style={[styles.inputField, { alignItems: 'center', width: 50, paddingHorizontal: 4, marginRight: 12 }]}
              onPress={() => setTypeMenu(true)}
            >
              <MaterialCommunityIcons name="format-list-bulleted-type" size={32} color='black' />
            </TouchableHighlight>

            <Type 
              visible={typeMenu}
              setVisible={setTypeMenu}
            />
            
            <TouchableHighlight 
              activeOpacity={0.6}
              underlayColor="#DDDDDD"
              style={[{ flex: 1, paddingHorizontal: 12 }, styles.inputField]} 
              onPress={() => setDestinationMenu(true)}
            >
              <Text style={{ fontSize: 18, color: 'rgba(0, 0, 0, .4)' }}>Destination</Text>
            </TouchableHighlight>
          </View>
        )
      }

      <SlideInMenu 
        ref={childRef}
        title='Your ride' 
        size={330} 
        open={destinationMenu} 
        setOpen={setDestinationMenu}
        setDirectionsView={setDirectionsView}
        fitUser={fitUser}
      >
        {
          status == 'in wait' ? (
            <ProcessingOrder 
              orderToken={orderToken}
              orderInformation={orderInformation}
              cancelOrder={cancelOrder}
              setDirectionsView={setDirectionsView}
              colseSlideIn={() => { childRef.current.close() }}
            />
          ) : destination ? (
            <DestinationAcceptance 
              userToken={userToken}
              origin={origin}
              destination={destination}
              orderType={orderType}
              setStatus={setStatus}
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