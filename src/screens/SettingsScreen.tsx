import React from 'react';
import { View, Text, Pressable, ScrollView, Switch, Alert, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../types/navigation';
import { useApp, FontScale } from '../context/AppContext';

export function SettingsScreen() {
  const {
    theme, themeName, setThemeName,
    fontScale, setFontScale, fontSizeMultiplier,
    language, setLanguage,
    resetSettings, logout, t
  } = useApp();

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();

  const fs = (size: number) => size * fontSizeMultiplier;

  const handleReset = () => {
    Alert.alert(t.resetConfirm, '', [
      { text: t.no, style: 'cancel' },
      { text: t.yes, style: 'destructive', onPress: resetSettings },
    ]);
  };

  const handleLogout = () => {
    Alert.alert(t.logout + '?', '', [
      { text: t.no, style: 'cancel' },
      {
        text: t.yes,
        style: 'destructive',
        onPress: async () => {
          await logout();
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        },
      },
    ]);
  };

  const fontOptions: { key: FontScale; label: string }[] = [
    { key: 'small', label: 'A-' },
    { key: 'normal', label: 'A' },
    { key: 'large', label: 'A+' },
  ];

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.background, paddingTop: insets.top + 16 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topRow}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={[styles.backBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
          hitSlop={8}
        >
          <MaterialCommunityIcons name="arrow-left" size={22} color={theme.text} />
        </Pressable>
        <Text style={[styles.title, { color: theme.text, fontSize: fs(24) }]}>
          {t.settingsTitle}
        </Text>
        <View style={styles.backBtn} />
      </View>

      <Text style={[styles.sectionLabel, { color: theme.mutedText, fontSize: fs(12) }]}>
        {t.appearance.toUpperCase()}
      </Text>
      <View style={[styles.block, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <MaterialCommunityIcons
              name={themeName === 'dark' ? 'weather-night' : 'white-balance-sunny'}
              size={fs(22)}
              color={theme.primary}
            />
            <Text style={[styles.rowLabel, { color: theme.text, fontSize: fs(16) }]}>
              {t.theme}
            </Text>
          </View>
          <Switch
            value={themeName === 'dark'}
            onValueChange={(enabled) => setThemeName(enabled ? 'dark' : 'light')}
            trackColor={{ false: theme.border, true: theme.primary }}
            thumbColor={theme.white}
          />
        </View>
        <Text style={[styles.rowHint, { color: theme.mutedText, fontSize: fs(13) }]}>
          {themeName === 'dark' ? t.themeDark : t.themeLight}
        </Text>
      </View>

      <Text style={[styles.sectionLabel, { color: theme.mutedText, fontSize: fs(12) }]}>
        {t.fontScale.toUpperCase()}
      </Text>
      <View style={[styles.block, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.fontRow}>
          {fontOptions.map((opt) => {
            const active = fontScale === opt.key;
            return (
              <Pressable
                key={opt.key}
                onPress={() => setFontScale(opt.key)}
                style={[
                  styles.fontBtn,
                  {
                    backgroundColor: active ? theme.primary : theme.surfaceMuted,
                    borderColor: active ? theme.primary : theme.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.fontBtnText,
                    {
                      color: active ? '#FFF' : theme.text,
                      fontSize: opt.key === 'small' ? 14 : opt.key === 'normal' ? 18 : 22,
                    },
                  ]}
                >
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={[styles.rowHint, { color: theme.mutedText, fontSize: 13 }]}>
          {fontScale === 'small' ? t.fontSmall : fontScale === 'large' ? t.fontLarge : t.fontNormal}
        </Text>
      </View>

      <Text style={[styles.sectionLabel, { color: theme.mutedText, fontSize: 12 }]}>
        {t.language.toUpperCase()}
      </Text>
      <View style={[styles.block, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        {([
          { code: 'ru' as const, label: t.langRu, flag: '🇷🇺' },
          { code: 'en' as const, label: t.langEn, flag: '🇬🇧' },
          { code: 'kk' as const, label: t.langKk, flag: '🇰🇿' },
        ]).map((l) => {
          const active = language === l.code;
          return (
            <Pressable
              key={l.code}
              onPress={() => setLanguage(l.code)}
              style={[
                styles.langRow,
                active && { backgroundColor: theme.primary, borderRadius: 10 },
              ]}
            >
              <Text style={styles.langFlag}>{l.flag}</Text>
              <Text style={[styles.langLabel, { color: active ? '#FFF' : theme.text, fontSize: fs(15) }]}>
                {l.label}
              </Text>
              {active && <MaterialCommunityIcons name="check" size={fs(20)} color="#FFF" />}
            </Pressable>
          );
        })}
      </View>

      <Pressable
        onPress={handleReset}
        style={[styles.resetBtn, { borderColor: theme.border }]}
      >
        <MaterialCommunityIcons name="restore" size={fs(20)} color={theme.mutedText} />
        <Text style={[styles.resetText, { color: theme.mutedText, fontSize: fs(15) }]}>
          {t.resetSettings}
        </Text>
      </Pressable>

      <Pressable
        onPress={handleLogout}
        style={[styles.logoutBtn, { backgroundColor: theme.primary, marginBottom: 24 + insets.bottom }]}
      >
        <MaterialCommunityIcons name="logout" size={fs(20)} color="#FFF" />
        <Text style={[styles.logoutText, { fontSize: fs(15) }]}>{t.logout}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:    { flexGrow: 1, paddingHorizontal: 24 },
  topRow:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  backBtn:      { width: 42, height: 42, borderRadius: 21, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  title:        { fontWeight: '800' },
  sectionLabel: { fontWeight: '800', letterSpacing: 1.5, marginBottom: 8, marginTop: 20 },
  block:        { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 8 },
  row:          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowLeft:      { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rowLabel:     { fontWeight: '700' },
  rowHint:      { marginTop: 8 },
  fontRow:      { flexDirection: 'row', gap: 10, justifyContent: 'center' },
  fontBtn:      { flex: 1, height: 54, borderRadius: 12, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  fontBtnText:  { fontWeight: '800' },
  langRow:      { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 10, marginBottom: 4 },
  langFlag:     { fontSize: 22 },
  langLabel:    { flex: 1, fontWeight: '700' },
  resetBtn:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 15, borderRadius: 14, borderWidth: 1, marginTop: 24, marginBottom: 12 },
  resetText:    { fontWeight: '700' },
  logoutBtn:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, borderRadius: 14 },
  logoutText:   { color: '#FFFFFF', fontWeight: '800' },
});