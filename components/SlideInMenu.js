import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { Animated, Keyboard, Pressable, Text, TouchableHighlight, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons';

const SlideInMenu = forwardRef((props, ref) => {
  const slideIn = useRef(new Animated.Value(0)).current
  const fadeIn = useRef(new Animated.Value(0)).current
  
  useImperativeHandle(ref, () => ({
    close() {
      handleClose()
    }
  }));

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
    })
  }

  return (
    <View 
      style= {{
        position: 'absolute',
        display: props.open ? 'flex' : 'none',
        width: '100%',
        height: '100%',
      }}
    >
      <Pressable style={{ width: '100%', height: '100%' }} onPress={handleClose}>
        <Animated.View
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'rgb(0, 0, 0)',
            opacity: fadeIn
          }}
        />
      </Pressable>
        
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

        <View style={{ paddingHorizontal: 12, paddingTop: 16 }}>
          {props.children}
        </View>
      </Animated.View>
    </View>
  )
})

export default SlideInMenu