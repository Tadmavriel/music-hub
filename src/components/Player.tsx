import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useApp } from '../context/AppContext';
import { VinylRecord } from './VinylRecord';

export function Player({ uri, name }: { uri: string; name: string }) {
  const { theme } = useApp();
  const player = useAudioPlayer(uri);
  const status = useAudioPlayerStatus(player);

  const isPlaying = status?.playing ?? false;
  const progress = status?.duration > 0 ? (status.currentTime / status.duration) * 100 : 0;

  const toggle = () => {
    if (isPlaying) player.pause();
    else player.play();
  };

  const restart = () => {
    player.seekTo(0);
    player.play();
  };

  const fmt = (s: number) => {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <View style={[styles.player, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={{ marginBottom: 16 }}>
        <VinylRecord size={130} color={theme.primary} />
      </View>

      <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>{name}</Text>
      <Text style={[styles.artist, { color: theme.mutedText }]}>Мой трек</Text>

      <View style={styles.progressRow}>
        <Text style={[styles.time, { color: theme.mutedText }]}>{fmt(status?.currentTime ?? 0)}</Text>
        <View style={[styles.bar, { backgroundColor: theme.surfaceMuted }]}>
          <View style={[styles.fill, { backgroundColor: theme.primary, width: `${progress}%` }]} />
        </View>
        <Text style={[styles.time, { color: theme.mutedText }]}>{fmt(status?.duration ?? 0)}</Text>
      </View>

      <View style={styles.controls}>
        <Pressable style={styles.ctrl} onPress={restart}>
          <MaterialCommunityIcons name="restart" size={28} color={theme.text} />
        </Pressable>
        <Pressable
          onPress={toggle}
          style={[styles.playBtn, { backgroundColor: theme.primary }]}
        >
          <MaterialCommunityIcons
            name={isPlaying ? 'pause' : 'play'}
            size={30}
            color="#FFF"
          />
        </Pressable>
        <Pressable style={styles.ctrl} onPress={() => player.seekTo(0)}>
          <MaterialCommunityIcons name="skip-backward" size={28} color={theme.text} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  player:     { borderRadius: 24, borderWidth: 1, padding: 20, alignItems: 'center' },
  name:       { fontSize: 20, fontWeight: '900', marginBottom: 4, textAlign: 'center' },
  artist:     { fontSize: 13, marginBottom: 20 },
  progressRow:{ flexDirection: 'row', alignItems: 'center', width: '100%', gap: 10, marginBottom: 16 },
  time:       { fontSize: 11, fontWeight: '700' },
  bar:        { flex: 1, height: 4, borderRadius: 2, overflow: 'hidden' },
  fill:       { height: 4, borderRadius: 2 },
  controls:   { flexDirection: 'row', alignItems: 'center', gap: 24 },
  ctrl:       { padding: 8 },
  playBtn:    { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center' }
});