import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Announcement } from '../types/announcement';
import { useApp } from '../context/AppContext';

type Props = {
  item: Announcement;
  onPress: (item: Announcement) => void;
};

// Иконки для карточек (по кругу — для разнообразия)
const ICONS = ['music-note', 'album', 'account-music', 'playlist-music', 'radio'];
const COLORS = ['#FF2D6F', '#FFD700', '#4ECDC4', '#A78BFA', '#F97316'];

export function AnnouncementCard({ item, onPress }: Props) {
  const { theme, fontSizeMultiplier } = useApp();
  const fs = (size: number) => size * fontSizeMultiplier;

  const iconName = ICONS[item.id % ICONS.length];
  const iconColor = COLORS[item.id % COLORS.length];

  // Форматируем "дату" из id (просто для красоты)
  const day = ((item.id * 3) % 28) + 1;
  const month = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'][item.id % 12];

  return (
    <Pressable
      onPress={() => onPress(item)}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <View style={[styles.iconBox, { backgroundColor: iconColor + '22' }]}>
        <MaterialCommunityIcons name={iconName as any} size={fs(28)} color={iconColor} />
      </View>

      <View style={styles.copy}>
        <Text
          style={[styles.title, { color: theme.text, fontSize: fs(15) }]}
          numberOfLines={2}
        >
          {item.title}
        </Text>
        <Text
          style={[styles.body, { color: theme.mutedText, fontSize: fs(12) }]}
          numberOfLines={2}
        >
          {item.body}
        </Text>
        <View style={styles.dateRow}>
          <MaterialCommunityIcons name="calendar" size={fs(12)} color={theme.primary} />
          <Text style={[styles.date, { color: theme.primary, fontSize: fs(11) }]}>
            2026, {day} {month}
          </Text>
        </View>
      </View>

      <MaterialCommunityIcons
        name="chevron-right"
        size={fs(22)}
        color={theme.mutedText}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy:    { flex: 1 },
  title:   { fontWeight: '900', marginBottom: 4 },
  body:    { lineHeight: 16 },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  date:    { fontWeight: '700' },
});