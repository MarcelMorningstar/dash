import React, { forwardRef, useEffect, useRef } from 'react'
import { Animated, Keyboard, Text, TouchableHighlight, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons';

import { useDispatch } from 'react-redux'
import { setDestination } from '../slices/mainSlice'

const SlideInMenu = forwardRef((props, ref) => {
  const dispatch = useDispatch()
  const slideIn = useRef(new Animated.Value(0)).current
  const fadeIn = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (props.open) {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(slideIn, {
            toValue: -Math.abs(props.size),
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(fadeIn, {
            toValue: 0.4,
            useNativeDriver: true,
          }),
        ]),
      ]).start()
    }
  }, [props.open])

  const handleClose = () => {
    dispatch(setDestination(null))
    props.setDirectionsView(false)

    Animated.sequence([
      Animated.parallel([
        Animated.timing(slideIn, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeIn, {
          toValue: 0,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      Keyboard.dismiss()
      props.setOpen(false)
      props.fitUser()
    })
  }

  return (
    <View 
      style= {{
        position: 'absolute',
        bottom: 0,
        display: props.open ? 'flex' : 'none',
        width: '100%',
        height: props.size,
      }}
    >  
      <Animated.View 
        style={{ 
          position: 'absolute',
          bottom: -Math.abs(props.size),
          transform: [{ translateY: slideIn }],
          width: '100%',
          height: props.size,
          padding: 4,
          backgroundColor: '#FFF',
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
      >
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <TouchableHighlight 
            activeOpacity={0.6}
            underlayColor="#DDDDDD"
            style={{
              borderRadius: 32
            }}
            onPress={handleClose}
          >
            <Ionicons name="close" size={35} color="black" />
          </TouchableHighlight>
          
          <Text style={{ marginLeft: 4, fontSize: 21, fontWeight: '600' }}>{props.title}</Text>
        </View>

        <View style={{ height: props.size - 50, paddingHorizontal: 12, paddingTop: 16 }}>
          {props.children}
        </View>
      </Animated.View>
    </View>
  )
})

export default SlideInMenu