import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { useApp } from '../context/AppContext';
import { TopBar } from '../components/TopBar';
import { VinylRecord } from '../components/VinylRecord';
import { Player } from '../components/Player';

export function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { theme, t, tracks, favorites, toggleFavorite, fontSizeMultiplier } = useApp();
  const [selected, setSelected] = useState<string | null>(null);

  const fs = (size: number) => size * fontSizeMultiplier;
  const current = tracks.find(tr => tr.id === selected) || tracks[0];

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
      <TopBar />

      <Text style={[styles.greeting, { color: theme.mutedText, fontSize: fs(13) }]}>
        {t.greeting}
      </Text>

      {current ? (
        <Player uri={current.uri} name={current.name} />
      ) : (
        <View style={[styles.player, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <VinylRecord size={140} color={theme.primary} />
          <Text style={[styles.songTitle, { color: theme.text, fontSize: fs(22) }]}>
            Пока пусто
          </Text>
          <Text style={[styles.songArtist, { color: theme.mutedText, fontSize: fs(13) }]}>
            Загрузи трек во вкладке «Профиль»
          </Text>
        </View>
      )}

      <Text style={[styles.sectionTitle, { color: theme.text, fontSize: fs(16) }]}>
        {t.myTracks}
      </Text>

      {tracks.length === 0 ? (
        <Text style={[styles.empty, { color: theme.mutedText, fontSize: fs(13) }]}>
          {t.noTracks}
        </Text>
      ) : (
        tracks.map((tr, i) => {
          const liked = favorites.includes(tr.id);
          return (
            <Pressable
              key={tr.id}
              onPress={() => setSelected(tr.id)}
              style={[
                styles.trackRow,
                { backgroundColor: theme.surface, borderColor: theme.border },
                current?.id === tr.id && { borderColor: theme.primary, borderWidth: 2 }
              ]}
            >
              <Text style={[styles.trackNum, { color: theme.primary, fontSize: fs(14) }]}>
                {i + 1}
              </Text>
              <MaterialCommunityIcons name="music-note" size={fs(20)} color={theme.primary} />
              <Text
                style={[styles.trackName, { color: theme.text, fontSize: fs(14) }]}
                numberOfLines={1}
              >
                {tr.name}
              </Text>
              {current?.id === tr.id && (
                <MaterialCommunityIcons name="volume-high" size={fs(20)} color={theme.primary} />
              )}
              <Pressable onPress={() => toggleFavorite(tr.id)} hitSlop={10}>
                <MaterialCommunityIcons
                  name={liked ? 'heart' : 'heart-outline'}
                  size={fs(24)}
                  color={liked ? theme.primary : theme.mutedText}
                />
              </Pressable>
            </Pressable>
          );
        })
      )}

      <Text style={[styles.sectionTitle, { color: theme.text, fontSize: fs(16) }]}>
        {t.quickAccess}
      </Text>

      <Pressable
        style={[styles.quickCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
        onPress={() => navigation.navigate('Details', { serviceId: 'all', title: t.allTracks })}
      >
        <Text style={[styles.quickIcon, { color: theme.primary, fontSize: fs(26) }]}>♪</Text>
        <View style={{ flex: 1 }}>
          <Text style={[styles.quickTitle, { color: theme.text, fontSize: fs(16) }]}>
            {t.allTracks}
          </Text>
          <Text style={[styles.quickSub, { color: theme.mutedText, fontSize: fs(12) }]}>
            {t.allTracksSub}
          </Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={fs(24)} color={theme.primary} />
      </Pressable>

      <Pressable
        style={[styles.quickCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
        onPress={() => navigation.navigate('Details', { serviceId: 'favorites', title: t.favorites })}
      >
        <MaterialCommunityIcons name="heart" size={fs(26)} color={theme.primary} style={styles.quickHeart} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.quickTitle, { color: theme.text, fontSize: fs(16) }]}>
            {t.favorites}
          </Text>
          <Text style={[styles.quickSub, { color: theme.mutedText, fontSize: fs(12) }]}>
            {favorites.length} · {t.favoritesSub}
          </Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={fs(24)} color={theme.primary} />
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:    { flexGrow: 1, padding: 24, paddingTop: 48 },
  greeting:     { fontWeight: '700', letterSpacing: 1, marginBottom: 12 },
  player:       { borderRadius: 24, borderWidth: 1, padding: 24, alignItems: 'center', marginBottom: 24 },
  songTitle:    { fontWeight: '900', marginTop: 16, marginBottom: 4 },
  songArtist:   { textAlign: 'center' },
  sectionTitle: { fontWeight: '900', marginBottom: 10, marginTop: 8 },
  empty:        { fontStyle: 'italic', textAlign: 'center', paddingVertical: 20 },
  trackRow:     { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 14, borderWidth: 1, marginBottom: 8 },
  trackNum:     { fontWeight: '900', width: 20 },
  trackName:    { flex: 1, fontWeight: '700' },
  quickCard:    { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 10, gap: 14 },
  quickIcon:    { fontWeight: '900', width: 32, textAlign: 'center' },
  quickHeart:   { width: 32, textAlign: 'center' },
  quickTitle:   { fontWeight: '800', marginBottom: 2 },
  quickSub:     { }
});