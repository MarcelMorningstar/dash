import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { Marker } from 'react-native-maps'

import { getDownloadURL, ref } from "firebase/storage"
import { storage } from '../firebase'

export default function DriverMarker({ driver }) {
  const [image, setImage] = useState(null)

  useEffect(() => {
    const getDriverImage = async () => {
      let temp = null;

      try {
        temp = await getDownloadURL(ref(storage, `drivers/${driver.id}`))
        console.log(temp)
      } catch(e) { }
  
      setImage(temp)
    };

    getDriverImage()
  }, [])

  return (
    <Marker
      identifier={driver.id}
      coordinate={{
        latitude: driver.data.location.latitude,
        longitude: driver.data.location.longitude,
      }}
      anchor={{ x: 0.5, y: 0.5 }}
      width={40}
      height={40}
    >
      <View style={styles.picContainer}>
        <Image
          source={{ uri: image }}
          style={styles.image}
        />
      </View>
    </Marker>
  )
}

const styles = StyleSheet.create({
  picContainer: {
    width: 40, 
    height: 40, 
    borderWidth: 2,
    borderRadius: 20,
    borderColor: '#F5AD17' 
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 20
  }
})