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

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export function RegisterScreen({ navigation }: Props) {
  const { theme, t, register, fontSizeMultiplier } = useApp();
  const fs = (size: number) => size * fontSizeMultiplier;

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
    if (err) { setError(err); return; }
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

        <View style={styles.header}>
          <View style={[styles.iconCircleOuter, { backgroundColor: theme.primary + '22' }]}>
            <View style={[styles.iconCircleInner, { backgroundColor: theme.surface, borderColor: theme.primary }]}>
              <MaterialCommunityIcons name="account-plus" size={fs(48)} color={theme.primary} />
            </View>
          </View>
        </View>

        <Text style={[styles.appName, { color: theme.primary, fontSize: fs(11) }]}>
          {t.appName}
        </Text>
        <Text style={[styles.title, { color: theme.text, fontSize: fs(24) }]}>
          {t.registerTitle}
        </Text>
        <Text style={[styles.subtitle, { color: theme.mutedText, fontSize: fs(13) }]}>
          {t.registerSubtitle}
        </Text>

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
              onChangeText={setLogin}
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
              secureTextEntry={!showPass}
              autoCapitalize="none"
              value={password}
              onChangeText={setPassword}
            />
            <Pressable onPress={() => setShowPass(v => !v)} hitSlop={8}>
              <MaterialCommunityIcons
                name={showPass ? 'eye-off-outline' : 'eye-outline'}
                size={fs(20)}
                color={theme.mutedText}
              />
            </Pressable>
          </View>

          <Text style={[styles.label, { color: theme.mutedText, fontSize: fs(12) }]}>
            {t.repeatPassword.toUpperCase()}
          </Text>
          <View style={[styles.inputWrap, { borderColor: theme.border, backgroundColor: theme.surfaceMuted }]}>
            <MaterialCommunityIcons name="lock-check-outline" size={fs(20)} color={theme.mutedText} />
            <TextInput
              style={[styles.input, { color: theme.text, fontSize: fs(15) }]}
              placeholder={t.repeatPasswordPlaceholder}
              placeholderTextColor={theme.placeholder}
              secureTextEntry={!showPass}
              autoCapitalize="none"
              value={confirm}
              onChangeText={setConfirm}
            />
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
            onPress={handleRegister}
          >
            <Text style={[styles.buttonText, { fontSize: fs(16) }]}>{t.registerButton}</Text>
            <MaterialCommunityIcons name="check" size={fs(20)} color="#FFF" />
          </Pressable>

          <Pressable onPress={() => navigation.replace('Login')} style={styles.linkBtn}>
            <MaterialCommunityIcons name="arrow-left" size={fs(16)} color={theme.primary} />
            <Text style={[styles.linkText, { color: theme.primary, fontSize: fs(13), fontWeight: '900' }]}>
              {' '}{t.backToLogin}
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

  header:     { alignItems: 'center', marginBottom: 16 },
  iconCircleOuter: { width: 110, height: 110, borderRadius: 55, alignItems: 'center', justifyContent: 'center' },
  iconCircleInner: { width: 90, height: 90, borderRadius: 45, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },

  appName:    { fontWeight: '900', letterSpacing: 3, textAlign: 'center', marginBottom: 6 },
  title:      { fontWeight: '900', textAlign: 'center', marginBottom: 4 },
  subtitle:   { textAlign: 'center', marginBottom: 20 },

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