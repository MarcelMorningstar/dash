import React, { useEffect, useState } from 'react'
import { Appearance, View } from 'react-native'
import { SecondaryView, Text } from '../Themed'

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
navigator.geolocation = require("expo-location")

import Colors from '../../constants/Colors'

import { useDispatch } from 'react-redux'
import { setDestination } from '../../slices/mainSlice'

import { GOOGLE_API_KEY } from '@env'

export default function DestinationChoice({ setDirectionsView, fitDerection }) {
  const dispatch = useDispatch()
  const [location, setLocationAddress] = useState('')
  const [destination, setDestinationAddress] = useState('')
  const theme = Appearance.getColorScheme();

  useEffect(() => {
    return () => {
      setDestinationAddress('')
    }
  }, [])
  
  return (
    <View>
      <GooglePlacesAutocomplete 
        placeholder='Type in your location'
        currentLocationLabel='My location'
        nearbyPlacesAPI='GooglePlacesSearch'
        query={{
          key: GOOGLE_API_KEY,
          language: 'en',
        }}
        fetchDetails={true}
        currentLocation={true}
        onChangeTextr={setLocationAddress}
        value={location}
        onPress={() => {}}
        minLength={2}
        styles={{
          container: {
            flex: 0,
            marginVertical: 4,
          },
          textInput: {
            color: Colors[theme]['text'],
            placeholderTextColor: 'blue',
            backgroundColor: Colors[theme]['secondaryBackground'],
            fontSize: 18,
            borderRadius: 12
          },
          listView: {
            position: 'absolute',
            top: 106,
            height: 130,
          },
          row: {
            backgroundColor: Colors[theme]['background']
          },
          description: {
            color: Colors[theme]['text']
          },
          separator: {
            backgroundColor: Colors[theme]['placeholderText']
          }
        }}
        textInputProps={{
          placeholderTextColor: Colors[theme]['placeholderText'],
        }}
        enablePoweredByContainer={false}
      />

      {/* <SecondaryView
        style={{
          display: 'flex',
          justifyContent: 'center',
          height: 44,
          marginVertical: 4,
          paddingHorizontal: 12,
          borderRadius: 12
        }}
      >
        <Text style={{ fontSize: 18 }}>My Location</Text>
      </SecondaryView> */}

      <GooglePlacesAutocomplete 
        placeholder='Type in your destination'
        nearbyPlacesAPI='GooglePlacesSearch'
        query={{
          key: GOOGLE_API_KEY,
          language: 'en',
        }}
        fetchDetails={true}
        onChangeText={setDestinationAddress}
        value={destination}
        onPress={(data, details = null) => {
          dispatch(setDestination({
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
            address: details.formatted_address
          }))

          setDirectionsView(true)
          
          fitDerection(100)
        }}
        minLength={2}
        styles={{
          container: {
            flex: 0,
            marginVertical: 4,
          },
          textInput: {
            color: Colors[theme]['text'],
            placeholderTextColor: 'blue',
            backgroundColor: Colors[theme]['secondaryBackground'],
            fontSize: 18,
            borderRadius: 12
          },
          listView: {
            height: 130,
          },
          row: {
            backgroundColor: Colors[theme]['background']
          },
          description: {
            color: Colors[theme]['text']
          },
          separator: {
            backgroundColor: Colors[theme]['placeholderText']
          }
        }}
        textInputProps={{
          placeholderTextColor: Colors[theme]['placeholderText'],
        }}
        enablePoweredByContainer={false}
      />
    </View>
  )
}
