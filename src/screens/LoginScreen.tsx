import React, { useState } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet,
  KeyboardAvoidingView, ScrollView, Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { useApp } from '../context/AppContext';
import { TopBar } from '../components/TopBar';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const { theme, t, login: doLogin, fontSizeMultiplier } = useApp();
  const fs = (size: number) => size * fontSizeMultiplier;

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
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TopBar />

        {/* ШАПКА С ИКОНКОЙ */}
        <View style={styles.header}>
          <View style={[styles.iconCircleOuter, { backgroundColor: theme.primary + '22' }]}>
            <View style={[styles.iconCircleInner, { backgroundColor: theme.surface, borderColor: theme.primary }]}>
              <MaterialCommunityIcons name="school" size={fs(56)} color={theme.primary} />
            </View>
          </View>
        </View>

        <Text style={[styles.appName, { color: theme.primary, fontSize: fs(11) }]}>
          {t.appName}
        </Text>
        <Text style={[styles.title, { color: theme.text, fontSize: fs(26) }]}>
          {t.welcome}
        </Text>
        <Text style={[styles.subtitle, { color: theme.mutedText, fontSize: fs(14) }]}>
          {t.loginSubtitle}
        </Text>

        {/* КАРТОЧКА С ФОРМОЙ */}
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.label, { color: theme.mutedText, fontSize: fs(12) }]}>
            {t.login.toUpperCase()}
          </Text>
          <View style={[styles.inputWrap, { borderColor: theme.border, backgroundColor: theme.surfaceMuted }]}>
            <MaterialCommunityIcons name="account-outline" size={fs(20)} color={theme.mutedText} />
            <TextInput
              style={[styles.input, { color: theme.text, fontSize: fs(15) }]}
              placeholder={t.loginPlaceholder}
              placeholderTextColor={theme.placeholder}
              autoCapitalize="none"
              value={login}
              onChangeText={(v) => { setLogin(v); setError(''); }}
            />
          </View>

          <Text style={[styles.label, { color: theme.mutedText, fontSize: fs(12) }]}>
            {t.password.toUpperCase()}
          </Text>
          <View style={[styles.inputWrap, { borderColor: theme.border, backgroundColor: theme.surfaceMuted }]}>
            <MaterialCommunityIcons name="lock-outline" size={fs(20)} color={theme.mutedText} />
            <TextInput
              style={[styles.input, { color: theme.text, fontSize: fs(15) }]}
              placeholder={t.passwordPlaceholder}
              placeholderTextColor={theme.placeholder}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              value={password}
              onChangeText={(v) => { setPassword(v); setError(''); }}
            />
            <Pressable onPress={() => setShowPassword(v => !v)} hitSlop={8}>
              <MaterialCommunityIcons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={fs(20)}
                color={theme.mutedText}
              />
            </Pressable>
          </View>

          {error ? (
            <View style={[styles.errorBox, { backgroundColor: '#E5484D22' }]}>
              <MaterialCommunityIcons name="alert-circle-outline" size={fs(16)} color="#E5484D" />
              <Text style={[styles.errorText, { fontSize: fs(13) }]}>{error}</Text>
            </View>
          ) : null}

          <Pressable
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: pressed ? theme.primaryPressed : theme.primary }
            ]}
            onPress={handleLogin}
          >
            <Text style={[styles.buttonText, { fontSize: fs(16) }]}>{t.loginButton}</Text>
            <MaterialCommunityIcons name="arrow-right" size={fs(20)} color="#FFF" />
          </Pressable>

          <Pressable onPress={() => navigation.replace('Register')} style={styles.linkBtn}>
            <Text style={[styles.linkText, { color: theme.mutedText, fontSize: fs(13) }]}>
              Нет аккаунта?
            </Text>
            <Text style={[styles.linkText, { color: theme.primary, fontSize: fs(13), fontWeight: '900' }]}>
              {' '}{t.registerButton}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen:     { flex: 1 },
  scroll:     { flexGrow: 1, padding: 24, paddingTop: 48, paddingBottom: 48 },

  header:     { alignItems: 'center', marginBottom: 20 },
  iconCircleOuter: { width: 130, height: 130, borderRadius: 65, alignItems: 'center', justifyContent: 'center' },
  iconCircleInner: { width: 110, height: 110, borderRadius: 55, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },

  appName:    { fontWeight: '900', letterSpacing: 3, textAlign: 'center', marginBottom: 8 },
  title:      { fontWeight: '900', textAlign: 'center', marginBottom: 4 },
  subtitle:   { textAlign: 'center', marginBottom: 24 },

  card:       { padding: 22, borderRadius: 24, borderWidth: 1 },
  label:      { fontWeight: '900', letterSpacing: 1, marginBottom: 8, marginTop: 12 },

  inputWrap:  { flexDirection: 'row', alignItems: 'center', height: 52, borderRadius: 14, borderWidth: 1, paddingHorizontal: 14, gap: 10 },
  input:      { flex: 1, height: '100%' },

  errorBox:   { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 10, borderRadius: 10, marginTop: 12 },
  errorText:  { color: '#E5484D', fontWeight: '700', flex: 1 },

  button:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 54, borderRadius: 16, marginTop: 20 },
  buttonText: { color: '#FFFFFF', fontWeight: '900', letterSpacing: 0.3 },

  linkBtn:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 16, paddingVertical: 8 },
  linkText:   { fontWeight: '600' },
});