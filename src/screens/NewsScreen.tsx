import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, ActivityIndicator,
  Pressable, RefreshControl,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { useApp } from '../context/AppContext';
import { TopBar } from '../components/TopBar';
import { AnnouncementCard } from '../components/AnnouncementCard';
import { EmptyState } from '../components/EmptyState';
import { getAnnouncements } from '../api/announcements';
import { Announcement } from '../types/announcement';

export function NewsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { theme, fontSizeMultiplier } = useApp();
  const fs = (size: number) => size * fontSizeMultiplier;

  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setError(null);
      const data = await getAnnouncements();
      setItems(data);
    } catch (e) {
      setError('Не удалось загрузить новости. Проверьте интернет.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const openDetails = (item: Announcement) => {
    navigation.navigate('NewsDetails', { announcementId: item.id });
  };

  // Загрузка
  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.mutedText, fontSize: fs(14) }]}>
          Загружаем новости...
        </Text>
      </View>
    );
  }

  // Ошибка
  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <MaterialCommunityIcons name="wifi-off" size={fs(64)} color={theme.mutedText} />
        <Text style={[styles.errorText, { color: theme.text, fontSize: fs(16) }]}>
          {error}
        </Text>
        <Pressable
          onPress={() => { setLoading(true); loadData(); }}
          style={[styles.retryBtn, { backgroundColor: theme.primary }]}
        >
          <MaterialCommunityIcons name="refresh" size={fs(18)} color="#FFF" />
          <Text style={[styles.retryText, { fontSize: fs(15) }]}>Повторить</Text>
        </Pressable>
      </View>
    );
  }

  // Список
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <>
            <TopBar />
            <Text style={[styles.title, { color: theme.text, fontSize: fs(28) }]}>
              Новости
            </Text>
            <Text style={[styles.subtitle, { color: theme.mutedText, fontSize: fs(14) }]}>
              Свежие музыкальные новости
            </Text>
          </>
        }
        renderItem={({ item }) => (
          <AnnouncementCard item={item} onPress={openDetails} />
        )}
        ListEmptyComponent={
          <EmptyState
            title="Пока нет новостей"
            message="Потяни вниз, чтобы обновить"
            icon="newspaper-variant-outline"
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primary}
            colors={[theme.primary]}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1 },
  list:        { padding: 24, paddingTop: 48 },
  center:      { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  loadingText: { marginTop: 16 },
  title:       { fontWeight: '900', marginBottom: 6 },
  subtitle:    { marginBottom: 20 },
  errorText:   { textAlign: 'center', marginTop: 16, marginBottom: 24 },
  retryBtn:    {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 24, paddingVertical: 14, borderRadius: 14,
  },
  retryText:   { color: '#FFF', fontWeight: '900' },
});