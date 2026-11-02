import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { TopBar } from '../components/TopBar';

type Category = 'Все' | 'Учёба' | 'События' | 'Спорт' | 'Объявления';

type Article = {
  id: string;
  category: Exclude<Category, 'Все'>;
  titleRu: string;
  titleEn: string;
  titleKk: string;
  bodyRu: string;
  bodyEn: string;
  bodyKk: string;
  icon: string;
};

const categories: Category[] = ['Все', 'Учёба', 'События', 'Спорт', 'Объявления'];

const articles: Article[] = [
  {
    id: '1',
    category: 'Учёба',
    titleRu: 'Старт весеннего семестра',
    titleEn: 'Spring semester starts',
    titleKk: 'Көктемгі семестр басталды',
    bodyRu: 'Весенний семестр официально начался. Проверьте своё расписание в личном кабинете — возможны изменения в парах.',
    bodyEn: 'The spring semester has officially started. Check your schedule in the personal account — changes are possible.',
    bodyKk: 'Көктемгі семестр ресми түрде басталды. Жеке кабинеттегі кестеңізді тексеріңіз — өзгерістер болуы мүмкін.',
    icon: 'school',
  },
  {
    id: '2',
    category: 'События',
    titleRu: 'Студенческий форум 2026',
    titleEn: 'Student Forum 2026',
    titleKk: 'Студенттік форум 2026',
    bodyRu: 'В конце месяца пройдёт ежегодный студенческий форум. Регистрация открыта до 20 числа.',
    bodyEn: 'The annual student forum will take place at the end of the month. Registration is open until the 20th.',
    bodyKk: 'Айдың соңында жыл сайынғы студенттік форум өтеді. Тіркелу 20-на дейін ашық.',
    icon: 'account-group',
  },
  {
    id: '3',
    category: 'Спорт',
    titleRu: 'Универсиада: результаты',
    titleEn: 'Universiade results',
    titleKk: 'Универсиада нәтижелері',
    bodyRu: 'Наши студенты заняли первое место по волейболу в городской универсиаде. Поздравляем команду!',
    bodyEn: 'Our students took first place in volleyball at the city universiade. Congratulations to the team!',
    bodyKk: 'Біздің студенттер қалалық универсиадада волейболдан бірінші орын алды. Команданы құттықтаймыз!',
    icon: 'basketball',
  },
  {
    id: '4',
    category: 'Объявления',
    titleRu: 'Продление читательских билетов',
    titleEn: 'Library card renewal',
    titleKk: 'Кітапхана билеттерін ұзарту',
    bodyRu: 'Библиотека продлевает читательские билеты до конца семестра. Зайдите в библиотеку с студенческим ID.',
    bodyEn: 'The library extends reader cards until the end of the semester. Visit the library with your student ID.',
    bodyKk: 'Кітапхана оқырман билеттерін семестр соңына дейін ұзартады. Кітапханаға студенттік ID-мен келіңіз.',
    icon: 'card-account-details',
  },
  {
    id: '5',
    category: 'Учёба',
    titleRu: 'Консультации перед сессией',
    titleEn: 'Pre-exam consultations',
    titleKk: 'Сессия алдындағы кеңестер',
    bodyRu: 'Преподаватели проводят дополнительные консультации перед экзаменами. Расписание — на сайте.',
    bodyEn: 'Teachers hold additional consultations before exams. Schedule is on the website.',
    bodyKk: 'Оқытушылар емтихан алдында қосымша кеңестер өткізеді. Кесте — сайтта.',
    icon: 'notebook-edit',
  },
  {
    id: '6',
    category: 'События',
    titleRu: 'День открытых дверей',
    titleEn: 'Open house day',
    titleKk: 'Ашық есік күні',
    bodyRu: 'Приглашаем на день открытых дверей. Расскажем о программах и покажем кампус.',
    bodyEn: 'Join us on open house day. We will present our programs and show the campus.',
    bodyKk: 'Ашық есік күніне шақырамыз. Бағдарламалар туралы айтып, кампусты көрсетеміз.',
    icon: 'door-open',
  },
];

export function CampusNewsScreen() {
  const { theme, language, fontSizeMultiplier } = useApp();
  const fs = (size: number) => size * fontSizeMultiplier;

  const [active, setActive] = useState<Category>('Все');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = active === 'Все' ? articles : articles.filter(a => a.category === active);

  const getTitle = (a: Article) =>
    language === 'en' ? a.titleEn : language === 'kk' ? a.titleKk : a.titleRu;

  const getBody = (a: Article) =>
    language === 'en' ? a.bodyEn : language === 'kk' ? a.bodyKk : a.bodyRu;

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}
    >
      <TopBar />

      <Text style={[styles.title, { color: theme.text, fontSize: fs(28) }]}>
        Новости кампуса
      </Text>
      <Text style={[styles.subtitle, { color: theme.mutedText, fontSize: fs(14) }]}>
        Свежие новости и объявления
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesRow}
      >
        {categories.map(cat => {
          const isActive = active === cat;
          return (
            <Pressable
              key={cat}
              onPress={() => setActive(cat)}
              style={[
                styles.categoryBtn,
                {
                  backgroundColor: isActive ? theme.primary : theme.surface,
                  borderColor: isActive ? theme.primary : theme.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  { color: isActive ? '#FFF' : theme.text, fontSize: fs(13) },
                ]}
                numberOfLines={1}
              >
                {cat}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {filtered.map(article => {
        const isExpanded = expandedId === article.id;
        return (
          <Pressable
            key={article.id}
            onPress={() => setExpandedId(isExpanded ? null : article.id)}
            style={[
              styles.card,
              { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.iconBox, { backgroundColor: theme.primary + '22' }]}>
                <MaterialCommunityIcons
                  name={article.icon as any}
                  size={fs(24)}
                  color={theme.primary}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardCategory, { color: theme.primary, fontSize: fs(11) }]}>
                  {article.category.toUpperCase()}
                </Text>
                <Text
                  style={[styles.cardTitle, { color: theme.text, fontSize: fs(15) }]}
                  numberOfLines={isExpanded ? undefined : 2}
                >
                  {getTitle(article)}
                </Text>
              </View>
              <MaterialCommunityIcons
                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                size={fs(22)}
                color={theme.mutedText}
              />
            </View>

            {isExpanded && (
              <Text style={[styles.cardBody, { color: theme.mutedText, fontSize: fs(14) }]}>
                {getBody(article)}
              </Text>
            )}
          </Pressable>
        );
      })}

      {filtered.length === 0 && (
        <Text style={[styles.empty, { color: theme.mutedText, fontSize: fs(14) }]}>
          В этой категории пока нет новостей
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:     { flexGrow: 1, padding: 24, paddingTop: 48 },
  title:         { fontWeight: '900', marginBottom: 6 },
  subtitle:      { marginBottom: 20 },
  categoriesRow: { gap: 8, paddingBottom: 16, alignItems: 'center' },
  categoryBtn: {
    height: 38, paddingHorizontal: 16, borderRadius: 19, borderWidth: 1,
    justifyContent: 'center', alignItems: 'center',
  },
  categoryText:  { fontWeight: '800' },
  card:          { padding: 14, borderRadius: 16, borderWidth: 1, marginBottom: 10 },
  cardHeader:    { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox:       { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cardCategory:  { fontWeight: '900', letterSpacing: 1, marginBottom: 2 },
  cardTitle:     { fontWeight: '800' },
  cardBody:      { marginTop: 12, lineHeight: 20 },
  empty:         { textAlign: 'center', paddingVertical: 32, fontStyle: 'italic' },
});