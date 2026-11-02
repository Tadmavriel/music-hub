import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { useApp } from '../context/AppContext';
import { TopBar } from '../components/TopBar';

type Lesson = {
  time: string;
  endTime: string;
  title: string;
  place: string;
  type: string;
  grade?: number;
};

// Расписание на неделю (реальное + рандом)
const WEEK_SCHEDULE: Record<string, Lesson[]> = {
  'Понедельник': [
    { time: '13:00', endTime: '13:50', title: 'Мобильное приложение', place: 'Ауд. 305', type: 'Лекция', grade: 95 },
    { time: '14:00', endTime: '14:50', title: 'Мобильное приложение', place: 'Ауд. 305', type: 'Практика', grade: 95 },
  ],
  'Вторник': [
    { time: '09:00', endTime: '09:50', title: 'Базы данных', place: 'Ауд. 412', type: 'Лекция', grade: 88 },
    { time: '10:00', endTime: '10:50', title: 'Базы данных', place: 'Ауд. 412', type: 'Практика', grade: 88 },
    { time: '13:00', endTime: '13:50', title: 'Веб-технологии', place: 'Ауд. 208', type: 'Лаборатория', grade: 91 },
  ],
  'Среда': [
    { time: '10:00', endTime: '10:50', title: 'Английский язык', place: 'Ауд. 101', type: 'Семинар', grade: 83 },
    { time: '11:00', endTime: '11:50', title: 'Английский язык', place: 'Ауд. 101', type: 'Семинар', grade: 83 },
  ],
  'Четверг': [
    { time: '09:00', endTime: '09:50', title: 'Алгоритмы и структуры данных', place: 'Ауд. 310', type: 'Лекция', grade: 92 },
    { time: '13:00', endTime: '13:50', title: 'Мобильное приложение', place: 'Ауд. 305', type: 'Лаборатория', grade: 95 },
  ],
  'Пятница': [
    { time: '10:00', endTime: '10:50', title: 'Физика', place: 'Ауд. 505', type: 'Лекция', grade: 78 },
    { time: '11:00', endTime: '11:50', title: 'Физика', place: 'Ауд. 505', type: 'Практика', grade: 78 },
  ],
  'Суббота': [],
  'Воскресенье': [],
};

const DAYS = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
const MONTHS = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

export function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { theme, t, profile, user, fontSizeMultiplier } = useApp();
  const fs = (size: number) => size * fontSizeMultiplier;

  const displayName = profile.displayName || user || 'Студент';

  const today = new Date();
  const dayName = DAYS[today.getDay()];
  const dateStr = `${dayName}, ${today.getDate()} ${MONTHS[today.getMonth()]}`;
  const todayLessons = WEEK_SCHEDULE[dayName] || [];

  const avgGrade = todayLessons.length > 0
    ? Math.round(todayLessons.filter(l => l.grade).reduce((s, l) => s + (l.grade || 0), 0) / todayLessons.filter(l => l.grade).length)
    : 0;

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
      <TopBar />

      <Text style={[styles.date, { color: theme.mutedText, fontSize: fs(13) }]}>
        {dateStr}
      </Text>
      <Text style={[styles.hello, { color: theme.text, fontSize: fs(26) }]}>
        Привет, {displayName}!
      </Text>
      <Text style={[styles.subHello, { color: theme.mutedText, fontSize: fs(14) }]}>
        {t.greeting} в Campus Hub
      </Text>

      {/* СТАТИСТИКА */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <MaterialCommunityIcons name="book-open-page-variant" size={fs(24)} color={theme.primary} />
          <Text style={[styles.statValue, { color: theme.text, fontSize: fs(20) }]}>
            {todayLessons.length}
          </Text>
          <Text style={[styles.statLabel, { color: theme.mutedText, fontSize: fs(11) }]}>
            Пар сегодня
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <MaterialCommunityIcons name="star-circle" size={fs(24)} color="#F59E0B" />
          <Text style={[styles.statValue, { color: theme.text, fontSize: fs(20) }]}>
            {avgGrade || '—'}
          </Text>
          <Text style={[styles.statLabel, { color: theme.mutedText, fontSize: fs(11) }]}>
            Средний балл
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <MaterialCommunityIcons name="calendar-check" size={fs(24)} color="#10B981" />
          <Text style={[styles.statValue, { color: theme.text, fontSize: fs(20) }]}>
            0
          </Text>
          <Text style={[styles.statLabel, { color: theme.mutedText, fontSize: fs(11) }]}>
            Событий
          </Text>
        </View>
      </View>

      {/* РАСПИСАНИЕ */}
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text, fontSize: fs(18) }]}>
          Расписание на сегодня
        </Text>
      </View>

      {todayLessons.length === 0 ? (
        <View style={[styles.emptyCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <MaterialCommunityIcons name="coffee" size={fs(40)} color={theme.mutedText} />
          <Text style={[styles.emptyText, { color: theme.mutedText, fontSize: fs(14) }]}>
            Сегодня пар нет — отдыхай!
          </Text>
        </View>
      ) : (
        todayLessons.map((lesson, i) => (
          <View
            key={i}
            style={[styles.lessonCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
          >
            <View style={[styles.timeBlock, { backgroundColor: theme.primary + '22' }]}>
              <Text style={[styles.timeText, { color: theme.primary, fontSize: fs(13) }]}>
                {lesson.time}
              </Text>
              <Text style={[styles.timeEnd, { color: theme.mutedText, fontSize: fs(10) }]}>
                {lesson.endTime}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.lessonTitle, { color: theme.text, fontSize: fs(15) }]}>
                {lesson.title}
              </Text>
              <Text style={[styles.lessonSub, { color: theme.mutedText, fontSize: fs(12) }]}>
                {lesson.place} · {lesson.type}
              </Text>
            </View>
            {lesson.grade ? (
              <View style={[styles.gradeBadge, { backgroundColor: theme.primary + '22' }]}>
                <Text style={[styles.gradeText, { color: theme.primary, fontSize: fs(13) }]}>
                  {lesson.grade}
                </Text>
              </View>
            ) : null}
          </View>
        ))
      )}

      {/* БЫСТРЫЙ ДОСТУП */}
      <Text style={[styles.sectionTitle, { color: theme.text, fontSize: fs(18), marginTop: 24 }]}>
        Быстрый доступ
      </Text>

      <Pressable
        onPress={() => navigation.navigate('EventRegistration')}
        style={[styles.bigAction, { backgroundColor: theme.primary }]}
      >
        <MaterialCommunityIcons name="calendar-plus" size={fs(28)} color="#FFF" />
        <View style={{ flex: 1, marginLeft: 14 }}>
          <Text style={[styles.bigActionTitle, { fontSize: fs(16) }]}>
            Запись на событие
          </Text>
          <Text style={[styles.bigActionSub, { fontSize: fs(12) }]}>
            Запишись на мероприятие
          </Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={fs(24)} color="#FFF" />
      </Pressable>

      <View style={styles.quickRow}>
        <Pressable
          onPress={() => navigation.navigate('Details', { serviceId: 'grades', title: 'Оценки' })}
          style={[styles.quickCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
        >
          <MaterialCommunityIcons name="chart-line" size={fs(26)} color={theme.primary} />
          <Text style={[styles.quickLabel, { color: theme.text, fontSize: fs(13) }]}>
            Оценки
          </Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('Details', { serviceId: 'library', title: 'Библиотека' })}
          style={[styles.quickCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
        >
          <MaterialCommunityIcons name="book-open-variant" size={fs(26)} color={theme.primary} />
          <Text style={[styles.quickLabel, { color: theme.text, fontSize: fs(13) }]}>
            Библиотека
          </Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('Details', { serviceId: 'cafeteria', title: 'Столовая' })}
          style={[styles.quickCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
        >
          <MaterialCommunityIcons name="silverware-fork-knife" size={fs(26)} color={theme.primary} />
          <Text style={[styles.quickLabel, { color: theme.text, fontSize: fs(13) }]}>
            Столовая
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:    { flexGrow: 1, padding: 24, paddingTop: 48 },
  date:         { fontWeight: '700', letterSpacing: 1, marginBottom: 4 },
  hello:        { fontWeight: '900', marginBottom: 2 },
  subHello:     { marginBottom: 24 },

  statsRow:     { flexDirection: 'row', gap: 10, marginBottom: 24 },
  statCard:     { flex: 1, padding: 14, borderRadius: 16, borderWidth: 1, alignItems: 'center' },
  statValue:    { fontWeight: '900', marginTop: 6 },
  statLabel:    { marginTop: 2, textAlign: 'center' },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle:  { fontWeight: '900' },

  emptyCard:    { padding: 24, borderRadius: 16, borderWidth: 1, alignItems: 'center' },
  emptyText:    { marginTop: 8, fontStyle: 'italic' },

  lessonCard:   { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, borderWidth: 1, marginBottom: 8 },
  timeBlock:    { paddingVertical: 8, paddingHorizontal: 10, borderRadius: 10, alignItems: 'center', minWidth: 56 },
  timeText:     { fontWeight: '900' },
  timeEnd:      { marginTop: 2 },
  lessonTitle:  { fontWeight: '800', marginBottom: 2 },
  lessonSub:    { },
  gradeBadge:   { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  gradeText:    { fontWeight: '900' },

  bigAction:    { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, marginBottom: 16 },
  bigActionTitle: { color: '#FFF', fontWeight: '900' },
  bigActionSub:   { color: '#FFF', opacity: 0.85, marginTop: 2 },

  quickRow:     { flexDirection: 'row', gap: 10 },
  quickCard:    { flex: 1, padding: 16, borderRadius: 16, borderWidth: 1, alignItems: 'center', gap: 8 },
  quickLabel:   { fontWeight: '800', textAlign: 'center' },
});