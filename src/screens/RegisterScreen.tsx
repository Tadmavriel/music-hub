import React, { useState } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet, ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { useApp } from '../context/AppContext';
import { TopBar } from '../components/TopBar';
import { VinylRecord } from '../components/VinylRecord';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const { theme, t, register } = useApp();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!login.trim() || !password || !confirm) { setError(t.allFields); return; }
    if (password.length < 6) { setError(t.minPassword); return; }
    if (password !== confirm) { setError(t.passwordsMismatch); return; }
    const err = await register(login, password);
    if (err) { setError('Error'); return; }
    navigation.replace('Main');
  };

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: theme.background }]}
      behavior="padding"
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TopBar />

        <View style={styles.vinylWrap}>
          <VinylRecord size={130} color={theme.primary} />
        </View>

        <Text style={[styles.appName, { color: theme.primary }]}>{t.appName}</Text>
        <Text style={[styles.title, { color: theme.text }]}>{t.registerTitle}</Text>
        <Text style={[styles.subtitle, { color: theme.mutedText }]}>{t.registerSubtitle}</Text>

        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.label, { color: theme.mutedText }]}>{t.login}</Text>
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.surfaceMuted }]}
            placeholder={t.loginPlaceholder}
            placeholderTextColor={theme.placeholder}
            autoCapitalize="none"
            value={login}
            onChangeText={(v) => { setLogin(v); setError(''); }}
          />

          <Text style={[styles.label, { color: theme.mutedText }]}>{t.password}</Text>
          <View style={[styles.passRow, { borderColor: theme.border, backgroundColor: theme.surfaceMuted }]}>
            <TextInput
              style={[styles.passInput, { color: theme.text }]}
              placeholder={t.passwordPlaceholder}
              placeholderTextColor={theme.placeholder}
              secureTextEntry={!showPass}
              autoCapitalize="none"
              value={password}
              onChangeText={(v) => { setPassword(v); setError(''); }}
            />
            <Pressable onPress={() => setShowPass(v => !v)} style={styles.eyeBtn} hitSlop={8}>
              <MaterialCommunityIcons
                name={showPass ? 'eye-off-outline' : 'eye-outline'}
                size={22}
                color={theme.mutedText}
              />
            </Pressable>
          </View>

          <Text style={[styles.label, { color: theme.mutedText }]}>{t.repeatPassword}</Text>
          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.surfaceMuted }]}
            placeholder={t.repeatPasswordPlaceholder}
            placeholderTextColor={theme.placeholder}
            secureTextEntry={!showPass}
            autoCapitalize="none"
            value={confirm}
            onChangeText={(v) => { setConfirm(v); setError(''); }}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: pressed ? theme.primaryPressed : theme.primary }
            ]}
            onPress={handleRegister}
          >
            <Text style={styles.buttonText}>{t.registerButton}</Text>
          </Pressable>

          <Pressable onPress={() => navigation.replace('Login')} style={styles.linkBtn}>
            <MaterialCommunityIcons name="arrow-left" size={18} color={theme.primary} />
            <Text style={[styles.linkText, { color: theme.primary }]}>{t.backToLogin}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen:     { flex: 1 },
  scroll:     { flexGrow: 1, padding: 24, paddingTop: 48, paddingBottom: 48 },
  vinylWrap:  { alignItems: 'center', marginBottom: 20 },
  appName:    { fontSize: 12, fontWeight: '800', letterSpacing: 3, textAlign: 'center', marginBottom: 8 },
  title:      { fontSize: 26, fontWeight: '800', textAlign: 'center', marginBottom: 6 },
  subtitle:   { fontSize: 15, textAlign: 'center', marginBottom: 24 },
  card:       { padding: 22, borderRadius: 20, borderWidth: 1 },
  label:      { fontSize: 12, fontWeight: '700', letterSpacing: 0.5, marginBottom: 8, marginTop: 12 },
  input:      { height: 52, borderRadius: 12, borderWidth: 1, paddingHorizontal: 16, fontSize: 16 },
  passRow:    { height: 52, flexDirection: 'row', alignItems: 'center', borderRadius: 12, borderWidth: 1 },
  passInput:  { flex: 1, height: '100%', paddingHorizontal: 16, fontSize: 16 },
  eyeBtn:     { paddingHorizontal: 14 },
  error:      { fontSize: 14, marginTop: 12, fontWeight: '600', color: '#FF6B8A' },
  button:     { height: 54, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800', letterSpacing: 0.3 },
  linkBtn:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 14, paddingVertical: 8 },
  linkText:   { fontSize: 14, fontWeight: '700' }
});