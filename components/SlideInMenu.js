import React, { useEffect, useRef } from 'react'
import { Animated, Text, TouchableWithoutFeedback, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons';

export default function SlideInMenu({children, open, setOpen, title}) {
  const slideIn = useRef(new Animated.Value(0)).current
  const fadeIn = useRef(new Animated.Value(0)).current
  
  useEffect(() => {
    if (open) {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(slideIn, {
            toValue: -200,
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
  }, [open])

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
    ]).start(() => {setOpen(false)})
  }

  return (
    <View 
      style= {{
        position: 'absolute',
        display: open ? 'flex' : 'none',
        width: '100%',
        height: '100%',
      }}
    >
      <TouchableWithoutFeedback style={{ width: '100%', height: '100%' }} onPress={handleClose}>
        <Animated.View
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'rgb(0, 0, 0)',
            opacity: fadeIn
          }}
        />
      </TouchableWithoutFeedback>
        
      <Animated.View 
        style={{ 
          position: 'absolute',
          bottom: -200,
          transform: [{ translateY: slideIn }],
          width: '100%',
          height: 200,
          padding: 4,
          backgroundColor: '#fff',
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
      >
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <TouchableWithoutFeedback onPress={handleClose}>
            <Ionicons name="close" size={36} color="black" />
          </TouchableWithoutFeedback>
          
          <Text style={{ fontSize: 21, fontWeight: '600' }}>{title}</Text>
        </View>

        <View style={{ paddingHorizontal: 12, paddingTop: 8 }}>
          {children}
        </View>
      </Animated.View>
    </View>
  )
}