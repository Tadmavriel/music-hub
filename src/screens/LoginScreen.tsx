import React, { useState } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { useApp } from '../context/AppContext';
import { TopBar } from '../components/TopBar';
import { VinylRecord } from '../components/VinylRecord';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const { theme, t, login: doLogin, hasAccount } = useApp();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!login.trim()) { setError(t.fillLogin); return; }
    if (password.length < 6) { setError(t.minPassword); return; }
    const err = await doLogin(login, password);
    if (err === 'noAccount') { navigation.replace('Register'); return; }
    if (err === 'badCreds') { setError(t.badCreds); return; }
    if (err) { setError('Error'); return; }
    navigation.replace('Main');
  };

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <TopBar />

        <View style={styles.vinylWrap}>
          <VinylRecord size={180} color={theme.primary} />
        </View>

        <Text style={[styles.appName, { color: theme.primary }]}>♪ {t.appName}</Text>
        <Text style={[styles.title, { color: theme.text }]}>{t.welcome}</Text>
        <Text style={[styles.subtitle, { color: theme.mutedText }]}>{t.loginSubtitle}</Text>

        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.label, { color: theme.text }]}>{t.login}</Text>
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.surfaceMuted }]}
            placeholder={t.loginPlaceholder}
            placeholderTextColor={theme.placeholder}
            autoCapitalize="none"
            value={login}
            onChangeText={(v) => { setLogin(v); setError(''); }}
          />

          <Text style={[styles.label, { color: theme.text }]}>{t.password}</Text>
          <View style={[styles.passRow, { borderColor: theme.border, backgroundColor: theme.surfaceMuted }]}>
            <TextInput
              style={[styles.passInput, { color: theme.text }]}
              placeholder={t.passwordPlaceholder}
              placeholderTextColor={theme.placeholder}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              value={password}
              onChangeText={(v) => { setPassword(v); setError(''); }}
            />
            <Pressable onPress={() => setShowPassword(v => !v)} style={styles.eyeBtn}>
              <Text style={styles.eyeText}>{showPassword ? '🙈' : '👁'}</Text>
            </Pressable>
          </View>

          {error ? <Text style={[styles.error, { color: '#FF6B9D' }]}>{error}</Text> : null}

          <Pressable
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: pressed ? theme.primaryPressed : theme.primary }
            ]}
            onPress={handleLogin}
          >
            <Text style={styles.buttonText}>{t.loginButton}</Text>
          </Pressable>

          <Pressable onPress={() => navigation.replace('Register')} style={styles.linkBtn}>
            <MaterialCommunityIcons name="account-plus" size={16} color={theme.primary} />
            <Text style={[styles.linkText, { color: theme.primary }]}>{t.registerButton}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen:     { flex: 1 },
  scroll:     { flexGrow: 1, padding: 24, paddingTop: 48 },
  vinylWrap:  { alignItems: 'center', marginBottom: 24 },
  appName:    { fontSize: 13, fontWeight: '900', letterSpacing: 2, textAlign: 'center', marginBottom: 10 },
  title:      { fontSize: 28, fontWeight: '900', textAlign: 'center', marginBottom: 6 },
  subtitle:   { fontSize: 15, textAlign: 'center', marginBottom: 28 },
  card:       { padding: 24, borderRadius: 24, borderWidth: 1 },
  label:      { fontSize: 13, fontWeight: '800', marginBottom: 8, marginTop: 12 },
  input:      { height: 54, borderRadius: 14, borderWidth: 1, paddingHorizontal: 16, fontSize: 16 },
  passRow:    { height: 54, flexDirection: 'row', alignItems: 'center', borderRadius: 14, borderWidth: 1 },
  passInput:  { flex: 1, height: '100%', paddingHorizontal: 16, fontSize: 16 },
  eyeBtn:     { paddingHorizontal: 14 },
  eyeText:    { fontSize: 18 },
  error:      { fontSize: 14, marginTop: 12, fontWeight: '700' },
  button:     { height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '900', letterSpacing: 0.5 },
  linkBtn:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 16, paddingVertical: 8 },
  linkText:   { fontSize: 14, fontWeight: '800' }
});