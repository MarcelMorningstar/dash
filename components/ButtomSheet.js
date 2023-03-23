import React, { useCallback, useRef, useMemo, useEffect, useState } from "react";
import { Animated, Appearance, Keyboard, ScrollView, StyleSheet, TouchableHighlight, TouchableOpacity, View } from "react-native";
import { Text, PrimaryTouchableHighlight, FontAwesome5 } from "./Themed";
import { BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'

import Colors from "../constants/Colors";

import { useDispatch } from 'react-redux'
import { setDestination } from "../slices/mainSlice";
import { setOrderToken, setOrderInformation } from "../slices/orderSlice";

import { collection, addDoc } from "firebase/firestore";
import { firestore } from "../firebase";

import { GOOGLE_API_KEY } from '@env'

const ButtomSheet = ({ userToken, origin, destination, orderToken, orderType, orderInformation, setStatus, cancelOrder, directionsView, setDirectionsView, fitDerection, fitUser }) => {
  const dispatch = useDispatch()
  const [destinationAddress, setDestinationAddress] = useState('')

  const sheetHeight = useRef(new Animated.Value(0)).current;
  const [theme, setTheme] = useState(Appearance.getColorScheme());

  Appearance.addChangeListener((T) => {
    setTheme(T.colorScheme)
  })

  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => [24, 107, 220, 320], []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSnapPress = useCallback((index) => {
    bottomSheetModalRef.current?.snapToIndex(index);
  }, []);

  const handleSheetChanges = useCallback((index) => {
    animation(snapPoints[index])
  }, []);

  useEffect(() => {
    handlePresentModalPress()
  }, [])

  const animation = (endValue) => {
    Animated.timing(sheetHeight, {
      toValue: endValue - 12,
      duration: 200,
      useNativeDriver: false,
    }).start(
      () => {
        fitDerection(50)
      }
    );
  };

  const travelInfo = async () => {
    const response = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.latitude},${origin.longitude}&destinations=${destination.latitude},${destination.longitude}&units=metric&key=${GOOGLE_API_KEY}`)
    .then(response => response.json())
    .then(data => {
      return data
    })

    return response.rows[0].elements[0]
  }

  const addressFrom = async () => {
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${origin.latitude},${origin.longitude}&key=${GOOGLE_API_KEY}`)
    .then(response => response.json())
    .then(data => {
      return data
    })

    return response.results[0].formatted_address
  }

  const getDistance = (distance) => {
    return (distance / 1000).toFixed(2) || 0
  }

  const getDuration = (duration) => {
    let hours = 0;
    let minutes = (Math.floor(duration / 60)).toString().padStart(2, '0')
    let seconds = (duration - minutes * 60).toString().padStart(2, '0')

    if (minutes >= 60) {
      hours = (Math.floor(minutes / 60)).toString().padStart(2, '0')
      minutes = (minutes - hours * 60).toString().padStart(2, '0')

      return `${hours}:${minutes}:${seconds}` || '00:00:00'
    } else {
      return `00:${minutes}:${seconds}` || '00:00:00'
    }
  }

  const createCall = async () => {
    let travelInformation = await travelInfo()
    let from = await addressFrom()

    const docRef = await addDoc(collection(firestore, "calls"), {
      created_at: new Date(),
      pick_up: {
        latitude: origin.latitude,
        longitude: origin.longitude,
        address: from
      },
      destination: destination,
      travelInformation: {
        distance: getDistance(travelInformation.distance.value),
        duration: getDuration(travelInformation.duration.value)
      },
      user: userToken,
      type: orderType,
      status: 'in wait',
    });

    console.log(docRef.id)

    dispatch(setOrderToken(docRef.id))
    dispatch(setOrderInformation({
      status: 'in wait',
      pick_up: {
        latitude: origin.latitude,
        longitude: origin.longitude,
        address: from
      },
      destination: destination,
      travelInformation: {
        distance: getDistance(travelInformation.distance.value),
        duration: getDuration(travelInformation.duration.value)
      },
    }))

    setStatus('in wait')
  }

  return (
    <BottomSheetModalProvider>
      <Animated.View style={{ height: sheetHeight }}>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          backgroundStyle={{ backgroundColor: Colors[theme]['background'] }}
        >
          <View style={styles.contentConainer}>
            {
              !!orderToken ? (
                <View>
                  <Text>Status</Text>

                  <TouchableHighlight
                    activeOpacity={0.6}
                    underlayColor="#6A6A6A"
                    style={[styles.button, { width: '100%', backgroundColor: '#555555' }]}
                    onPress={() => {
                      cancelOrder(orderToken)
                      setDirectionsView(false)
                      handleSnapPress(3)
                    }}
                  >
                    <Text style={{ color: 'white', fontSize: 18, fontWeight: '500' }}>Cancel</Text>
                  </TouchableHighlight>
                </View>
              ) : directionsView ? (
                <View style={{ height: 175, flexDirection: 'column', justifyContent: 'space-between' }}>
                  <View style={{ height: 64 }}>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                      <TouchableOpacity style={styles.carType} onPress={() => {}}>
                        <Text>1</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.carType} onPress={() => {}}>
                        <Text>2</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.carType} onPress={() => {}}>
                        <Text>3</Text>
                      </TouchableOpacity>
                    </ScrollView>
                  </View>
        
                  <View style={[styles.row, { justifyContent: 'space-between', alignItems: 'center' }]}>
                    <View style={[styles.row, { alignItems: 'center' }]}>
                      <FontAwesome5 name="money-bill-wave" size={32} style={{ marginRight: 12 }} />
                      <Text style={{ fontSize: 18 }}>Cash</Text>
                    </View>

                    <Text style={{ fontSize: 18, fontWeight: '500' }}>12.60€</Text>
                  </View>

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <PrimaryTouchableHighlight
                      style={{ alignItems: 'center', justifyContent: 'center', width: '64%', height: 48, borderRadius: 12 }}
                      onPress={() => createCall()}
                    >
                      <Text style={{ fontSize: 18, fontWeight: '500', color: 'white' }}>Request Ride</Text>
                    </PrimaryTouchableHighlight>

                    <TouchableHighlight
                      activeOpacity={0.8}
                      underlayColor="#6A6A6A"
                      style={[{ width: '32%', backgroundColor: '#555555' }, styles.button]}
                      onPress={() => {
                        dispatch(setDestination(null))

                        setDirectionsView(false)

                        handleSnapPress(3)

                        fitUser()
                      }}
                    >
                      <Text style={{ fontSize: 18, fontWeight: '400', color: 'white' }}>Cancel</Text>
                    </TouchableHighlight>
                  </View>
                </View>
              ) : (
                <View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity style={styles.type} onPress={() => handleSnapPress(3)}>
                      <Text>1</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.type} onPress={() => handleSnapPress(3)}>
                      <Text>2</Text>
                    </TouchableOpacity>
                  </View>
        
                  <GooglePlacesAutocomplete 
                    placeholder='Type in your destination'
                    nearbyPlacesAPI='GooglePlacesSearch'
                    query={{
                      key: GOOGLE_API_KEY,
                      language: 'en',
                    }}
                    fetchDetails={true}
                    onChangeText={setDestinationAddress}
                    value={destinationAddress}
                    onPress={(data, details = null) => {
                      Keyboard.dismiss()

                      dispatch(setDestination({
                        latitude: details.geometry.location.lat,
                        longitude: details.geometry.location.lng,
                        address: details.formatted_address
                      }))
        
                      setDirectionsView(true)

                      handleSnapPress(2)
                    }}
                    minLength={2}
                    styles={{
                      container: {
                        flex: 0,
                        marginVertical: 16,
                      },
                      textInput: {
                        color: Colors[theme]['text'],
                        placeholderTextColor: 'blue',
                        backgroundColor: Colors[theme]['secondaryBackground'],
                        fontSize: 18,
                        borderRadius: 12
                      },
                      listView: {
                        height: 144,
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
          </View>
        </BottomSheetModal>
      </Animated.View>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  contentConainer: {
    paddingVertical: 8,
    paddingHorizontal: 24
  },
  row: {
    flexDirection: 'row'
  },
  type: {
    width: '48%', 
    height: 64, 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: 'gray',
    borderRadius: 12
  },
  carType: {
    width: 120, 
    height: 64, 
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'gray',
    borderRadius: 12
  },
  button: {
    alignItems: 'center', 
    justifyContent: 'center', 
    height: 48, 
    borderRadius: 12
  }
});

export default ButtomSheet;
