import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, ActivityIndicator, Pressable,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { useApp } from '../context/AppContext';
import { getAnnouncement } from '../api/announcements';
import { Announcement } from '../types/announcement';

type Props = NativeStackScreenProps<RootStackParamList, 'NewsDetails'>;

export function NewsDetailsScreen({ route, navigation }: Props) {
  const { announcementId } = route.params;
  const { theme, fontSizeMultiplier } = useApp();
  const fs = (size: number) => size * fontSizeMultiplier;

  const [item, setItem] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await getAnnouncement(announcementId);
      setItem(data);
    } catch (e) {
      setError('Не удалось загрузить новость');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [announcementId]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (error || !item) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <MaterialCommunityIcons name="alert-circle-outline" size={fs(56)} color={theme.mutedText} />
        <Text style={[styles.errorText, { color: theme.text, fontSize: fs(16) }]}>
          {error || 'Новость не найдена'}
        </Text>
        <Pressable
          onPress={loadData}
          style={[styles.retryBtn, { backgroundColor: theme.primary }]}
        >
          <Text style={[styles.retryText, { fontSize: fs(15) }]}>Повторить</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* Заголовок */}
      <View style={[styles.header, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={[styles.iconBox, { backgroundColor: theme.primary + '22' }]}>
          <MaterialCommunityIcons name="music-note" size={fs(36)} color={theme.primary} />
        </View>
        <Text style={[styles.title, { color: theme.text, fontSize: fs(24) }]}>
          {item.title}
        </Text>
        <View style={styles.metaRow}>
          <MaterialCommunityIcons name="account" size={fs(14)} color={theme.mutedText} />
          <Text style={[styles.meta, { color: theme.mutedText, fontSize: fs(12) }]}>
            Автор #{item.userId}
          </Text>
          <Text style={[styles.metaDot, { color: theme.mutedText, fontSize: fs(12) }]}>•</Text>
          <MaterialCommunityIcons name="calendar" size={fs(14)} color={theme.mutedText} />
          <Text style={[styles.meta, { color: theme.mutedText, fontSize: fs(12) }]}>
            ID #{item.id}
          </Text>
        </View>
      </View>

      {/* Тело */}
      <Text style={[styles.body, { color: theme.text, fontSize: fs(16) }]}>
        {item.body}
      </Text>

      <Text style={[styles.body, { color: theme.mutedText, fontSize: fs(15) }]}>
        Это демонстрационная новость, загруженная с REST API
        (jsonplaceholder.typicode.com). В реальном приложении здесь будет
        полноценный текст музыкальной новости.
      </Text>

      {/* Кнопка назад */}
      <Pressable
        onPress={() => navigation.goBack()}
        style={[styles.backBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
      >
        <MaterialCommunityIcons name="arrow-left" size={fs(20)} color={theme.text} />
        <Text style={[styles.backText, { color: theme.text, fontSize: fs(15) }]}>
          Назад к новостям
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:  { flexGrow: 1, padding: 24, paddingTop: 48 },
  center:     { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  header:     { borderRadius: 20, borderWidth: 1, padding: 20, marginBottom: 24, alignItems: 'center' },
  iconBox:    { width: 72, height: 72, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  title:      { fontWeight: '900', textAlign: 'center', marginBottom: 12 },
  metaRow:    { flexDirection: 'row', alignItems: 'center', gap: 4 },
  meta:       { fontWeight: '700' },
  metaDot:    { marginHorizontal: 6 },
  body:       { lineHeight: 24, marginBottom: 16 },
  errorText:  { textAlign: 'center', marginTop: 16, marginBottom: 24 },
  retryBtn:   { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  retryText:  { color: '#FFF', fontWeight: '900' },
  backBtn:    {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, padding: 16, borderRadius: 14, borderWidth: 1, marginTop: 8,
  },
  backText:   { fontWeight: '800' },
});