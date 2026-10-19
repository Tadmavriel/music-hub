import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Service } from '../types/service';
import { useApp } from '../context/AppContext';

type Props = {
  service: Service;
  onPress: (service: Service) => void;
};

export function ServiceCard({ service, onPress }: Props) {
  const { theme, fontSizeMultiplier } = useApp();
  const fs = (size: number) => size * fontSizeMultiplier;
  const isUnavailable = service.status === 'unavailable';

  return (
    <Pressable
      disabled={isUnavailable}
      onPress={() => onPress(service)}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          opacity: isUnavailable ? 0.5 : pressed ? 0.8 : 1,
        },
      ]}
    >
      <View style={[styles.iconBox, { backgroundColor: theme.surfaceMuted }]}>
        <MaterialCommunityIcons
          name={service.icon as any}
          size={fs(26)}
          color={isUnavailable ? theme.mutedText : theme.primary}
        />
      </View>

      <View style={styles.copy}>
        <Text style={[styles.title, { color: theme.text, fontSize: fs(16) }]} numberOfLines={1}>
          {service.title}
        </Text>
        <Text style={[styles.description, { color: theme.mutedText, fontSize: fs(13) }]} numberOfLines={2}>
          {service.description}
        </Text>
        {service.status === 'new' && (
          <Text style={[styles.badge, { color: theme.primary, fontSize: fs(11) }]}>NEW</Text>
        )}
        {isUnavailable && (
          <Text style={[styles.badge, { color: theme.mutedText, fontSize: fs(11) }]}>
            НЕДОСТУПНО
          </Text>
        )}
      </View>

      <MaterialCommunityIcons
        name="chevron-right"
        size={fs(22)}
        color={isUnavailable ? theme.mutedText : theme.primary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    marginBottom: 10,
    gap: 16,
  },
  iconBox: {
    width: 52, height: 52, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  copy:        { flex: 1 },
  title:       { fontWeight: '900', marginBottom: 2 },
  description: { },
  badge:       { fontWeight: '900', marginTop: 6, letterSpacing: 1 },
});