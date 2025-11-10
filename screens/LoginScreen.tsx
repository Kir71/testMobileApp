// screens/LoginScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  function validateEmail(e: string) {
    const re = /\S+@\S+\.\S+/;
    return re.test(e);
  }

  const fakeAuth = (email: string, password: string) => {
    return new Promise<{ token: string; name: string }>((resolve, reject) => {
      setTimeout(() => {
        if (email === 'test@example.com' && password === '1234') {
          resolve({ token: 'fake-jwt-token', name: 'Test User' });
        } else {
          reject(new Error('Incorrect email or password'));
        }
      }, 1000);
    });
  };

  const onLogin = async () => {
    if (!email || !password) {
      Alert.alert('Validation', 'Please enter email and password');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Validation', 'Please enter a valid email');
      return;
    }

    setLoading(true);
    try {
      const res = await fakeAuth(email.trim(), password);
      await AsyncStorage.setItem('userToken', res.token);
      await AsyncStorage.setItem('userName', res.name);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (err: any) {
      Alert.alert('Login failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Welcome</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={onLogin} disabled={loading}>
          {loading ? <ActivityIndicator /> : <Text style={styles.buttonText}>Login</Text>}
        </TouchableOpacity>

        <Text style={styles.hint}>
          Use <Text style={{ fontWeight: '600' }}>test@example.com</Text> /{' '}
          <Text style={{ fontWeight: '600' }}>1234</Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f2f3f5' },
  card: { width: '90%', maxWidth: 400, padding: 24, backgroundColor: 'white', borderRadius: 10, elevation: 4 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 16, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, marginBottom: 12 },
  button: { backgroundColor: '#2563eb', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  buttonText: { color: 'white', fontWeight: '600' },
  hint: { marginTop: 12, textAlign: 'center', color: '#666' },
});
