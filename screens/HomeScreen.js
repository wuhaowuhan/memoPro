import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { FAB, Text } from 'react-native-paper';
import { FlashList } from '@shopify/flash-list';
import { db, auth } from '../App';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import NoteCard from '../components/NoteCard';

export default function HomeScreen({ navigation }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'notes'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('updatedAt', 'desc')
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotes(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  return (
    <View style={styles.container}>
      {loading ? <Text style={styles.loading}>加载中...</Text> :
        <FlashList
          data={notes}
          estimatedItemSize={100}
          renderItem={({ item }) => <NoteCard note={item} navigation={navigation} />}
        />
      }
      <FAB style={styles.fab} icon="plus" onPress={() => navigation.navigate('NoteEditor')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:16 },
  loading: { textAlign:'center', marginTop:20 },
  fab: { position:'absolute', bottom:20, right:20 }
});
