import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { useApp } from '../context/AppContext';
import { TopBar } from '../components/TopBar';

export function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { theme, t, profile, user, fontSizeMultiplier } = useApp();
  const fs = (size: number) => size * fontSizeMultiplier;

  const displayName = profile.displayName || user || 'Студент';

  const today = new Date();
  const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
  const months = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
  const dateStr = `${days[today.getDay()]}, ${today.getDate()} ${months[today.getMonth()]}`;

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
      <TopBar />

      <Text style={[styles.greeting, { color: theme.mutedText, fontSize: fs(13) }]}>
        {dateStr}
      </Text>

      <Text style={[styles.hello, { color: theme.text, fontSize: fs(26) }]}>
        Привет, {displayName}!
      </Text>
      <Text style={[styles.subHello, { color: theme.mutedText, fontSize: fs(15) }]}>
        {t.greeting} в Campus Hub
      </Text>

      {/* РАСПИСАНИЕ */}
      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="calendar-clock" size={fs(24)} color={theme.primary} />
          <Text style={[styles.cardTitle, { color: theme.text, fontSize: fs(17) }]}>
            Сегодня в расписании
          </Text>
        </View>

        <View style={styles.lessonRow}>
          <View style={[styles.timeBadge, { backgroundColor: theme.primary + '22' }]}>
            <Text style={[styles.timeText, { color: theme.primary, fontSize: fs(12) }]}>
              09:00
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.lessonTitle, { color: theme.text, fontSize: fs(14) }]}>
              Мобильная разработка
            </Text>
            <Text style={[styles.lessonSub, { color: theme.mutedText, fontSize: fs(12) }]}>
              Ауд. 305 · лекция
            </Text>
          </View>
        </View>

        <View style={styles.lessonRow}>
          <View style={[styles.timeBadge, { backgroundColor: theme.primary + '22' }]}>
            <Text style={[styles.timeText, { color: theme.primary, fontSize: fs(12) }]}>
              10:50
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.lessonTitle, { color: theme.text, fontSize: fs(14) }]}>
              Базы данных
            </Text>
            <Text style={[styles.lessonSub, { color: theme.mutedText, fontSize: fs(12) }]}>
              Ауд. 412 · практика
            </Text>
          </View>
        </View>
      </View>

      {/* БЫСТРЫЙ ДОСТУП */}
      <Text style={[styles.sectionTitle, { color: theme.text, fontSize: fs(16) }]}>
        {t.quickAccess}
      </Text>

      <View style={styles.quickRow}>
        <Pressable
          onPress={() => navigation.navigate('Details', { serviceId: 'schedule', title: 'Расписание' })}
          style={[styles.quickCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
        >
          <MaterialCommunityIcons name="calendar-clock" size={fs(28)} color={theme.primary} />
          <Text style={[styles.quickLabel, { color: theme.text, fontSize: fs(13) }]}>
            Расписание
          </Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('Details', { serviceId: 'library', title: 'Библиотека' })}
          style={[styles.quickCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
        >
          <MaterialCommunityIcons name="book-open-variant" size={fs(28)} color={theme.primary} />
          <Text style={[styles.quickLabel, { color: theme.text, fontSize: fs(13) }]}>
            Библиотека
          </Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('Details', { serviceId: 'grades', title: 'Оценки' })}
          style={[styles.quickCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
        >
          <MaterialCommunityIcons name="chart-line" size={fs(28)} color={theme.primary} />
          <Text style={[styles.quickLabel, { color: theme.text, fontSize: fs(13) }]}>
            Оценки
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:    { flexGrow: 1, padding: 24, paddingTop: 48 },
  greeting:     { fontWeight: '700', letterSpacing: 1, marginBottom: 4 },
  hello:        { fontWeight: '900', marginBottom: 2 },
  subHello:     { marginBottom: 24 },
  card:         { borderRadius: 18, borderWidth: 1, padding: 16, marginBottom: 20 },
  cardHeader:   { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  cardTitle:    { fontWeight: '900' },
  lessonRow:    { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  timeBadge:    { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  timeText:     { fontWeight: '900' },
  lessonTitle:  { fontWeight: '800', marginBottom: 2 },
  lessonSub:    { },
  sectionTitle: { fontWeight: '900', marginBottom: 12 },
  quickRow:     { flexDirection: 'row', gap: 10 },
  quickCard:    { flex: 1, padding: 16, borderRadius: 16, borderWidth: 1, alignItems: 'center', gap: 8 },
  quickLabel:   { fontWeight: '800', textAlign: 'center' },
});