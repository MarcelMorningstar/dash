import React, { useEffect } from 'react'
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native'

import { useDispatch, useSelector } from 'react-redux'
import { selectDestination, selectOrigin, selectTravelInformation, setDestination, setTravelInformation } from '../slices/mainSlice'
import { selectUserToken } from '../slices/authSlice';

import { getFirestore, collection, addDoc } from "firebase/firestore";
import app from '../firebase'

import { GOOGLE_API_KEY } from '@env'

const database = getFirestore(app);

export default function DestinationAcceptance({ registerBackgroundFetchAsync, unregisterBackgroundFetchAsync, setOrdered, setDirectionsView, fitUser }) {
  const dispatch = useDispatch()
  const userToken = useSelector(selectUserToken)
  const origin = useSelector(selectOrigin)
  const destination = useSelector(selectDestination)
  const travelInformation = useSelector(selectTravelInformation)

  useEffect(() => {
    const setTravelInfo = async () => {
      fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.latitude},${origin.longitude}&destinations=${destination.latitude},${destination.longitude}&units=metric&key=${GOOGLE_API_KEY}`)
      .then(response => response.json())
      .then(data => {
        dispatch(setTravelInformation(data.rows[0].elements[0]))
      })
    }

    setTravelInfo()
  }, [origin, destination, GOOGLE_API_KEY])

  const getDistance = (distance) => {
    return (distance / 1000).toFixed(2) || 0
  }

  const getDuration = (duration) => {
    let hours = 0;
    let minutes = (Math.floor(duration / 60)).toString().padStart(2, '0')
    let seconds = duration - minutes * 60

    if (minutes >= 60) {
      hours = (Math.floor(minutes / 60)).toString().padStart(2, '0')
      minutes = minutes - hours * 60

      return `${hours}:${minutes}:${seconds}` || '00:00:00'
    } else {
      return `00:${minutes}:${seconds}` || '00:00:00'
    }
  }

  const createCall = async () => {
    const docRef = await addDoc(collection(database, "calls"), {
      inWait: true,
      inProgress: false,
      ended: false,
      payed: false,
      user: {
        id: userToken,
        latitude: origin.latitude,
        longitude: origin.longitude
      },
      destination: destination,
      travelInformation: {
        distance: getDistance(travelInformation?.distance.value),
        duration: getDuration(travelInformation?.duration.value)
      }
    });
  }

  return (
    <View style={{ flex: 1, justifyContent: 'space-between' }}>
      <View>
        <Text style={{ marginBottom: 6, fontSize: 21, fontWeight: '600' }}>{ destination?.address }</Text>
        <Text style={{ fontSize: 16 }}>
          { getDistance(travelInformation?.distance.value) } kilometer drive. 
          {"\n"}
          Approximate time of drive { getDuration(travelInformation?.duration.value) }.
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableHighlight
          activeOpacity={0.8}
          underlayColor="#D39109"
          style={[styles.button, { marginRight: 4, backgroundColor: '#F5AD17' }]}
          onPress={() => { 
            setOrdered(true)
            registerBackgroundFetchAsync() 

            createCall()
          }}
        >
          <Text style={{ color: 'white', fontWeight: '500' }}>Accept</Text>
        </TouchableHighlight>
        <TouchableHighlight
          activeOpacity={0.8}
          underlayColor="#DDDDDD"
          style={[styles.button, { marginLeft: 4, backgroundColor: '#F0F0F0' }]}
          onPress={() => {
            setOrdered(false)
            unregisterBackgroundFetchAsync()

            dispatch(setDestination(null))
            setDirectionsView(false)
            fitUser()
          }}
        >
          <Text style={{ color: 'black', fontWeight: '500' }}>Cancel</Text>
        </TouchableHighlight>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'relative',
    bottom: 0,
    display: 'flex', 
    flexDirection: 'row'
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    marginVertical: 16,
    borderRadius: 12
  },
})