import React from 'react';
import { View, Text, Pressable, ScrollView, Switch, Alert, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp, FontScale } from '../context/AppContext';
import { TopBar } from '../components/TopBar';

export function SettingsScreen() {
  const {
    theme, themeName, setThemeName,
    fontScale, setFontScale, fontSizeMultiplier,
    language, setLanguage,
    resetSettings, t
  } = useApp();

  const fs = (size: number) => size * fontSizeMultiplier;

  const handleReset = () => {
    Alert.alert(t.resetConfirm, '', [
      { text: t.no, style: 'cancel' },
      { text: t.yes, style: 'destructive', onPress: resetSettings },
    ]);
  };

  const fontOptions: { key: FontScale; label: string; icon: string }[] = [
    { key: 'small', label: 'A−', icon: 'format-font-size-decrease' },
    { key: 'normal', label: 'A', icon: 'format-size' },
    { key: 'large', label: 'A+', icon: 'format-font-size-increase' },
  ];

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}
    >
      <TopBar />

      <Text style={[styles.title, { color: theme.text, fontSize: fs(28) }]}>
        {t.settingsTitle}
      </Text>

      {/* СЕКЦИЯ: ТЕМА */}
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

      {/* СЕКЦИЯ: РАЗМЕР ШРИФТА */}
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

      {/* СЕКЦИЯ: ЯЗЫК */}
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

      {/* КНОПКА СБРОСА */}
      <Pressable
        onPress={handleReset}
        style={[styles.resetBtn, { borderColor: theme.primary }]}
      >
        <MaterialCommunityIcons name="restore" size={fs(20)} color={theme.primary} />
        <Text style={[styles.resetText, { color: theme.primary, fontSize: fs(15) }]}>
          {t.resetSettings}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:    { flexGrow: 1, padding: 24, paddingTop: 48 },
  title:        { fontWeight: '900', marginBottom: 24 },
  sectionLabel: { fontWeight: '900', letterSpacing: 1.5, marginBottom: 8, marginTop: 16 },
  block:        {
    borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 8,
  },
  row:          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowLeft:      { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rowLabel:     { fontWeight: '800' },
  rowHint:      { marginTop: 8 },
  fontRow:      { flexDirection: 'row', gap: 10, justifyContent: 'center' },
  fontBtn:      {
    flex: 1, height: 56, borderRadius: 12, borderWidth: 2,
    alignItems: 'center', justifyContent: 'center',
  },
  fontBtnText:  { fontWeight: '900' },
  langRow:      {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 12, borderRadius: 10, marginBottom: 4,
  },
  langFlag:     { fontSize: 22 },
  langLabel:    { flex: 1, fontWeight: '800' },
  resetBtn:     {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, padding: 16, borderRadius: 16, borderWidth: 2,
    marginTop: 24, marginBottom: 24,
  },
  resetText:    { fontWeight: '900' },
});