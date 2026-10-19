import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { useApp } from '../context/AppContext';
import { Player } from '../components/Player';

type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;

export function DetailsScreen({ route, navigation }: Props) {
  const { serviceId, title } = route.params;
  const { theme, t, language, tracks, favorites, toggleFavorite } = useApp();
  const [query, setQuery] = useState('');
  const [autoPlay, setAutoPlay] = useState(false);

  const searchPlaceholder =
    language === 'ru' ? 'Поиск трека' : language === 'kk' ? 'Трек іздеу' : 'Search tracks';
  const nothingFound =
    language === 'ru' ? 'Ничего не найдено' : language === 'kk' ? 'Ештеңе табылмады' : 'Nothing found';

  const list = serviceId === 'favorites'
    ? tracks.filter(tr => favorites.includes(tr.id))
    : tracks;

  const [selected, setSelected] = useState<string | null>(list[0]?.id ?? null);
  const current = list.find(tr => tr.id === selected) ?? list[0];
  const currentIndex = current ? list.findIndex(tr => tr.id === current.id) : -1;
  const hasSeveral = list.length > 1;

  const goTo = (index: number) => {
    const n = list.length;
    const next = list[((index % n) + n) % n];
    setAutoPlay(true);
    setSelected(next.id);
  };

  const q = query.trim().toLowerCase();
  const visible = q ? list.filter(tr => tr.name.toLowerCase().includes(q)) : list;

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={[styles.header, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.id, { color: theme.primary }]}>#{serviceId}</Text>
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      </View>

      {current && (
        <Player
          key={current.id}
          uri={current.uri}
          name={current.name}
          autoPlay={autoPlay}
          onPrev={hasSeveral ? () => goTo(currentIndex - 1) : undefined}
          onNext={hasSeveral ? () => goTo(currentIndex + 1) : undefined}
        />
      )}

      {list.length > 0 && (
        <View style={[styles.searchRow, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <MaterialCommunityIcons name="magnify" size={22} color={theme.mutedText} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder={searchPlaceholder}
            placeholderTextColor={theme.placeholder}
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')} hitSlop={10}>
              <MaterialCommunityIcons name="close-circle" size={20} color={theme.mutedText} />
            </Pressable>
          )}
        </View>
      )}

      {list.length === 0 ? (
        <Text style={[styles.empty, { color: theme.mutedText }]}>{t.noTracks}</Text>
      ) : visible.length === 0 ? (
        <Text style={[styles.empty, { color: theme.mutedText }]}>{nothingFound}</Text>
      ) : (
        visible.map((tr, i) => {
          const liked = favorites.includes(tr.id);
          return (
            <Pressable
              key={tr.id}
              onPress={() => { setAutoPlay(true); setSelected(tr.id); }}
              style={[
                styles.track,
                { backgroundColor: theme.surface, borderColor: theme.border },
                current?.id === tr.id && { borderColor: theme.primary, borderWidth: 2 }
              ]}
            >
              <Text style={[styles.trackNum, { color: theme.primary }]}>{i + 1}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.trackName, { color: theme.text }]} numberOfLines={1}>{tr.name}</Text>
                <Text style={[styles.trackArtist, { color: theme.mutedText }]}>Мой трек</Text>
              </View>
              {current?.id === tr.id && (
                <MaterialCommunityIcons name="volume-high" size={20} color={theme.primary} />
              )}
              <Pressable onPress={() => toggleFavorite(tr.id)} hitSlop={10}>
                <MaterialCommunityIcons
                  name={liked ? 'heart' : 'heart-outline'}
                  size={24}
                  color={liked ? theme.primary : theme.mutedText}
                />
              </Pressable>
            </Pressable>
          );
        })
      )}

      <Pressable
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={() => navigation.goBack()}
      >
        <MaterialCommunityIcons name="arrow-left" size={20} color="#FFF" />
        <Text style={styles.buttonText}>{t.back}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:   { flexGrow: 1, padding: 24, paddingTop: 48 },
  header:      { borderRadius: 20, borderWidth: 1, padding: 20, marginBottom: 16 },
  id:          { fontSize: 12, fontWeight: '900', letterSpacing: 1, marginBottom: 6 },
  title:       { fontSize: 26, fontWeight: '900' },
  searchRow:   { flexDirection: 'row', alignItems: 'center', gap: 10, height: 50, paddingHorizontal: 14, borderRadius: 14, borderWidth: 1, marginTop: 16, marginBottom: 12 },
  searchInput: { flex: 1, height: '100%', fontSize: 15 },
  empty:       { fontSize: 14, fontStyle: 'italic', textAlign: 'center', paddingVertical: 30 },
  track:       { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14, borderRadius: 14, borderWidth: 1, marginBottom: 8 },
  trackNum:    { fontSize: 16, fontWeight: '900', width: 24, textAlign: 'center' },
  trackName:   { fontSize: 15, fontWeight: '800', marginBottom: 2 },
  trackArtist: { fontSize: 12 },
  button:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, borderRadius: 16, marginTop: 16 },
  buttonText:  { color: '#FFFFFF', fontWeight: '900', fontSize: 16 }
});