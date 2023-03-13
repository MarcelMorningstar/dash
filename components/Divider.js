import React from 'react'
import { View } from 'react-native'

export default function Divider({ inset='center', width='100%', height=1, color='black', borderRadius=0 }) {
    return (
        <View 
            style={{ 
                alignSelf: inset,
                width: width, 
                height: height, 
                backgroundColor: color,
                borderRadius: borderRadius
            }} 
        />
    )
}