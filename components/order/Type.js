import React, { useState } from 'react'
import { Appearance, StyleSheet } from 'react-native'
import Overlay from '../Overlay'
import { View, Text, PrimaryTouchableHighlight, SecondaryTouchableOpacity } from '../Themed'

import Colors from '../../constants/Colors'

import { useDispatch, useSelector } from 'react-redux'
import { selectOrderType, setOrderType } from '../../slices/orderSlice'

export default function Type({ visible, setVisible }) {
  const dispatch = useDispatch()
  const orderType = useSelector(selectOrderType)
  const [type, setType] = useState(orderType)

  const [theme, setTheme] = useState(Appearance.getColorScheme())

  Appearance.addChangeListener((T) => {
    setTheme(T.colorScheme)
  })

  return (
    <Overlay visible={visible} dismiss={() => { setType(orderType); setVisible(false); }}>
      <View style={styles.modalView}>
        <Text style={{ marginBottom: 2, textAlign: 'center', fontSize: 17, fontWeight: '500' }}>Choose your request type</Text>

        <View style={[styles.typeContainer]}>
          <SecondaryTouchableOpacity style={[styles.box, type === 'taxi' ? { backgroundColor: Colors[theme]['tertiaryBackground'] } : {}]} onPress={() => setType('taxi')}>
            <Text>1</Text>
          </SecondaryTouchableOpacity>

          <SecondaryTouchableOpacity style={[styles.box, type === 'secondDriver' ? { backgroundColor: Colors[theme]['tertiaryBackground'] } : {}]} onPress={() => setType('secondDriver')}>
            <Text>2</Text>
          </SecondaryTouchableOpacity>
        </View>
        
        <PrimaryTouchableHighlight 
          style={styles.button} 
          onPress={() => { 
            dispatch(setOrderType(type))
            setVisible(false) 
          }}
        >
          <Text style={{ color: 'white', fontSize: 15, fontWeight: '500' }}>Save</Text>
        </PrimaryTouchableHighlight>
      </View>
    </Overlay>
  )
}

const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      margin: 0,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalView: {
      alignItems: 'center',
      width: '75%',
      padding: 20,
      borderRadius: 21,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 5,
    },
    typeContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginTop: 10,
      marginBottom: 16
    },
    box: {
      width: '46%',
      height: 60,
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 5,
      marginHorizontal: '2%',
      borderRadius: 12
    },
    button: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 12
    }
})