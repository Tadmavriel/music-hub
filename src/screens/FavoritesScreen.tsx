import React, { useCallback, useRef, useState } from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { TopBar } from '../components/TopBar';
import { EmptyState } from '../components/EmptyState';
import {
  getSavedPosts, toggleRead, removeSaved, type SavedPost
} from '../database/favorites';

export function FavoritesScreen() {
  const { theme, fontSizeMultiplier } = useApp();
  const fs = (size: number) => size * fontSizeMultiplier;

  const [items, setItems] = useState<SavedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const locked = useRef(false);

  const reload = useCallback(async () => {
    try {
      setError('');
      const rows = await getSavedPosts();
      setItems(rows);
    } catch {
      setError('Не удалось загрузить избранное');
    }
  }, []);

  useFocusEffect(useCallback(() => {
    let active = true;
    setLoading(true);
    reload().finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [reload]));

  const change = async (action: () => Promise<void>) => {
    if (locked.current) return;
    locked.current = true;
    setBusy(true);
    setError('');
    try {
      await action();
      await reload();
    } catch {
      setError('Ошибка изменения. Попробуйте снова.');
    } finally {
      locked.current = false;
      setBusy(false);
    }
  };

  const confirmRemove = (id: number) => {
    Alert.alert(
      'Удалить запись?',
      'Офлайн-копия будет удалена.',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: () => { void change(() => removeSaved(id)); },
        },
      ]
    );
  };

  const unreadCount = items.filter(i => !i.isRead).length;

  const renderItem = ({ item }: { item: SavedPost }) => {
    const isUnread = !item.isRead;
    return (
      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        {/* Верхняя строка: статус + кнопка удаления */}
        <View style={styles.cardTop}>
          <View style={[
            styles.statusBadge,
            { backgroundColor: isUnread ? theme.primary + '22' : theme.surfaceMuted }
          ]}>
            <MaterialCommunityIcons
              name={isUnread ? 'circle-small' : 'check'}
              size={fs(14)}
              color={isUnread ? theme.primary : theme.mutedText}
            />
            <Text style={[
              styles.statusText,
              { color: isUnread ? theme.primary : theme.mutedText, fontSize: fs(11) }
            ]}>
              {isUnread ? 'НЕ ПРОЧИТАНО' : 'ПРОЧИТАНО'}
            </Text>
          </View>

          <Pressable
            onPress={() => confirmRemove(item.id)}
            hitSlop={8}
            style={styles.deleteBtn}
          >
            <MaterialCommunityIcons name="trash-can-outline" size={fs(20)} color="#E5484D" />
          </Pressable>
        </View>

        {/* Заголовок и текст */}
        <Text style={[styles.title, { color: theme.text, fontSize: fs(16) }]} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={[styles.body, { color: theme.mutedText, fontSize: fs(13) }]} numberOfLines={3}>
          {item.body}
        </Text>

        {/* Кнопка "Отметить" */}
        <Pressable
          disabled={busy || loading || !!error}
          onPress={() => { void change(() => toggleRead(item.id)); }}
          style={[
            styles.toggleBtn,
            {
              backgroundColor: isUnread ? theme.primary : theme.surfaceMuted,
              borderColor: isUnread ? theme.primary : theme.border,
            }
          ]}
        >
          <MaterialCommunityIcons
            name={isUnread ? 'email-open-outline' : 'email-outline'}
            size={fs(16)}
            color={isUnread ? '#FFF' : theme.text}
          />
          <Text style={[
            styles.toggleText,
            { color: isUnread ? '#FFF' : theme.text, fontSize: fs(13) }
          ]}>
            {isUnread ? 'Отметить прочитанным' : 'Отметить непрочитанным'}
          </Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <>
            <TopBar />
            <Text style={[styles.pageTitle, { color: theme.text, fontSize: fs(28) }]}>
              Избранное
            </Text>
            <View style={styles.headerRow}>
              <Text style={[styles.pageSub, { color: theme.mutedText, fontSize: fs(14) }]}>
                {items.length} {items.length === 1 ? 'запись' : 'записей'}
              </Text>
              {unreadCount > 0 && (
                <View style={[styles.unreadBadge, { backgroundColor: theme.primary }]}>
                  <Text style={[styles.unreadText, { fontSize: fs(11) }]}>
                    {unreadCount} новых
                  </Text>
                </View>
              )}
            </View>

            {loading && (
              <ActivityIndicator color={theme.primary} style={{ marginVertical: 16 }} />
            )}
            {error ? (
              <Text style={[styles.error, { fontSize: fs(13) }]}>{error}</Text>
            ) : null}
            {busy && (
              <Text style={{ color: theme.mutedText, fontSize: fs(12), marginBottom: 8 }}>
                Сохранение...
              </Text>
            )}
          </>
        }
        renderItem={renderItem}
        ListEmptyComponent={
          !loading && items.length === 0 ? (
            <EmptyState
              icon="bookmark-outline"
              title="Пока ничего не сохранено"
              message="Откройте вкладку «Новости» и нажмите «Сохранить офлайн»"
            />
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1 },
  list:         { padding: 24, paddingTop: 48 },
  pageTitle:    { fontWeight: '900', marginBottom: 6 },
  headerRow:    { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  pageSub:      { fontWeight: '600' },
  unreadBadge:  { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  unreadText:   { color: '#FFF', fontWeight: '900' },
  error:        { color: '#E5484D', marginBottom: 8, fontWeight: '600' },

  card:         { padding: 16, borderRadius: 18, borderWidth: 1, marginBottom: 10 },
  cardTop:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  statusBadge:  { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  statusText:   { fontWeight: '900', letterSpacing: 0.5 },
  deleteBtn:    { padding: 4 },

  title:        { fontWeight: '900', marginBottom: 6, lineHeight: 20 },
  body:         { lineHeight: 18, marginBottom: 12 },

  toggleBtn:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 10, borderWidth: 1 },
  toggleText:   { fontWeight: '800' },
});