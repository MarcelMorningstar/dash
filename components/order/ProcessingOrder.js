import React from 'react'
import { StyleSheet, TouchableHighlight, View } from 'react-native'
import { Text } from '../Themed'

export default function ProcessingOrder({ orderToken, orderInformation, cancelOrder, setDirectionsView, colseSlideIn }) {
  return (
    <View style={{ flex: 1, justifyContent: 'space-between' }}>
      <View>
        <Text>Destination: { orderInformation?.destination.address }</Text>
        <Text>Distance: { orderInformation?.travelInformation.distance }</Text>
        <Text>Duration: { orderInformation?.travelInformation.duration }</Text>
      </View>
      <View>
        <TouchableHighlight
          activeOpacity={0.6}
          underlayColor="#6A6A6A"
          style={{ 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'center', 
            width: '100%', 
            height: 50, 
            paddingHorizontal: 16, 
            backgroundColor: '#555555', 
            borderRadius: 12 
          }}
          onPress={() => {
            cancelOrder(orderToken)
            colseSlideIn()
            setDirectionsView(false)
          }}
        >
          <Text style={{ color: 'white', fontSize: 18, fontWeight: '500' }}>Cancel</Text>
        </TouchableHighlight>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({

})