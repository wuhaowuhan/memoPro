import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Snackbar } from 'react-native-paper';
import { auth } from '../App';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async () => {
    if (!email || !password) return setError('请输入邮箱和密码');
    setLoading(true);
    try {
      if (isLogin) await signInWithEmailAndPassword(auth, email, password);
      else await createUserWithEmailAndPassword(auth, email, password);
    } catch (e) {
      setError(e.message);
    } finally { setLoading(false); }
  };

  const resetPassword = async () => {
    if (!email) return setError('请输入邮箱');
    try { await sendPasswordResetEmail(auth, email); setError('重置邮件已发送'); }
    catch (e) { setError(e.message); }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? '登录' : '注册'}</Text>
      <TextInput label="邮箱" value={email} onChangeText={setEmail} keyboardType="email-address" style={styles.input} />
      <TextInput label="密码" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <Button mode="contained" onPress={handleAuth} loading={loading} style={styles.btn}>{isLogin ? '登录' : '注册'}</Button>
      <Button onPress={() => setIsLogin(!isLogin)}>{isLogin ? '没有账号？去注册' : '已有账号？去登录'}</Button>
      {isLogin && <Button onPress={resetPassword}>忘记密码</Button>}
      <Snackbar visible={!!error} onDismiss={() => setError('')}>{error}</Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:20, justifyContent:'center' },
  title: { fontSize:28, fontWeight:'bold', marginBottom:20, textAlign:'center' },
  input: { marginBottom:12 },
  btn: { marginVertical:10 }
});
