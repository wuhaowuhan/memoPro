import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Firebase 配置（替换为你自己的 Firebase 项目信息）
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyA5GZu1ikln_B-GkD_mJXefFX8Uyush7KE",
  authDomain: "memopro-7007b.firebaseapp.com",
  projectId: "memopro-7007b",
  storageBucket: "memopro-7007b.firebasestorage.app",
  messagingSenderId: "134604445521",
  appId: "1:134604445521:web:5af641a642280fab8fe570"
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
export const db = getFirestore(app);
enableIndexedDbPersistence(db).catch(() => {});

// 状态管理
import { create } from 'zustand';
export const useStore = create((set) => ({
  user: null,
  loading: false,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading })
}));

// 页面导入
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import ProfileScreen from './screens/ProfileScreen';
import NoteEditorScreen from './screens/NoteEditorScreen';

const Tab = createBottomTabNavigator();
const AuthStack = () => <LoginScreen />;

export default function App() {
  const { user, setUser } = useStore();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  return (
    <SafeAreaProvider>
      <PaperProvider dark={darkMode}>
        <NavigationContainer>
          {!user ? (
            <AuthStack />
          ) : (
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                  const icons = { Home: 'home', Search: 'search', Profile: 'person' };
                  return <Ionicons name={icons[route.name]} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#6200ee',
                tabBarInactiveTintColor: 'gray',
              })}
            >
              <Tab.Screen name="Home" component={HomeScreen} options={{ title: '备忘录' }} />
              <Tab.Screen name="Search" component={SearchScreen} options={{ title: '搜索' }} />
              <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: '我的' }} />
            </Tab.Navigator>
          )}
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
