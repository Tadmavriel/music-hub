import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { TopBar } from '../components/TopBar';

const items = [
  { icon: 'music-note', title: 'Треки', sub: 'Все песни' },
  { icon: 'playlist-music', title: 'Плейлисты', sub: 'Твои подборки' },
  { icon: 'account-music', title: 'Исполнители', sub: 'Артисты' },
  { icon: 'album', title: 'Альбомы', sub: 'Релизы' },
  { icon: 'guitar-electric', title: 'Жанры', sub: 'Рок, поп, хип-хоп' },
  { icon: 'heart', title: 'Избранное', sub: 'Что лайкнул' },
];

export function ServicesScreen() {
  const { theme, t } = useApp();

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}
    >
      <TopBar />
      <Text style={[styles.title, { color: theme.text }]}>{t.servicesTitle}</Text>
      <Text style={[styles.sub, { color: theme.mutedText }]}>{t.servicesSub}</Text>

      <View style={styles.grid}>
        {items.map((item, i) => (
          <View
            key={i}
            style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
          >
            <MaterialCommunityIcons
              name={item.icon as any}
              size={32}
              color={theme.primary}
            />
            <Text style={[styles.cardTitle, { color: theme.text }]}>{item.title}</Text>
            <Text style={[styles.cardSub, { color: theme.mutedText }]}>{item.sub}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, paddingTop: 48 },
  title:     { fontSize: 28, fontWeight: '900', marginBottom: 6 },
  sub:       { fontSize: 15, marginBottom: 24 },
  grid:      { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card:      { width: '48%', padding: 16, borderRadius: 18, borderWidth: 1, minHeight: 130 },
  cardTitle: { fontSize: 15, fontWeight: '900', marginTop: 12, marginBottom: 4 },
  cardSub:   { fontSize: 12 }
});