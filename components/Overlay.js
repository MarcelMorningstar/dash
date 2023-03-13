import React from 'react'
import { Modal, StyleSheet, TouchableWithoutFeedback, View } from 'react-native'
import { StatusBar } from './Themed';

export default function Overlay({ children, visible, dismiss }) {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
        >
            <TouchableWithoutFeedback onPress={dismiss}>
                <View style={styles.modalOverlay} />
            </TouchableWithoutFeedback>

            <View style={styles.centeredView}>
                { children }
            </View>

            <StatusBar backgroundColor='rgba(0, 0, 0, 0.32)' />
        </Modal>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.32)'
    },
})