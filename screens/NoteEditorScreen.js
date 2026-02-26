import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, SegmentedButtons, Snackbar } from 'react-native-paper';
import { db, auth } from '../App';
import { doc, setDoc, deleteDoc, collection } from 'firebase/firestore';

export default function NoteEditorScreen({ route, navigation }) {
  const { note } = route.params || {};
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState('medium');
  const [error, setError] = useState('');

  useEffect(() => {
    if (note) { setTitle(note.title); setContent(note.content); setPriority(note.priority); }
  }, [note]);

  const save = async () => {
    if (!title) return setError('标题不能为空');
    const data = {
      title, content, priority, userId: auth.currentUser.uid,
      createdAt: note?.createdAt || new Date(),
      updatedAt: new Date()
    };
    await setDoc(doc(db, 'notes', note?.id || Date.now().toString()), data, { merge: true });
    navigation.goBack();
  };

  const del = async () => {
    if (note) await deleteDoc(doc(db, 'notes', note.id));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput label="标题" value={title} onChangeText={setTitle} style={styles.input} />
      <TextInput label="内容" value={content} onChangeText={setContent} multiline style={styles.contentInput} />
      <SegmentedButtons value={priority} onValueChange={setPriority} buttons={[
        { value: 'high', label: '高' }, { value: 'medium', label: '中' }, { value: 'low', label: '低' }
      ]} />
      <View style={styles.btns}>
        <Button mode="contained" onPress={save} style={styles.save}>保存</Button>
        {note && <Button mode="outlined" onPress={del} textColor="red">删除</Button>}
      </View>
      <Snackbar visible={!!error} onDismiss={() => setError('')}>{error}</Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:16 },
  input: { marginBottom:12 },
  contentInput: { height:180, marginVertical:12 },
  btns: { flexDirection:'row', gap:12, marginTop:20 }
});
