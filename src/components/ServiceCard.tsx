import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Service } from '../types/service';
import { colors, spacing, radius } from '../styles/theme';

type Props = {
  service: Service;
  onPress: (service: Service) => void;
};

export function ServiceCard({ service, onPress }: Props) {
  const isUnavailable = service.status === 'unavailable';

  return (
    <Pressable
      disabled={isUnavailable}
      onPress={() => onPress(service)}
      style={({ pressed }) => [
        styles.card,
        isUnavailable && styles.cardDisabled,
        pressed && !isUnavailable && styles.cardPressed,
      ]}
    >
      <View style={styles.iconBox}>
        <MaterialCommunityIcons
          name={service.icon as any}
          size={26}
          color={isUnavailable ? colors.muted : colors.primary}
        />
      </View>

      <View style={styles.copy}>
        <Text style={styles.title} numberOfLines={1}>{service.title}</Text>
        <Text style={styles.description} numberOfLines={2}>{service.description}</Text>
        {service.status === 'new' && (
          <Text style={styles.badge}>NEW</Text>
        )}
        {isUnavailable && (
          <Text style={[styles.badge, styles.badgeMuted]}>НЕДОСТУПНО</Text>
        )}
      </View>

      <MaterialCommunityIcons
        name="chevron-right"
        size={22}
        color={isUnavailable ? colors.muted : colors.primary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  cardPressed:  { opacity: 0.8, transform: [{ scale: 0.98 }] },
  cardDisabled: { opacity: 0.5 },
  iconBox: {
    width: 52, height: 52, borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center', justifyContent: 'center',
  },
  copy:        { flex: 1 },
  title:       { color: colors.text, fontSize: 16, fontWeight: '900', marginBottom: 2 },
  description: { color: colors.muted, fontSize: 13 },
  badge: {
    color: colors.primary, fontSize: 11, fontWeight: '900',
    marginTop: 6, letterSpacing: 1,
  },
  badgeMuted: { color: colors.muted },
});