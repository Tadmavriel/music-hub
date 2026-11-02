import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { useApp } from '../context/AppContext';
import { TopBar } from '../components/TopBar';
import { SectionTitle } from '../components/SectionTitle';
import { ServiceCard } from '../components/ServiceCard';
import { services } from '../data/services';
import { Service } from '../types/service';
import { spacing } from '../styles/theme';

export function ServicesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { theme } = useApp();

  const openService = (service: Service) => {
    navigation.navigate('Details', {
      serviceId: service.id,
      title: service.title,
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <>
            <TopBar />
            <SectionTitle
              title="Сервисы"
              subtitle="Всё что нужно для учёбы"
            />
          </>
        }
        renderItem={({ item }) => (
          <ServiceCard service={item} onPress={openService} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list:      { padding: spacing.lg, paddingTop: 48 },
});