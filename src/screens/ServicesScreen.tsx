import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Pressable, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { useApp } from '../context/AppContext';
import { TopBar } from '../components/TopBar';
import { SectionTitle } from '../components/SectionTitle';
import { ServiceCard } from '../components/ServiceCard';
import { EmptyState } from '../components/EmptyState';
import { services } from '../data/services';
import { Service } from '../types/service';
import { spacing } from '../styles/theme';

export function ServicesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { theme, fontSizeMultiplier } = useApp();
  const [showAvailable, setShowAvailable] = useState(false);

  const fs = (size: number) => size * fontSizeMultiplier;

  const openService = (service: Service) => {
    navigation.navigate('Details', {
      serviceId: service.id,
      title: service.title,
    });
  };

  const visibleServices = showAvailable
    ? services.filter(s => s.status !== 'unavailable')
    : services;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={visibleServices}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <>
            <TopBar />
            <SectionTitle
              title="Сервисы"
              subtitle="Всё что нужно для музыки"
            />
            <Pressable
              onPress={() => setShowAvailable(v => !v)}
              style={[
                styles.filter,
                {
                  backgroundColor: showAvailable ? theme.primary : theme.surface,
                  borderColor: theme.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: showAvailable ? '#FFF' : theme.text, fontSize: fs(13) },
                ]}
              >
                {showAvailable ? '★ Только доступные' : '☆ Все сервисы'}
              </Text>
            </Pressable>
          </>
        }
        renderItem={({ item }) => (
          <ServiceCard service={item} onPress={openService} />
        )}
        ListEmptyComponent={
          <EmptyState
            title="Ничего не найдено"
            message="Попробуй изменить фильтр"
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1 },
  list:       { padding: spacing.lg, paddingTop: 48 },
  filter:     {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  filterText: { fontWeight: '900' },
});