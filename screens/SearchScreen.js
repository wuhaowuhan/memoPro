import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Searchbar, Text } from 'react-native-paper';
import { FlashList } from '@shopify/flash-list';
import { db, auth } from '../App';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import NoteCard from '../components/NoteCard';

export default function SearchScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [notes, setNotes] = useState([]);
  const [allNotes, setAllNotes] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'notes'), where('userId', '==', auth.currentUser.uid));
    onSnapshot(q, (snap) => {
      setAllNotes(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  useEffect(() => {
    const res = allNotes.filter(n => 
      n.title.includes(search) || n.content.includes(search)
    );
    setNotes(res);
  }, [search]);

  return (
    <View style={styles.container}>
      <Searchbar placeholder="搜索标题或内容" value={search} onChangeText={setSearch} />
      <FlashList data={notes} estimatedItemSize={100} renderItem={({ item }) => <NoteCard note={item} navigation={navigation} />} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:16 }
});
