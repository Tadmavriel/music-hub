import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

type Props = {
  icon?: string;
  title: string;
  message?: string;
};

export function EmptyState({ icon = 'music-off', title, message }: Props) {
  const { theme, fontSizeMultiplier } = useApp();
  const fs = (size: number) => size * fontSizeMultiplier;

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name={icon as any} size={fs(56)} color={theme.mutedText} />
      <Text style={[styles.title, { color: theme.text, fontSize: fs(18) }]}>{title}</Text>
      {message ? (
        <Text style={[styles.message, { color: theme.mutedText, fontSize: fs(14) }]}>
          {message}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: 64 },
  title:     { fontWeight: '900', marginTop: 16 },
  message:   { marginTop: 6, textAlign: 'center' },
});