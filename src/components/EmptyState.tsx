import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing } from '../styles/theme';

type Props = {
  icon?: string;
  title: string;
  message?: string;
};

export function EmptyState({ icon = 'music-off', title, message }: Props) {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name={icon as any} size={56} color={colors.muted} />
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: spacing.xl * 2 },
  title:     { color: colors.text, fontSize: 18, fontWeight: '900', marginTop: spacing.md },
  message:   { color: colors.muted, fontSize: 14, marginTop: spacing.xs, textAlign: 'center' },
});