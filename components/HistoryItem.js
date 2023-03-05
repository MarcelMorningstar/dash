import React, { useState} from 'react'
import { StyleSheet, TouchableWithoutFeedback, View} from 'react-native'
import { Div, Text } from './Themed';
import Moment from 'moment';

function Directions({ display, addressFrom, addressTo }) {
    const [top, setTop] = useState(0)
    const [b, setB] = useState(0)

    return (
        <View style={[styles.row, { position: 'relative', display: display ? 'flex' : 'none', marginTop: 4, marginLeft: 64 }]}>
            {
                top != 0 && b != 0 && (
                    <Div style={{ position: 'absolute', top: top, left: -5, width: 8, height: 8 + top + b / 1.8, backgroundColor: 'transparent', borderTopWidth: 1, borderBottomWidth: 1, borderLeftWidth: 1 }} />
                )
            }
            <View>
                <View onLayout={(event) => { setTop(event.nativeEvent.layout.height / 1.94) }} style={[styles.row, { alignItems: 'center', marginBottom: 4 }]}>
                    <Text style={styles.circle}>○</Text>
                    <Text style={{ fontSize: 15, lineHeight: 15 }}>{addressFrom}</Text>
                </View>
                <View onLayout={(event) => { setB(event.nativeEvent.layout.height) }} style={[styles.row, { alignItems: 'center', marginTop: 4 }]}>
                    <Text style={styles.circle}>○</Text>
                    <Text style={{ fontSize: 15, lineHeight: 15 }}>{addressTo}</Text>
                </View>
            </View>
        </View>
    )
}

export default function HistoryItem({ item, selectedId, setSelectedId }) {
    const display = item.id === selectedId ? true : false

    Moment.locale('en')

    const start = Moment(item.created_at)
    const end = Moment(item.finished_at)
    let hours = 0
    let minutes = end.diff(start, 'minutes')
    let seconds = 0

    if (minutes > 59) {
      hours = Math.floor(minutes / 60)
      minutes = minutes - (hours * 60)
    } else if (minutes == 0) {
      seconds = end.diff(start, 'seconds')
    }

    return (
        <View>
            <TouchableWithoutFeedback onPress={() => item.id !== selectedId ? setSelectedId(item.id) : setSelectedId(null)}>
            <View style={styles.column}>
                <View style={[styles.row, styles.item]}>
                    <View style={[styles.row, {maxWidth: '66%'}]}>
                        <View style={styles.picContainer}></View>
                    
                        <View>
                        <View style={[styles.row, { flexWrap: 'wrap', alignItems: 'center' }]}>
                            <Text style={styles.travelInformation}>{ item.travelInformation.distance } km</Text>
                            <Text style={styles.circle}>●</Text>
                            { hours != 0 && <Text style={styles.travelInformation}>{ `${hours} ${ hours == 1 ? 'hour' : 'hours' }` }</Text> }
                            { hours != 0 && minutes != 0 && <Text style={styles.travelInformation}>{ ', ' }</Text> }
                            { minutes != 0 && <Text style={styles.travelInformation}>{ `${minutes} ${ minutes == 1 ? 'minute' : 'minutes' }` }</Text> }
                            { seconds != 0 && <Text style={styles.travelInformation}>{ `${seconds} seconds` }</Text> }
                        </View>
                        <Text style={styles.date}>{ Moment(item.created_at).format('HH:mm, MMMM D, YYYY') }</Text>
                        </View>
                    </View>
                    
                    <Text style={styles.price}>{item.price.toFixed(2)}€</Text>
                </View>

                <Directions display={display} addressFrom={item.user.address} addressTo={item.destination.address} />
            </View>
            </TouchableWithoutFeedback>

            <View style={styles.line}></View>
        </View>
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
    item: {
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
    },
    picContainer: {
        width: 48, 
        height: 48, 
        marginHorizontal: 8, 
        backgroundColor: '#DDDDDD', 
        borderRadius: 24
    },
    travelInformation: {
        fontSize: 15,
        fontWeight: '500'
    },
    date: {
        fontSize: 12,
        fontWeight: '400',
        color: '#717171'
    },
    price: {
        paddingHorizontal: 8,
        fontSize: 16,
        fontWeight: '500'
    },
    circle: {
        marginHorizontal: 5,
        fontSize: 8, 
    },
    line: {
        width: '100%', 
        height: 1, 
        marginTop: 8, 
        marginBottom: 16, 
        backgroundColor: '#B1B1B1'
    }
})