import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native'

import Layout from '../components/Layout'
import HistoryItem from '../components/HistoryItem';

import { useSelector } from 'react-redux'
import { selectUserToken } from '../slices/authSlice'

import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from '../firebase'

export default function HistoryScreen({ navigation }) {
  const userToken = useSelector(selectUserToken)
  const [history, setHistory] = useState([])
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    readUserHistory(userToken)
  }, [])

  const readUserHistory = async (userToken) => {
    let date = null

    try {
      date = await AsyncStorage.getItem('history')
      date = new Date(date)
    } catch(e) {

    }

    let data = []
    const q = date ? query(collection(firestore, "calls"), where("user", "==", userToken), where("status", "==", 'done'), where("finished_at", ">", date)) : query(collection(firestore, "calls"), where("user", "==", userToken), where("status", "==", 'done'))
    const querySnapshot = await getDocs(q)

    querySnapshot.forEach((doc) => {
      const item = doc.data();
      Object.assign(item, { id: doc.id })
      item.created_at = item.created_at.toDate();
      item.finished_at = item.finished_at.toDate();

      data.push(item)
    });

    data.sort((a, b) => b.created_at - a.created_at)

    setHistory(data)
  };

  return (
    <Layout title='History' navigation={navigation} backScreen='Home'>
      {
        history.length > 0 && (
          <FlatList
            data={history}
            renderItem={({ item }) => <HistoryItem item={item} selectedId={selectedId} setSelectedId={setSelectedId} />}
            keyExtractor={item => item.id}
            style={{ marginTop: 20, marginHorizontal: 40 }}
          />
        )
      }
    </Layout>
  )
}
