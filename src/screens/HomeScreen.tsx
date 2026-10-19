import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../types/navigation';
import { useApp } from '../context/AppContext';
import { TopBar } from '../components/TopBar';
import { VinylRecord } from '../components/VinylRecord';
import { Player } from '../components/Player';

export function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const { theme, t, language, profile, tracks, favorites, toggleFavorite, fontSizeMultiplier } = useApp();
  const [selected, setSelected] = useState<string | null>(null);
  const [autoPlay, setAutoPlay] = useState(false);

  const fs = (size: number) => size * fontSizeMultiplier;
  const current = tracks.find(tr => tr.id === selected) || tracks[0];
  const currentIndex = current ? tracks.findIndex(tr => tr.id === current.id) : -1;
  const hasSeveral = tracks.length > 1;

  const goTo = (index: number) => {
    const n = tracks.length;
    const next = tracks[((index % n) + n) % n];
    setAutoPlay(true);
    setSelected(next.id);
  };

  const hello =
    language === 'ru' ? 'Привет' : language === 'kk' ? 'Сәлем' : 'Hello';
  const emptyTitle =
    language === 'ru' ? 'Пока пусто' : language === 'kk' ? 'Әзірге бос' : 'Nothing here yet';
  const emptyHint =
    language === 'ru'
      ? 'Загрузи трек во вкладке «Профиль»'
      : language === 'kk'
      ? '«Профиль» қойындысында трек жүктеңіз'
      : 'Upload a track in the Profile tab';

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.background, paddingTop: insets.top + 12 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <TopBar />

      <View style={styles.hero}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.hello, { color: theme.mutedText, fontSize: fs(14) }]}>
            {hello},
          </Text>
          <Text style={[styles.name, { color: theme.text, fontSize: fs(26) }]} numberOfLines={1}>
            {profile.displayName || t.appName}
          </Text>
        </View>
        <View style={styles.stats}>
          <View style={[styles.chip, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.chipNum, { color: theme.primary, fontSize: fs(18) }]}>{tracks.length}</Text>
            <Text style={[styles.chipLabel, { color: theme.mutedText, fontSize: fs(10) }]}>{t.tracks}</Text>
          </View>
          <View style={[styles.chip, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.chipNum, { color: theme.primary, fontSize: fs(18) }]}>{favorites.length}</Text>
            <Text style={[styles.chipLabel, { color: theme.mutedText, fontSize: fs(10) }]}>{t.favoritesCount}</Text>
          </View>
        </View>
      </View>

      <Text style={[styles.sectionLabel, { color: theme.mutedText, fontSize: fs(12) }]}>
        {t.greeting.toUpperCase()}
      </Text>

      {current ? (
        <Player
          key={current.id}
          uri={current.uri}
          name={current.name}
          autoPlay={autoPlay}
          onPrev={hasSeveral ? () => goTo(currentIndex - 1) : undefined}
          onNext={hasSeveral ? () => goTo(currentIndex + 1) : undefined}
        />
      ) : (
        <View style={[styles.empty, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <VinylRecord size={130} color={theme.primary} />
          <Text style={[styles.emptyTitle, { color: theme.text, fontSize: fs(20) }]}>{emptyTitle}</Text>
          <Text style={[styles.emptyHint, { color: theme.mutedText, fontSize: fs(13) }]}>{emptyHint}</Text>
        </View>
      )}

      <View style={styles.tiles}>
        <Pressable
          style={[styles.tile, { backgroundColor: theme.surface, borderColor: theme.border }]}
          onPress={() => navigation.navigate('Details', { serviceId: 'all', title: t.allTracks })}
        >
          <View style={[styles.tileIcon, { backgroundColor: theme.surfaceMuted }]}>
            <MaterialCommunityIcons name="music-box-multiple" size={fs(22)} color={theme.primary} />
          </View>
          <Text style={[styles.tileTitle, { color: theme.text, fontSize: fs(15) }]}>{t.allTracks}</Text>
          <Text style={[styles.tileSub, { color: theme.mutedText, fontSize: fs(12) }]}>{t.allTracksSub}</Text>
        </Pressable>

        <Pressable
          style={[styles.tile, { backgroundColor: theme.surface, borderColor: theme.border }]}
          onPress={() => navigation.navigate('Details', { serviceId: 'favorites', title: t.favorites })}
        >
          <View style={[styles.tileIcon, { backgroundColor: theme.surfaceMuted }]}>
            <MaterialCommunityIcons name="heart" size={fs(22)} color={theme.primary} />
          </View>
          <Text style={[styles.tileTitle, { color: theme.text, fontSize: fs(15) }]}>{t.favorites}</Text>
          <Text style={[styles.tileSub, { color: theme.mutedText, fontSize: fs(12) }]}>{t.favoritesSub}</Text>
        </Pressable>
      </View>

      <Text style={[styles.sectionLabel, { color: theme.mutedText, fontSize: fs(12) }]}>
        {t.myTracks.toUpperCase()}
      </Text>

      {tracks.length === 0 ? (
        <Text style={[styles.emptyList, { color: theme.mutedText, fontSize: fs(13) }]}>
          {t.noTracks}
        </Text>
      ) : (
        tracks.map((tr, i) => {
          const liked = favorites.includes(tr.id);
          const active = current?.id === tr.id;
          return (
            <Pressable
              key={tr.id}
              onPress={() => { setAutoPlay(true); setSelected(tr.id); }}
              style={[
                styles.trackRow,
                { backgroundColor: theme.surface, borderColor: active ? theme.primary : theme.border },
              ]}
            >
              <View style={[styles.trackBadge, { backgroundColor: active ? theme.primary : theme.surfaceMuted }]}>
                {active ? (
                  <MaterialCommunityIcons name="volume-high" size={fs(16)} color="#FFF" />
                ) : (
                  <Text style={[styles.trackNum, { color: theme.mutedText, fontSize: fs(13) }]}>{i + 1}</Text>
                )}
              </View>
              <Text
                style={[styles.trackName, { color: theme.text, fontSize: fs(15) }]}
                numberOfLines={1}
              >
                {tr.name}
              </Text>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:    { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 32 },
  hero:         { flexDirection: 'row', alignItems: 'center', marginTop: 8, marginBottom: 8, gap: 12 },
  hello:        { fontWeight: '600' },
  name:         { fontWeight: '800' },
  stats:        { flexDirection: 'row', gap: 8 },
  chip:         { minWidth: 62, paddingVertical: 8, paddingHorizontal: 10, borderRadius: 14, borderWidth: 1, alignItems: 'center' },
  chipNum:      { fontWeight: '800' },
  chipLabel:    { fontWeight: '600', marginTop: 2 },
  sectionLabel: { fontWeight: '800', letterSpacing: 1.5, marginTop: 20, marginBottom: 10 },
  empty:        { borderRadius: 24, borderWidth: 1, padding: 24, alignItems: 'center' },
  emptyTitle:   { fontWeight: '800', marginTop: 16, marginBottom: 4 },
  emptyHint:    { textAlign: 'center' },
  tiles:        { flexDirection: 'row', gap: 12, marginTop: 16 },
  tile:         { flex: 1, borderRadius: 18, borderWidth: 1, padding: 14 },
  tileIcon:     { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  tileTitle:    { fontWeight: '800', marginBottom: 2 },
  tileSub:      { },
  emptyList:    { fontStyle: 'italic', textAlign: 'center', paddingVertical: 20 },
  trackRow:     { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 14, borderWidth: 1, marginBottom: 8 },
  trackBadge:   { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  trackNum:     { fontWeight: '800' },
  trackName:    { flex: 1, fontWeight: '700' },
});