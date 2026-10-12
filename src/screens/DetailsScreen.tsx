import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { useApp } from '../context/AppContext';
import { Player } from '../components/Player';

type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;

export function DetailsScreen({ route, navigation }: Props) {
  const { serviceId, title } = route.params;
  const { theme, t, tracks } = useApp();
  const [selected, setSelected] = useState<string | null>(tracks[0]?.id ?? null);

  const current = tracks.find(tr => tr.id === selected);

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.id, { color: theme.primary }]}>#{serviceId}</Text>
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      </View>

      {current && <Player uri={current.uri} name={current.name} />}

      {tracks.length === 0 ? (
        <Text style={[styles.empty, { color: theme.mutedText }]}>{t.noTracks}</Text>
      ) : (
        tracks.map((tr, i) => (
          <Pressable
            key={tr.id}
            onPress={() => setSelected(tr.id)}
            style={[
              styles.track,
              { backgroundColor: theme.surface, borderColor: theme.border },
              selected === tr.id && { borderColor: theme.primary, borderWidth: 2 }
            ]}
          >
            <Text style={[styles.trackNum, { color: theme.primary }]}>{i + 1}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.trackName, { color: theme.text }]} numberOfLines={1}>{tr.name}</Text>
              <Text style={[styles.trackArtist, { color: theme.mutedText }]}>Мой трек</Text>
            </View>
            {selected === tr.id && (
              <MaterialCommunityIcons name="volume-high" size={20} color={theme.primary} />
            )}
          </Pressable>
        ))
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
  empty:       { fontSize: 14, fontStyle: 'italic', textAlign: 'center', paddingVertical: 30 },
  track:       { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14, borderRadius: 14, borderWidth: 1, marginBottom: 8 },
  trackNum:    { fontSize: 16, fontWeight: '900', width: 24, textAlign: 'center' },
  trackName:   { fontSize: 15, fontWeight: '800', marginBottom: 2 },
  trackArtist: { fontSize: 12 },
  button:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, borderRadius: 16, marginTop: 16 },
  buttonText:  { color: '#FFFFFF', fontWeight: '900', fontSize: 16 }
});