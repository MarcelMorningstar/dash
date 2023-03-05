import React, { useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { Div2, Feather, FontAwesome5, MaterialIcons, Text } from '../components/Themed'

import Layout from '../components/Layout'
import SectionLine from '../components/SectionLine'
import ButtonLine from '../components/ButtonLine'

export default function PaymentScreen({ navigation }) {
  const [method, setMethod] = useState('card')

  return (
    <Layout title='Payment' navigation={navigation} backScreen='Home'>
      <View style={[styles.container, styles.column]}>
        <View style={[styles.column, styles.view]}>
          <View style={[styles.row, { marginBottom: 5 }]}>
            <Text style={{ fontSize: 18, fontWeight: '400' }}>Balance: </Text>
            <Text style={{ fontSize: 18, fontWeight: '500' }}>{ '12.00' }€</Text>
          </View>

          <View>
            <TouchableOpacity style={styles.btn} onPress={() => {}}>
              <View style={[styles.row, { alignItems: 'center' }]}>
                <MaterialIcons name="local-atm" size={28} style={{ marginRight: 12 }} />
                <Text style={{ fontSize: 14 }}>Add Balance</Text>
              </View>
            </TouchableOpacity>

            <ButtonLine />

            <TouchableOpacity style={styles.btn} onPress={() => {}}>
              <View style={[styles.row, { alignItems: 'center' }]}>
                <Feather name="clock" size={28} style={{ marginRight: 12 }} />
                <Text style={{ fontSize: 14 }}>See Transactions</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <SectionLine />
        
        <View style={[styles.column, styles.view]}>
          <Text style={{ marginVertical: 5, fontSize: 16, fontWeight: '500' }}>Payment Method</Text>

          <View>
            <TouchableOpacity style={styles.btn} onPress={() => setMethod('card')}>
              <View style={[styles.row, { justifyContent: 'space-between', alignItems: 'center' }]}>
                <View style={[styles.row, { alignItems: 'center' }]}>
                  <MaterialIcons name="credit-card" size={28} style={{ marginRight: 12 }} />
                  <Text style={{ fontSize: 14 }}>Bank Card</Text>
                </View>
                {
                  method == 'card' && <Div2 style={styles.circle} />
                }
              </View>
            </TouchableOpacity>

            <ButtonLine />

            <TouchableOpacity style={styles.btn} onPress={() => setMethod('balance')}>
              <View style={[styles.row, { justifyContent: 'space-between', alignItems: 'center' }]}>
                <View style={[styles.row, { alignItems: 'center' }]}>
                  <MaterialIcons name="local-atm" size={28} style={{ marginRight: 12 }} />
                  <Text style={{ fontSize: 14 }}>App Balance</Text>
                </View>
                {
                  method == 'balance' && <Div2 style={styles.circle} />
                }
              </View>
            </TouchableOpacity>

            <ButtonLine />

            <TouchableOpacity style={styles.btn} onPress={() => setMethod('cash')}>
              <View style={[styles.row, { justifyContent: 'space-between', alignItems: 'center' }]}>
                <View style={[styles.row, { alignItems: 'center' }]}>
                  <FontAwesome5 name="money-bill-wave" size={22} style={{ marginRight: 12 }} />
                  <Text style={{ fontSize: 14 }}>Cash</Text>
                </View>
                {
                  method == 'cash' && <Div2 style={styles.circle} />
                }
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Layout>
  )
}

const styles = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row'
  },
  column: {
    display: 'flex',
    flexDirection: 'column'
  },
  container: {
    flex: 1,
    alignItems: 'center'
  },
  view: {
    width: '80%',
    paddingVertical: 8
  },
  btn: {
    height: 44, 
    paddingHorizontal: 8, 
    justifyContent: 'center'
  },
  circle: {
    width: 21,
    height: 21,
    backgroundColor: 'transparant',
    borderWidth: 5,
    borderRadius: 12,
  }
})