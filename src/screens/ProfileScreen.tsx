import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { useApp } from '../context/AppContext';
import { TopBar } from '../components/TopBar';
import { EditModal } from '../components/EditModal';
import { ProfilePhoto } from '../components/ProfilePhoto';

export function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { theme, t, user, profile, logout, updateProfile, fontSizeMultiplier } = useApp();
  const fs = (size: number) => size * fontSizeMultiplier;

  const [photoVisible, setPhotoVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [editMode, setEditMode] = useState<'name' | 'bio'>('name');
  const [editInitial, setEditInitial] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editPlaceholder, setEditPlaceholder] = useState('');

  const openEditName = () => {
    setEditMode('name');
    setEditTitle(t.changeName);
    setEditPlaceholder(t.newName);
    setEditInitial(profile.displayName || user || '');
    setEditVisible(true);
  };

  const openEditBio = () => {
    setEditMode('bio');
    setEditTitle(t.changeBio);
    setEditPlaceholder(t.newBio);
    setEditInitial(profile.bio || '');
    setEditVisible(true);
  };

  const handleSave = async (value: string) => {
    if (editMode === 'name') await updateProfile({ displayName: value });
    else if (editMode === 'bio') await updateProfile({ bio: value });
  };

  const displayName = profile.displayName || user || 'Студент';

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
      <TopBar />

      <View style={[styles.headerCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={styles.headerBg}>
          <View style={[styles.headerGradient, { backgroundColor: theme.primary }]} />
        </View>

        <View style={styles.headerContent}>
          <Pressable onPress={() => setPhotoVisible(true)} style={styles.avatarWrap}>
            {profile.avatar ? (
              <Image source={{ uri: profile.avatar }} style={[styles.avatar, { borderColor: theme.primary }]} />
            ) : (
              <View style={[styles.avatar, { backgroundColor: theme.surface, borderColor: theme.primary }]}>
                <Text style={[styles.avatarText, { color: theme.primary, fontSize: fs(42), lineHeight: fs(42) * 2.3 }]}>
                  {displayName[0].toUpperCase()}
                </Text>
              </View>
            )}
            <View style={[styles.cameraBadge, { backgroundColor: theme.primary }]}>
              <MaterialCommunityIcons name="camera" size={16} color="#FFF" />
            </View>
          </Pressable>

          <Pressable
            onPress={() => setPhotoVisible(true)}
            style={[styles.editPhotoBtn, { borderColor: theme.primary }]}
          >
            <MaterialCommunityIcons name="image-edit" size={fs(14)} color={theme.primary} />
            <Text style={[styles.editPhotoText, { color: theme.primary, fontSize: fs(12) }]}>
              Редактировать фото
            </Text>
          </Pressable>

          <Pressable onPress={openEditName} style={styles.nameRow}>
            <Text style={[styles.name, { color: theme.text, fontSize: fs(22) }]} numberOfLines={1}>
              {displayName}
            </Text>
            <MaterialCommunityIcons name="pencil" size={fs(16)} color={theme.mutedText} />
          </Pressable>

          <Pressable onPress={openEditBio} style={styles.bioRow}>
            <Text style={[styles.bio, { color: theme.mutedText, fontSize: fs(13) }]} numberOfLines={2}>
              {profile.bio || '+ Добавить описание'}
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={[styles.statIconWrap, { backgroundColor: '#3B82F622' }]}>
            <MaterialCommunityIcons name="school" size={fs(22)} color="#3B82F6" />
          </View>
          <Text style={[styles.statValue, { color: theme.text, fontSize: fs(20) }]}>3</Text>
          <Text style={[styles.statLabel, { color: theme.mutedText, fontSize: fs(11) }]}>Курс</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={[styles.statIconWrap, { backgroundColor: '#8B5CF622' }]}>
            <MaterialCommunityIcons name="book-open-page-variant" size={fs(22)} color="#8B5CF6" />
          </View>
          <Text style={[styles.statValue, { color: theme.text, fontSize: fs(20) }]}>4</Text>
          <Text style={[styles.statLabel, { color: theme.mutedText, fontSize: fs(11) }]}>Предмета</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={[styles.statIconWrap, { backgroundColor: '#10B98122' }]}>
            <MaterialCommunityIcons name="star-circle" size={fs(22)} color="#10B981" />
          </View>
          <Text style={[styles.statValue, { color: theme.text, fontSize: fs(20) }]}>4.6</Text>
          <Text style={[styles.statLabel, { color: theme.mutedText, fontSize: fs(11) }]}>GPA</Text>
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text, fontSize: fs(16) }]}>Действия</Text>

      <Pressable
        onPress={() => navigation.navigate('EventRegistration')}
        style={({ pressed }) => [styles.actionBtn, { backgroundColor: theme.surface, borderColor: theme.border, opacity: pressed ? 0.85 : 1 }]}
      >
        <View style={[styles.actionIcon, { backgroundColor: '#3B82F622' }]}>
          <MaterialCommunityIcons name="calendar-plus" size={fs(22)} color="#3B82F6" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.actionTitle, { color: theme.text, fontSize: fs(15) }]}>Запись на событие</Text>
          <Text style={[styles.actionSub, { color: theme.mutedText, fontSize: fs(12) }]}>Запишись на мероприятие</Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={fs(22)} color={theme.mutedText} />
      </Pressable>

      <Pressable
        onPress={() => navigation.navigate('Settings')}
        style={({ pressed }) => [styles.actionBtn, { backgroundColor: theme.surface, borderColor: theme.border, opacity: pressed ? 0.85 : 1 }]}
      >
        <View style={[styles.actionIcon, { backgroundColor: '#8B5CF622' }]}>
          <MaterialCommunityIcons name="cog" size={fs(22)} color="#8B5CF6" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.actionTitle, { color: theme.text, fontSize: fs(15) }]}>{t.settingsTitle}</Text>
          <Text style={[styles.actionSub, { color: theme.mutedText, fontSize: fs(12) }]}>Тема, шрифт, язык</Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={fs(22)} color={theme.mutedText} />
      </Pressable>

      <Pressable
        style={({ pressed }) => [styles.logoutBtn, { borderColor: '#E5484D', opacity: pressed ? 0.8 : 1 }]}
        onPress={async () => { await logout(); navigation.replace('Login'); }}
      >
        <MaterialCommunityIcons name="logout" size={fs(18)} color="#E5484D" />
        <Text style={[styles.logoutText, { fontSize: fs(15) }]}>{t.logout}</Text>
      </Pressable>

      <ProfilePhoto
        visible={photoVisible}
        uri={profile.avatar}
        onClose={() => setPhotoVisible(false)}
        onPick={async (newUri) => updateProfile({ avatar: newUri })}
      />

      <EditModal
        visible={editVisible}
        title={editTitle}
        placeholder={editPlaceholder}
        initialValue={editInitial}
        onSave={handleSave}
        onClose={() => setEditVisible(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:     { flexGrow: 1, padding: 24, paddingTop: 48 },
  headerCard:    { borderRadius: 20, borderWidth: 1, overflow: 'hidden', marginBottom: 20 },
  headerBg:      { height: 100, position: 'relative' },
  headerGradient:{ flex: 1, opacity: 0.85 },
  headerContent: { alignItems: 'center', paddingHorizontal: 20, paddingBottom: 20, marginTop: -50 },
  avatarWrap:    { position: 'relative', marginBottom: 8 },
  avatar:        { width: 100, height: 100, borderRadius: 50, borderWidth: 4 },
  avatarText:    { fontWeight: '900', textAlign: 'center' },
  cameraBadge:   { position: 'absolute', bottom: 2, right: 2, width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#0A1628' },
  editPhotoBtn:  { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, marginBottom: 10 },
  editPhotoText: { fontWeight: '800' },
  nameRow:       { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  name:          { fontWeight: '900' },
  bioRow:        { paddingHorizontal: 10 },
  bio:           { textAlign: 'center' },
  statsRow:      { flexDirection: 'row', gap: 10, marginBottom: 24 },
  statCard:      { flex: 1, padding: 14, borderRadius: 16, borderWidth: 1, alignItems: 'center' },
  statIconWrap:  { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  statValue:     { fontWeight: '900' },
  statLabel:     { marginTop: 2 },
  sectionTitle:  { fontWeight: '900', marginBottom: 12 },
  actionBtn:     { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, borderWidth: 1, marginBottom: 10 },
  actionIcon:    { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  actionTitle:   { fontWeight: '900', marginBottom: 2 },
  actionSub:     { },
  logoutBtn:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, borderRadius: 16, borderWidth: 2, marginTop: 20, marginBottom: 24 },
  logoutText:    { color: '#E5484D', fontWeight: '900' },
});