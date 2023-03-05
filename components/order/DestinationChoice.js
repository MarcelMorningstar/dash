import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Div, Text } from '../Themed'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'

import { useDispatch, useSelector } from 'react-redux'
import { selectDestination, selectOrigin, setDestination } from '../../slices/mainSlice'

import { GOOGLE_API_KEY } from '@env'

export default function DestinationChoice({ setDirectionsView, fitDerection }) {
  const [value, setValue] = useState('')
  const dispatch = useDispatch()

  useEffect(() => {
    return () => {
      setValue('')
    }
  }, [])
  
  return (
    <View>
      <Div
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
      </Div>

      {
        (
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
            onChangeText={setValue}
            value={value}
            onPress={(data, details = null) => {
              dispatch(setDestination({
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
                address: details.formatted_address
              }))

              setDirectionsView(true)
              
              fitDerection(100)
            }}
          />
        )
      }
    </View>
  )
}

const styles = StyleSheet.create({})