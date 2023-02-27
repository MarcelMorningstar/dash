import React from 'react'
import { Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native'

import { signOut } from "firebase/auth";
import { auth } from '../firebase'

export default function Logout({ visible, setVisible }) {
    const handleSignOut = () => {
        signOut(auth).then(() => {
          
        }).catch((error) => {
            console.log(error)
        });
    }

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={{ marginBottom: 2, textAlign: 'center', fontSize: 21, fontWeight: '500' }}>Log out</Text>
                    <Text style={{ marginVertical: 8, textAlign: 'center', fontSize: 14 }}>Are you sure want to log out?</Text>

                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                        <TouchableOpacity
                            style={[styles.button, { marginRight: 4, backgroundColor: '#ED4337' }]}
                            onPress={handleSignOut}
                        >
                            <Text style={{ color: 'white', fontWeight: '500' }}>Log out</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, { marginLeft: 4, backgroundColor: '#F0F0F0' }]}
                            onPress={() => setVisible(false)}
                        >
                            <Text style={{ color: 'black', fontWeight: '500' }}>Back</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 21,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 16
    }
})