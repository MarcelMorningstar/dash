import React, { useEffect, useState } from 'react'
import { StyleSheet, TouchableHighlight, View } from 'react-native'
import { Text, TouchableHighlight2 } from '../Themed'

import { useDispatch, useSelector } from 'react-redux'
import { selectDestination, selectOrigin, selectTravelInformation, setDestination, setTravelInformation } from '../../slices/mainSlice'
import { selectUserToken } from '../../slices/authSlice';
import { setOrderToken, setOrderInformation } from '../../slices/orderSlice';

import { collection, addDoc } from "firebase/firestore";
import { firestore } from '../../firebase'

import { GOOGLE_API_KEY } from '@env'

export default function DestinationAcceptance({ setStatus, setDirectionsView, fitUser }) {
  const dispatch = useDispatch()
  const userToken = useSelector(selectUserToken)
  const origin = useSelector(selectOrigin)
  const destination = useSelector(selectDestination)
  const travelInformation = useSelector(selectTravelInformation)
  const [from, setFrom] = useState('')

  useEffect(() => {
    const setTravelInfo = async () => {
      fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.latitude},${origin.longitude}&destinations=${destination.latitude},${destination.longitude}&units=metric&key=${GOOGLE_API_KEY}`)
      .then(response => response.json())
      .then(data => {
        dispatch(setTravelInformation(data.rows[0].elements[0]))
      })
    }

    const setFromAddress = async () => {
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${origin.latitude},${origin.longitude}&key=${GOOGLE_API_KEY}`)
      .then(response => response.json())
      .then(data => {
        setFrom(data.results[0].formatted_address)
      })
    }

    setTravelInfo()
    setFromAddress()
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
      minutes = (minutes - hours * 60).toString().padStart(2, '0')

      return `${hours}:${minutes}:${seconds}` || '00:00:00'
    } else {
      return `00:${minutes}:${seconds}` || '00:00:00'
    }
  }

  const createCall = async () => {
    const docRef = await addDoc(collection(firestore, "calls"), {
      created_at: new Date(),
      status: 'in wait',
      user: {
        id: userToken,
        latitude: origin.latitude,
        longitude: origin.longitude,
        address: from
      },
      destination: destination,
      travelInformation: {
        distance: getDistance(travelInformation?.distance.value),
        duration: getDuration(travelInformation?.duration.value)
      }
    });

    console.log(docRef.id)

    dispatch(setOrderToken(docRef.id))
    dispatch(setOrderInformation({
      status: 'in wait',
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
    }))

    setStatus('in wait')
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
        <TouchableHighlight2
          activeOpacity={0.8}
          style={[styles.button, { marginRight: 4 }]}
          onPress={() => { 
            createCall()
          }}
        >
          <Text style={{ color: 'white', fontWeight: '500' }}>Accept</Text>
        </TouchableHighlight2>
        <TouchableHighlight
          activeOpacity={0.8}
          underlayColor="#6A6A6A"
          style={[styles.button, { marginLeft: 4, backgroundColor: '#555555' }]}
          onPress={() => {
            dispatch(setDestination(null))

            setDirectionsView(false)

            fitUser()
          }}
        >
          <Text style={{ color: 'white', fontWeight: '500' }}>Cancel</Text>
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