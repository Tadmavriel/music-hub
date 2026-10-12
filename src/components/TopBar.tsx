import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

export function TopBar() {
  const { theme, themeName, toggleTheme, language, nextLanguage } = useApp();
  const langLabel = language === 'ru' ? 'RU' : language === 'en' ? 'EN' : 'KK';

  return (
    <View style={styles.row}>
      <Pressable
        onPress={toggleTheme}
        style={[styles.btn, { backgroundColor: theme.surface, borderColor: theme.border }]}
      >
        <MaterialCommunityIcons
          name={themeName === 'dark' ? 'white-balance-sunny' : 'moon-waning-crescent'}
          size={20}
          color={theme.text}
        />
      </Pressable>

      <Pressable
        onPress={nextLanguage}
        style={[styles.btn, styles.langBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
      >
        <MaterialCommunityIcons name="translate" size={18} color={theme.text} />
        <Text style={[styles.langText, { color: theme.text }]}>{langLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row:      { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginBottom: 16 },
  btn:      { height: 42, minWidth: 42, paddingHorizontal: 10, borderWidth: 1, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  langBtn:  { gap: 6 },
  langText: { fontSize: 13, fontWeight: '800' }
});