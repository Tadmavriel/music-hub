import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeScreen } from '../screens/HomeScreen';
import { ServicesScreen } from '../screens/ServicesScreen';
import { CampusNewsScreen } from '../screens/CampusNewsScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import type { MainTabParamList } from '../types/navigation';
import { useApp } from '../context/AppContext';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabs() {
  const { theme, t } = useApp();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
          borderTopWidth: 1,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom + 6,
          paddingTop: 8,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.mutedText,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '800' },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: t.home,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home-variant" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Services"
        component={ServicesScreen}
        options={{
          tabBarLabel: t.services,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-grid" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="News"
        component={CampusNewsScreen}
        options={{
          tabBarLabel: t.news,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="newspaper" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarLabel: 'Избранное',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="bookmark" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: t.profile,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-circle" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}