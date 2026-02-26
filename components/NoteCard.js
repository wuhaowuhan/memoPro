import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text } from 'react-native-paper';
import dayjs from 'dayjs';

export default function NoteCard({ note, navigation }) {
  const colors = { high: '#f44336', medium: '#ff9800', low: '#4caf50' };
  return (
    <TouchableOpacity onPress={() => navigation.navigate('NoteEditor', { note })}>
      <Card style={styles.card}>
        <View style={[styles.badge, { backgroundColor: colors[note.priority] }]} />
        <Card.Content>
          <Text style={styles.title} numberOfLines={1}>{note.title}</Text>
          <Text style={styles.content} numberOfLines={2}>{note.content}</Text>
          <Text style={styles.time}>{dayjs(note.updatedAt.toDate()).format('MM-DD HH:mm')}</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom:12, flexDirection:'row' },
  badge: { width:6 },
  title: { fontSize:16, fontWeight:'bold' },
  content: { color:'#666', marginVertical:4 },
  time: { fontSize:12, color:'#999' }
});
