import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { useApp } from '../context/AppContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Details'>;

export function DetailsScreen({ route, navigation }: Props) {
  const { serviceId, title } = route.params;
  const { theme, fontSizeMultiplier } = useApp();
  const fs = (size: number) => size * fontSizeMultiplier;

  const getContent = () => {
    switch (serviceId) {
      case 'schedule':
        return {
          icon: 'calendar-clock',
          subtitle: 'Расписание на сегодня',
          items: [
            { time: '09:00', title: 'Мобильная разработка', place: 'Ауд. 305', type: 'Лекция' },
            { time: '10:50', title: 'Базы данных', place: 'Ауд. 412', type: 'Практика' },
            { time: '13:00', title: 'Веб-технологии', place: 'Ауд. 208', type: 'Лаборатория' },
            { time: '14:50', title: 'Английский язык', place: 'Ауд. 101', type: 'Семинар' },
          ],
        };
      case 'library':
        return {
          icon: 'book-open-variant',
          subtitle: 'Каталог книг и ресурсов',
          items: [
            { title: 'Чистый код', author: 'Роберт Мартин', available: 'Доступна' },
            { title: 'React Native в действии', author: 'Н. Докучаев', available: 'Доступна' },
            { title: 'Алгоритмы и структуры данных', author: 'А. Скиена', available: 'Занята' },
            { title: 'TypeScript. Подробное руководство', author: 'Б. Черный', available: 'Доступна' },
          ],
        };
      case 'grades':
        return {
          icon: 'chart-line',
          subtitle: 'Текущая успеваемость',
          items: [
            { subject: 'Мобильная разработка', grade: 'A', points: 95 },
            { subject: 'Базы данных', grade: 'B+', points: 87 },
            { subject: 'Веб-технологии', grade: 'A-', points: 91 },
            { subject: 'Английский язык', grade: 'B', points: 83 },
          ],
        };
      case 'cafeteria':
        return {
          icon: 'silverware-fork-knife',
          subtitle: 'Меню на сегодня',
          items: [
            { time: 'Завтрак', title: 'Каша, омлет, чай', place: '08:00–10:00', type: '' },
            { time: 'Обед', title: 'Суп, второе, компот', place: '12:00–15:00', type: '' },
            { time: 'Ужин', title: 'Салат, горячее', place: '17:00–19:00', type: '' },
          ],
        };
      default:
        return {
          icon: 'information-outline',
          subtitle: 'Информация о сервисе',
          items: [
            { title: 'Раздел в разработке', author: 'Скоро здесь появится информация', available: '' },
          ],
        };
    }
  };

  const content = getContent();

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={[styles.iconCircle, { backgroundColor: theme.primary + '22' }]}>
          <MaterialCommunityIcons name={content.icon as any} size={fs(32)} color={theme.primary} />
        </View>
        <Text style={[styles.title, { color: theme.text, fontSize: fs(24) }]}>{title}</Text>
        <Text style={[styles.subtitle, { color: theme.mutedText, fontSize: fs(14) }]}>
          {content.subtitle}
        </Text>
      </View>

      {content.items.map((item: any, i: number) => {
        if (item.time && item.type !== undefined) {
          return (
            <View key={i} style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <View style={[styles.badge, { backgroundColor: theme.primary + '22' }]}>
                <Text style={[styles.badgeText, { color: theme.primary, fontSize: fs(12) }]}>
                  {item.time}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.itemTitle, { color: theme.text, fontSize: fs(15) }]}>
                  {item.title}
                </Text>
                <Text style={[styles.itemSub, { color: theme.mutedText, fontSize: fs(12) }]}>
                  {item.place}{item.type ? ' · ' + item.type : ''}
                </Text>
              </View>
            </View>
          );
        }
        if (item.author) {
          return (
            <View key={i} style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <MaterialCommunityIcons name="book" size={fs(24)} color={theme.primary} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.itemTitle, { color: theme.text, fontSize: fs(15) }]}>
                  {item.title}
                </Text>
                <Text style={[styles.itemSub, { color: theme.mutedText, fontSize: fs(12) }]}>
                  {item.author}{item.available ? ' · ' + item.available : ''}
                </Text>
              </View>
            </View>
          );
        }
        if (item.subject) {
          return (
            <View key={i} style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.itemTitle, { color: theme.text, fontSize: fs(15) }]}>
                  {item.subject}
                </Text>
                <Text style={[styles.itemSub, { color: theme.mutedText, fontSize: fs(12) }]}>
                  {item.points} баллов
                </Text>
              </View>
              <Text style={[styles.grade, { color: theme.primary, fontSize: fs(20) }]}>
                {item.grade}
              </Text>
            </View>
          );
        }
        return null;
      })}

      <Pressable
        onPress={() => navigation.goBack()}
        style={[styles.backBtn, { backgroundColor: theme.primary }]}
      >
        <MaterialCommunityIcons name="arrow-left" size={fs(20)} color="#FFF" />
        <Text style={[styles.backText, { fontSize: fs(16) }]}>Назад</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:  { flexGrow: 1, padding: 24, paddingTop: 48 },
  header:     { borderRadius: 20, borderWidth: 1, padding: 20, marginBottom: 16, alignItems: 'center' },
  iconCircle: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  title:      { fontWeight: '900', textAlign: 'center', marginBottom: 6 },
  subtitle:   { textAlign: 'center' },
  card:       { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 14, borderWidth: 1, marginBottom: 8 },
  badge:      { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  badgeText:  { fontWeight: '900' },
  itemTitle:  { fontWeight: '800', marginBottom: 2 },
  itemSub:    { },
  grade:      { fontWeight: '900' },
  backBtn:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, borderRadius: 16, marginTop: 16 },
  backText:   { color: '#FFF', fontWeight: '900' },
});