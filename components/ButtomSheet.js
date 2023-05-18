import React, { useCallback, useRef, useMemo, useEffect, useState } from "react";
import { Animated, Appearance, Image, Keyboard, ScrollView, StyleSheet, TouchableHighlight, TouchableOpacity, View } from "react-native";
import { Text, PrimaryTouchableHighlight, SecondaryTouchableOpacity, FontAwesome5, Feather, Fontisto, SecondaryView } from "./Themed";
import { Ionicons } from '@expo/vector-icons'; 
import { BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'

import Overlay from "./Overlay";

import Colors from "../constants/Colors";

import { useSelector, useDispatch } from 'react-redux'
import { setDestination, setPickUp } from "../slices/mainSlice";
import { setOrderToken, setOrderInformation, setOrderType, selectOrderAdditions, setOrderAdditions } from "../slices/orderSlice";
import { selectTheme } from '../slices/authSlice'

import { travelInfo } from "../utils/distancematrix";
import { getFormattedAddress } from "../utils/geocode";
import { callNumber } from "../utils/phone";

import { collection, addDoc } from "firebase/firestore";
import { firestore } from "../firebase";

import { GOOGLE_API_KEY } from '@env'

const ButtomSheet = ({ userToken, origin, pickUp, destination, orderToken, orderType, orderInformation, drivers, driver, car, status, setStatus, cancelOrder, directionsView, setDirectionsView, fitDerection, fitUser }) => {
  const dispatch = useDispatch()

  const orderAdditions = useSelector(selectOrderAdditions)

  const [fromAddress, setFromAddress] = useState('')
  const [destinationAddress, setDestinationAddress] = useState('')

  const sheetHeight = useRef(new Animated.Value(0)).current;
  const circleOpacity1 = useRef(new Animated.Value(1)).current;
  const circleScale1 = useRef(new Animated.Value(1)).current;
  const circleOpacity2 = useRef(new Animated.Value(0.4)).current;
  const circleScale2 = useRef(new Animated.Value(0.7)).current;

  const [cancel, setCancel] = useState(false)

  const storageTheme = useSelector(selectTheme)
  const [theme, setTheme] = useState(storageTheme === 'automatic' ? Appearance.getColorScheme() : storageTheme);

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

  const bottomSheetModalRef = useRef(null);
  const snapPoints = useMemo(() => [24, 107, 228, 360], []);

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

  useEffect(() => {
    if (status == 'done') {
      handleSnapPress(1)
    } else if (status == 'in progress') {
      handleSnapPress(0)
    } else if (status == 'in wait' || status == 'waiting driver' || status == 'arrived') {
      handleSnapPress(2)
    }
  }, [status])
  
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

  const waitStatus = () => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(circleOpacity1, {
            toValue: 0.4,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(circleOpacity1, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          })
        ]),
        Animated.sequence([
          Animated.timing(circleOpacity2, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(circleOpacity2, {
            toValue: 0.4,
            duration: 700,
            useNativeDriver: true,
          })
        ]),
        Animated.sequence([
          Animated.timing(circleScale1, {
            toValue: 0.7,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(circleScale1, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          })
        ]),
        Animated.sequence([
          Animated.timing(circleScale2, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(circleScale2, {
            toValue: 0.7,
            duration: 700,
            useNativeDriver: true,
          })
        ]),
      ])
    ).start()
  }

  const toggleOrderAdditions = (name) => {
    let additions = orderAdditions.find(e => e === name)

    if (additions) {
      let index = orderAdditions.findIndex(e => e === name)
      additions = [...orderAdditions]
      additions.splice(index, 1);

      dispatch(setOrderAdditions(additions))
    } else {
      additions = [...orderAdditions]
      additions.push(name)

      dispatch(setOrderAdditions(additions))
    }
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
    let travelInformation = await travelInfo(origin, destination)
    let fromLatitude
    let fromLongitude
    let fromAddress

    if (pickUp) {
      fromLatitude = pickUp.latitude
      fromLongitude = pickUp.longitude
      fromAddress = pickUp.address
    } else {
      fromLatitude = origin.latitude
      fromLongitude = origin.longitude
      fromAddress = await getFormattedAddress({ latitude: origin.latitude, longitude: origin.longitude })
    }

    const docRef = await addDoc(collection(firestore, "calls"), {
      created_at: new Date(),
      pick_up: {
        latitude: fromLatitude,
        longitude: fromLongitude,
        address: fromAddress
      },
      destination: destination,
      travelInformation: {
        distance: getDistance(travelInformation.distance.value),
        duration: getDuration(travelInformation.duration.value)
      },
      user: userToken,
      type: orderType,
      additions: orderAdditions,
      status: 'in wait',
    });

    dispatch(setOrderToken(docRef.id))
    dispatch(setOrderInformation({
      status: 'in wait',
      pick_up: {
        latitude: fromLatitude,
        longitude: fromLongitude,
        address: fromAddress
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
          index={status == 'done' ? 1 : status == 'in progress' ? 0 : 2}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          backgroundStyle={{ backgroundColor: Colors[theme]['background'] }}
        >
          <View style={styles.contentConainer}>
            {
              !!orderToken ? (
                <View style={[styles.container, { height: 183 }]}>
                  <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                    {
                      status === 'in wait' ? (
                        <View style={{ width: '100%' }}>
                          <View onLayout={waitStatus} style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 4 }}>
                            <Animated.View style={{ width: 21, height: 21, marginHorizontal: 2, borderRadius: 11, backgroundColor: 'gray', opacity: circleOpacity2, transform: [{scale: circleScale2}] }}></Animated.View>
                            <Animated.View style={{ width: 21, height: 21, marginHorizontal: 2, borderRadius: 11, backgroundColor: 'gray', opacity: circleOpacity1, transform: [{scale: circleScale1}] }}></Animated.View>
                            <Animated.View style={{ width: 21, height: 21, marginHorizontal: 2, borderRadius: 11, backgroundColor: 'gray', opacity: circleOpacity2, transform: [{scale: circleScale2}] }}></Animated.View>
                          </View>

                          <Text style={{ fontSize: 15, textAlign: 'center' }}>Waiting for a response from a driver</Text>

                          <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: 24 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <Fontisto name="taxi" size={32} style={{ marginRight: 12 }} />
                              <Text style={{ fontSize: 18, fontWeight: '500' }}>{ drivers.length }</Text>
                            </View>
                            <Text style={{ fontSize: 21, fontWeight: '500' }}></Text>
                          </View>
                        </View>
                      ) : status === 'waiting driver' && driver ? (
                        <View style={{ width: '100%' }}>
                          <View style={{ flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4, paddingVertical: 4, paddingLeft: 4, paddingRight: 16, backgroundColor: 'lightgray', borderRadius: 24 }}>
                            <Ionicons name="checkmark-circle" size={28} color="green" style={{ marginRight: 5 }} />
                            <Text style={{ fontSize: 14, fontWeight: '500' }}>Accepted</Text>
                          </View>

                          <Text style={{ fontSize: 15, alignSelf: 'center' }}>{ driver.wait?.duration?.text && `Car will arrive in ${driver.wait?.duration?.text}` }</Text>
                        </View>
                      ): status === 'arrived' && (
                        <View>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4, paddingVertical: 4, paddingLeft: 4, paddingRight: 16, backgroundColor: 'lightgray', borderRadius: 24 }}>
                            <Ionicons name="checkmark-circle" size={28} color="green" style={{ marginRight: 5 }} />
                            <Text style={{ fontSize: 14, fontWeight: '500' }}>Arrived</Text>
                          </View>
                        </View>
                      )
                    }
                    
                    {
                      (status === 'waiting driver' || status === 'arrived') && ( 
                        driver && car && (
                          <View style={[styles.row, { width: '100%', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }]}>
                            <View style={styles.row}>
                              <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, marginRight: 12, backgroundColor: '#DDDDDD', borderRadius: 24 }}>
                                {
                                  driver.photoURL.match(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi) ?
                                    <Image
                                      source={{
                                        uri: driver.photoURL,
                                      }}
                                      style={{
                                        width: '100%',
                                        height: '100%',
                                        resizeMode: 'cover',
                                        borderRadius: 24
                                      }}
                                    />
                                  :
                                    <FontAwesome5 name="user-alt" size={24} color="#555555" />
                                }
                              </View>

                              <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                                <Text style={{ fontSize: 15 }}>{ driver.displayName }</Text>
                              </View>
                            </View>

                            <View style={[styles.row]}>
                              <View style={{ alignItems: 'flex-end', marginRight: 12 }}>
                                <Text style={{ fontSize: 15 }}>{ car.brand + ' ' + car.model }</Text>
                                <Text>{ car.plate }</Text>
                              </View>
                              <SecondaryTouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: 24, }} onPress={() => callNumber(driver.phoneNumber)}>
                                <Feather name="phone" size={28} />
                              </SecondaryTouchableOpacity>
                            </View>
                          </View>
                        )
                      )
                    }
                  </View>
                  
                  <TouchableHighlight
                    activeOpacity={0.6}
                    underlayColor="#6A6A6A"
                    style={[styles.button, { width: '100%', backgroundColor: '#555555' }]}
                    onPress={() => setCancel(true)}
                  >
                    <Text style={{ color: 'white', fontSize: 18, fontWeight: '500' }}>Cancel</Text>
                  </TouchableHighlight>

                  <Overlay visible={cancel}>
                    <SecondaryView style={styles.modalView}>
                      <Text style={{ marginBottom: 2, textAlign: 'center', fontSize: 21, fontWeight: '500' }}>Cancel</Text>
                      <Text style={{ marginVertical: 8, textAlign: 'center', fontSize: 14 }}>Are you sure want to cancel?</Text>

                      <View style={{ display: 'flex', flexDirection: 'row' }}>
                        <TouchableOpacity
                          style={[styles.buttons, { marginRight: 4, backgroundColor: '#ED4337' }]}
                          onPress={() => { cancelOrder(orderToken); setCancel(false)}}
                        >
                          <Text style={{ color: 'white', fontWeight: '500' }}>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.buttons, { marginLeft: 4, backgroundColor: '#F0F0F0' }]}
                          onPress={() => setCancel(false)}
                        >
                          <Text style={{ color: 'black', fontWeight: '500' }}>No</Text>
                        </TouchableOpacity>
                      </View>
                    </SecondaryView>
                  </Overlay>
                </View>
              ) : directionsView ? (
                <View style={[styles.container, { height: 175 }]}>
                  <View style={{ height: 64 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <TouchableOpacity style={[styles.carType, orderAdditions.find(e => e === 'babysit') ? { borderColor: Colors[theme]['primary'] } : { borderColor: 'gray' }]} onPress={() => toggleOrderAdditions('babysit')}>
                        <Image
                          source={require("../assets/luggage.png")}
                          style={{
                            height: '75%',
                            resizeMode: 'contain'
                          }}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.carType, orderAdditions.find(e => e === 'luggage') ? { borderColor: Colors[theme]['primary'] } : { borderColor: 'gray' }]} onPress={() => toggleOrderAdditions('luggage')}>
                        <Image
                          source={require("../assets/baby-car-seat.png")}
                          style={{
                            height: '75%',
                            resizeMode: 'contain'
                          }}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.carType, orderAdditions.find(e => e === 'invalid') ? { borderColor: Colors[theme]['primary'] } : { borderColor: 'gray' }]} onPress={() => toggleOrderAdditions('invalid')}>
                        <Image
                          source={require("../assets/invalid.png")}
                          style={{
                            height: '75%',
                            resizeMode: 'contain'
                          }}
                        />
                      </TouchableOpacity>
                    </View>
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
                        dispatch(setPickUp(null))

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
                <View style={styles.container}>
                  <View style={[styles.row, { justifyContent: 'space-between' }]}>
                    <TouchableOpacity style={[styles.type, orderType === 'taxi' ? { backgroundColor: 'gray' } : { backgroundColor: 'lightgray' } ]} onPress={() => { dispatch(setOrderType('taxi')); handleSnapPress(3) }}>
                      <Image
                        source={require("../assets/taxi.png")}
                        style={{
                          height: '111%',
                          resizeMode: 'contain'
                        }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.type, orderType === 'second driver' ? { backgroundColor: 'gray' } : { backgroundColor: 'lightgray' } ]} onPress={() => { dispatch(setOrderType('second driver')); handleSnapPress(3) }}>
                      <Image
                        source={require("../assets/driver.png")}
                        style={{
                          height: '75%',
                          resizeMode: 'contain'
                        }}
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={{ marginTop: 16 }}>
                    <GooglePlacesAutocomplete 
                      placeholder='Current location'
                      currentLocationLabel='My location'
                      nearbyPlacesAPI='GooglePlacesSearch'
                      query={{
                        key: GOOGLE_API_KEY,
                        language: 'en',
                      }}
                      fetchDetails={true}
                      // currentLocation={true}
                      onChangeText={setFromAddress}
                      value={fromAddress}
                      onPress={(data, details = null) => {
                        Keyboard.dismiss()

                        dispatch(setPickUp({
                          latitude: details.geometry.location.lat,
                          longitude: details.geometry.location.lng,
                          address: details.formatted_address
                        }))
                      }}
                      minLength={2}
                      styles={{
                        container: {
                          flex: 0,
                        },
                        textInput: {
                          color: Colors[theme]['text'],
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
                          marginVertical: 4,
                        },
                        textInput: {
                          color: Colors[theme]['text'],
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
  container: {
    flexDirection: 'column', 
    justifyContent: 'space-between'
  },
  row: {
    flexDirection: 'row'
  },
  type: {
    width: '49%', 
    height: 64, 
    alignItems: 'center', 
    justifyContent: 'center',
    borderRadius: 12
  },
  carType: {
    width: "31%", 
    height: 64, 
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'gray',
    borderWidth: 2,
    borderRadius: 12
  },
  button: {
    alignItems: 'center', 
    justifyContent: 'center', 
    height: 48, 
    borderRadius: 12
  },
  modalView: {
    padding: 20,
    borderRadius: 21,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttons: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16
  }
});

export default ButtomSheet;
