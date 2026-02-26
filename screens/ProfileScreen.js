import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { auth } from '../App';
import { signOut } from 'firebase/auth';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.email}>{auth.currentUser?.email}</Text>
      <Button mode="contained" onPress={() => signOut(auth)} textColor="white" buttonColor="red">退出登录</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20, justifyContent:'center' },
  email: { textAlign:'center', fontSize:18, marginBottom:20 }
});
