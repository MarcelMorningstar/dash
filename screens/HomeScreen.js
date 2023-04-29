import React, { useEffect, useRef, useState } from 'react'
import { Appearance, Image, PixelRatio, Platform, StyleSheet, View } from 'react-native'
import { TouchableHighlight } from '../components/Themed'
import * as BackgroundFetch from 'expo-background-fetch'
import * as TaskManager from 'expo-task-manager'
import * as Location from 'expo-location'
import { FontAwesome5, Fontisto, MaterialIcons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Marker } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'

import Map from '../components/Map'
import DriverMarker from '../components/DriverMarker'
import ButtomSheet from '../components/ButtomSheet'
import FirstTimeForm from '../components/FirstTimeForm'

import Colors from '../constants/Colors'

import { useSelector, useDispatch } from 'react-redux'
import { selectDestination, selectOrigin, selectPickUp, setDestination, setOrigin, setPickUp } from '../slices/mainSlice'
import { selectUserInfo, selectUserToken, selectTheme } from '../slices/authSlice'
import { selectCar, selectDriver, selectOrderInformation, selectOrderToken, selectOrderType, setCar, setDriver, setOrderInformation, setOrderToken, setOrderType } from '../slices/orderSlice'

import { travelInfo, getDistance } from '../utils/distancematrix'

import { collection, query, where, onSnapshot, doc, updateDoc, getDoc } from "firebase/firestore"
import { ref, set } from "firebase/database"
import { firestore, database } from '../firebase'

import { GOOGLE_API_KEY } from '@env'

const BACKGROUND_FETCH_TASK = 'background-location-task'

export default function HomeScreen() {
  const storageTheme = useSelector(selectTheme)
  const [theme, setTheme] = useState(storageTheme === 'automatic' ? Appearance.getColorScheme() : storageTheme);
  const insets = useSafeAreaInsets()

  const mapRef = useRef(null)

  let userLoactionUpdateInterval = useRef()

  const dispatch = useDispatch()
  const origin = useSelector(selectOrigin)
  const pickUp = useSelector(selectPickUp)
  const destination = useSelector(selectDestination)
  const userToken = useSelector(selectUserToken)
  const userInfo = useSelector(selectUserInfo)
  const orderToken = useSelector(selectOrderToken)
  const orderType = useSelector(selectOrderType)
  const orderInformation = useSelector(selectOrderInformation)
  const driver = useSelector(selectDriver)
  const car = useSelector(selectCar)

  const [directionsView, setDirectionsView] = useState(false)
  const [drivers, setDrivers] = useState([])
  const [status, setStatus] = useState(orderToken ? orderInformation.status : 'done')
  const [gif, setGif] = useState(false)

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

  useEffect(() => {
    const q = query(collection(firestore, "drivers"), where("active", "==", true));

    const driverUnsubscribe = onSnapshot(q, (querySnapshot) => {
      const temp = [];

      querySnapshot.forEach((doc) => {
        if (getDistance(origin.latitude, doc.data().location.latitude, origin.longitude, doc.data().location.longitude) < 10) {
          temp.push({
            id: doc.id,
            ...doc.data()
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
    if (!!orderToken) {
      if (status !== 'done') {
        const orderUpdates = onSnapshot(doc(firestore, "calls", orderToken), (snapshot) => {
          let data = snapshot.data()
  
          setStatus(data.status)

          if (data.driver) {
            const trackDriver = onSnapshot(doc(firestore, "drivers", data.driver), async (item) => {
              const travelInformation = await travelInfo(origin, item.data().location)

              dispatch(setDriver({ ...item.data(), wait: travelInformation }))
            });
          }

          if (data.status === 'arrived') {
            setGif(true)

            setTimeout(() => {
              setGif(false)
            }, 60);
          }

          dispatch(setOrderInformation({
            status: data.status
          }))
        });

        registerBackgroundFetchAsync()
  
        updateUserLocation()
        userLoactionUpdateInterval.current = setInterval(() => {
          updateUserLocation()
        }, 5000)
      } else {
        unregisterBackgroundFetchAsync()
    
        clearInterval(userLoactionUpdateInterval.current)
        userLoactionUpdateInterval.current = null

        dispatch(setDestination(null))
        dispatch(setPickUp(null))
        dispatch(setOrderToken(null))
        dispatch(setOrderType('taxi'))
        dispatch(setOrderInformation(null))
        dispatch(setDriver(null))
        dispatch(setCar(null))

        setDirectionsView(false)
      }
    } else {
      dispatch(setDestination(null))

      setDirectionsView(false)
    }
  }, [status])

  useEffect(() => {
    if (driver) {
      (async () => {
        const docSnap = await getDoc(doc(firestore, "cars", driver?.car))
    
        dispatch(setCar(docSnap.data()))
      })()
    }
  }, [driver])

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
    const callRef = doc(firestore, "calls", orderToken)

    await updateDoc(callRef, {
      status: 'canceled'
    })

    setStatus('done')

    fitUser()
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

  const fitDriver = () => {
    setTimeout(() => { 
      mapRef.current.animateToRegion({ 
        latitude: driver?.location?.latitude, 
        longitude: driver?.location?.longitude, 
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
          bottom: Platform.OS === 'android' ? PixelRatio.getPixelSizeForLayoutSize(12) : 70
        }
      })
    }, delay)
  }
  
  return (
    <View behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      {
        (driver && orderToken && (status === 'waiting driver' || status === 'arrived')) && (
          <TouchableHighlight
            activeOpacity={0.6}
            style={[styles.centerBtn, { right: 76, }]}
            onPress={fitDriver}
          >
            <Fontisto name="taxi" size={21} color="black" />
          </TouchableHighlight>
        )
      }

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

      {
        gif && (
          <Image 
            source={require("../assets/confetti.gif")}
            style={{
              position: 'absolute',
              zIndex: 9999,
              top: 354,
              width: '100%',
              resizeMode: 'contain'
            }}
          />
        )
      }
      
      <Map mapRef={mapRef} origin={origin} directionsView={directionsView} userLocationChange={userLocationChange} insets={insets}>
        {
          !directionsView && (
            drivers.map(item => {
              return (
                <DriverMarker key={item.id} driver={item} userInfo={userInfo} />
              )
            })
          )
        }

        {
          driver && orderToken && (
            <Marker
              identifier='driver'
              coordinate={{
                latitude: driver.location.latitude,
                longitude: driver.location.longitude,
              }}
              anchor={{ x: 0.5, y: 0.5 }}
              image={require('../assets/car.png')}
            />
          )
        }

        {
          destination && (
            <Marker 
              identifier='origin'
              coordinate={{
                latitude: pickUp ? pickUp.latitude : origin.latitude,
                longitude: pickUp ? pickUp.longitude : origin.longitude,
              }}
            />
          )
        }

        {
          destination && (
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
          destination && (
            <MapViewDirections 
              origin={pickUp ? pickUp : origin}
              destination={destination}
              apikey={GOOGLE_API_KEY}
              strokeWidth={4}
              strokeColor={Colors[theme]['primary']}
            />
          )
        }
      </Map>

      <ButtomSheet
        userToken={userToken}
        origin={origin}
        pickUp={pickUp}
        destination={destination}
        orderToken={orderToken}
        orderType={orderType}
        orderInformation={orderInformation}
        drivers={drivers}
        driver={driver}
        car={car}
        status={status}
        setStatus={setStatus}
        cancelOrder={cancelOrder}
        directionsView={directionsView}
        setDirectionsView={setDirectionsView}
        fitDerection={fitDerection}
        fitUser={fitUser}
      />

      { Object.keys(userInfo).length === 0 && <FirstTimeForm userToken={userToken} /> }
    </View>
  )
}