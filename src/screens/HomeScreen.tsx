import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { useApp } from '../context/AppContext';
import { TopBar } from '../components/TopBar';
import { VinylRecord } from '../components/VinylRecord';
import { Player } from '../components/Player';

type Props = NativeStackScreenProps<RootStackParamList, 'Main'>;

export function HomeScreen({ navigation }: Props) {
  const { theme, t, tracks } = useApp();
  const [selected, setSelected] = useState<string | null>(null);

  const current = tracks.find(tr => tr.id === selected) || tracks[0];

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
      <TopBar />

      <Text style={[styles.greeting, { color: theme.mutedText }]}>{t.greeting}</Text>

      {current ? (
        <Player uri={current.uri} name={current.name} />
      ) : (
        <View style={[styles.player, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <VinylRecord size={140} color={theme.primary} />
          <Text style={[styles.songTitle, { color: theme.text }]}>Пока пусто</Text>
          <Text style={[styles.songArtist, { color: theme.mutedText }]}>
            Загрузи трек во вкладке «Профиль»
          </Text>
        </View>
      )}

      {/* Мои треки */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>{t.myTracks}</Text>

      {tracks.length === 0 ? (
        <Text style={[styles.empty, { color: theme.mutedText }]}>{t.noTracks}</Text>
      ) : (
        tracks.map((tr, i) => (
          <Pressable
            key={tr.id}
            onPress={() => setSelected(tr.id)}
            style={[
              styles.trackRow,
              { backgroundColor: theme.surface, borderColor: theme.border },
              current?.id === tr.id && { borderColor: theme.primary, borderWidth: 2 }
            ]}
          >
            <Text style={[styles.trackNum, { color: theme.primary }]}>{i + 1}</Text>
            <MaterialCommunityIcons name="music-note" size={20} color={theme.primary} />
            <Text style={[styles.trackName, { color: theme.text }]} numberOfLines={1}>
              {tr.name}
            </Text>
            {current?.id === tr.id && (
              <MaterialCommunityIcons name="volume-high" size={20} color={theme.primary} />
            )}
          </Pressable>
        ))
      )}

      {/* Быстрый доступ */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>{t.quickAccess}</Text>

      <Pressable
        style={[styles.quickCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
        onPress={() => navigation.navigate('Details', { serviceId: 'all', title: t.allTracks })}
      >
        <Text style={[styles.quickIcon, { color: theme.primary }]}>♪</Text>
        <View style={{ flex: 1 }}>
          <Text style={[styles.quickTitle, { color: theme.text }]}>{t.allTracks}</Text>
          <Text style={[styles.quickSub, { color: theme.mutedText }]}>{t.allTracksSub}</Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={24} color={theme.primary} />
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:    { flexGrow: 1, padding: 24, paddingTop: 48 },
  greeting:     { fontSize: 13, fontWeight: '700', letterSpacing: 1, marginBottom: 12 },
  player:       { borderRadius: 24, borderWidth: 1, padding: 24, alignItems: 'center', marginBottom: 24 },
  songTitle:    { fontSize: 22, fontWeight: '900', marginTop: 16, marginBottom: 4 },
  songArtist:   { fontSize: 13, textAlign: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: '900', marginBottom: 10, marginTop: 8 },
  empty:        { fontSize: 13, fontStyle: 'italic', textAlign: 'center', paddingVertical: 20 },
  trackRow:     { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 14, borderWidth: 1, marginBottom: 8 },
  trackNum:     { fontSize: 14, fontWeight: '900', width: 20 },
  trackName:    { flex: 1, fontSize: 14, fontWeight: '700' },
  quickCard:    { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 10, gap: 14 },
  quickIcon:    { fontSize: 26, fontWeight: '900', width: 32, textAlign: 'center' },
  quickTitle:   { fontSize: 16, fontWeight: '800', marginBottom: 2 },
  quickSub:     { fontSize: 12 }
});