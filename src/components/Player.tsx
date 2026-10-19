import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, LayoutChangeEvent } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useApp } from '../context/AppContext';
import { VinylRecord } from './VinylRecord';

type Props = {
  uri: string;
  name: string;
  onPrev?: () => void;
  onNext?: () => void;
  autoPlay?: boolean;
};

export function Player({ uri, name, onPrev, onNext, autoPlay = false }: Props) {
  const { theme, fontSizeMultiplier } = useApp();
  const player = useAudioPlayer(uri);
  const status = useAudioPlayerStatus(player);
  const [barWidth, setBarWidth] = useState(0);
  const [dragRatio, setDragRatio] = useState<number | null>(null);

  const fs = (size: number) => size * fontSizeMultiplier;
  const isPlaying = status?.playing ?? false;
  const duration = status?.duration ?? 0;
  const currentTime = status?.currentTime ?? 0;
  const ratio = dragRatio ?? (duration > 0 ? Math.min(currentTime / duration, 1) : 0);
  const shownTime = dragRatio !== null ? dragRatio * duration : currentTime;

  useEffect(() => {
    if (autoPlay) player.play();
  }, []);

  useEffect(() => {
    if (status?.didJustFinish && onNext) onNext();
  }, [status?.didJustFinish]);

  const toggle = () => { if (isPlaying) player.pause(); else player.play(); };

  const handlePrev = () => {
    if (currentTime > 3 || !onPrev) {
      player.seekTo(0);
    } else {
      onPrev();
    }
  };

  const ratioFromX = (x: number) =>
    barWidth > 0 ? Math.max(0, Math.min(x / barWidth, 1)) : 0;

  const fmt = (s: number) => {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <View style={[styles.player, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={{ marginBottom: 16 }}>
        <VinylRecord size={130} color={theme.primary} isPlaying={isPlaying} />
      </View>

      <Text style={[styles.name, { color: theme.text, fontSize: fs(20) }]} numberOfLines={1}>
        {name}
      </Text>
      <Text style={[styles.artist, { color: theme.mutedText, fontSize: fs(13) }]}>
        Мой трек
      </Text>

      <View style={styles.progressRow}>
        <Text style={[styles.time, { color: theme.mutedText, fontSize: fs(11) }]}>
          {fmt(shownTime)}
        </Text>

        <View
          style={styles.seekArea}
          onLayout={(e: LayoutChangeEvent) => setBarWidth(e.nativeEvent.layout.width)}
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
          onResponderGrant={(e) => setDragRatio(ratioFromX(e.nativeEvent.locationX))}
          onResponderMove={(e) => setDragRatio(ratioFromX(e.nativeEvent.locationX))}
          onResponderRelease={(e) => {
            const r = ratioFromX(e.nativeEvent.locationX);
            setDragRatio(null);
            if (duration > 0) player.seekTo(r * duration);
          }}
          onResponderTerminate={() => setDragRatio(null)}
        >
          <View pointerEvents="none" style={[styles.bar, { backgroundColor: theme.surfaceMuted }]}>
            <View style={[styles.fill, { backgroundColor: theme.primary, width: `${ratio * 100}%` }]} />
          </View>
          <View
            pointerEvents="none"
            style={[
              styles.thumb,
              { backgroundColor: theme.primary, left: Math.max(0, ratio * barWidth - 7) },
            ]}
          />
        </View>

        <Text style={[styles.time, { color: theme.mutedText, fontSize: fs(11) }]}>
          {fmt(duration)}
        </Text>
      </View>

      <View style={styles.controls}>
        <Pressable style={styles.ctrl} onPress={handlePrev} hitSlop={8}>
          <MaterialCommunityIcons name="skip-previous" size={fs(34)} color={theme.text} />
        </Pressable>

        <Pressable
          onPress={toggle}
          style={[styles.playBtn, { backgroundColor: theme.primary }]}
        >
          <MaterialCommunityIcons
            name={isPlaying ? 'pause' : 'play'}
            size={fs(30)}
            color="#FFF"
          />
        </Pressable>

        <Pressable
          style={[styles.ctrl, { opacity: onNext ? 1 : 0.35 }]}
          onPress={onNext}
          disabled={!onNext}
          hitSlop={8}
        >
          <MaterialCommunityIcons name="skip-next" size={fs(34)} color={theme.text} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  player:      { borderRadius: 24, borderWidth: 1, padding: 20, alignItems: 'center' },
  name:        { fontWeight: '800', marginBottom: 4, textAlign: 'center' },
  artist:      { marginBottom: 20 },
  progressRow: { flexDirection: 'row', alignItems: 'center', width: '100%', gap: 10, marginBottom: 12 },
  time:        { fontWeight: '700', minWidth: 34, textAlign: 'center' },
  seekArea:    { flex: 1, height: 30, justifyContent: 'center' },
  bar:         { height: 4, borderRadius: 2, overflow: 'hidden' },
  fill:        { height: 4, borderRadius: 2 },
  thumb:       { position: 'absolute', top: 8, width: 14, height: 14, borderRadius: 7 },
  controls:    { flexDirection: 'row', alignItems: 'center', gap: 28 },
  ctrl:        { padding: 8 },
  playBtn:     { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center' }
});