import React, { useState, useRef } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Image, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { useApp, Language } from '../context/AppContext';
import { TopBar } from '../components/TopBar';
import { EditModal } from '../components/EditModal';

export function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {
    theme, themeName, setThemeName, language, setLanguage, t,
    user, profile, tracks, logout, addTrack, removeTrack, renameTrack, updateProfile
  } = useApp();

  const [editVisible, setEditVisible] = useState(false);
  const [editMode, setEditMode] = useState<'name' | 'bio' | 'track'>('name');
  const [editInitial, setEditInitial] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editPlaceholder, setEditPlaceholder] = useState('');
  const [editingTrackId, setEditingTrackId] = useState<string | null>(null);
  const pendingFileRef = useRef<{ uri: string; name: string; size?: number } | null>(null);

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

  const openRenameTrack = (id: string, currentName: string) => {
    setEditMode('track');
    setEditingTrackId(id);
    setEditTitle(t.renameTrack);
    setEditPlaceholder(t.newTrackName);
    setEditInitial(currentName);
    setEditVisible(true);
  };

  const handleSave = async (value: string) => {
    if (editMode === 'name') await updateProfile({ displayName: value });
    else if (editMode === 'bio') await updateProfile({ bio: value });
    else if (editMode === 'track') {
      if (editingTrackId) {
        await renameTrack(editingTrackId, value);
      } else if (pendingFileRef.current) {
        await addTrack({
          id: Date.now().toString(),
          name: value || pendingFileRef.current.name || 'Без названия',
          uri: pendingFileRef.current.uri,
          size: pendingFileRef.current.size,
        });
        pendingFileRef.current = null;
      }
    }
  };

  const pickAvatar = async () => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) { Alert.alert('!', 'Нет доступа к галерее'); return; }
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (res.canceled || !res.assets[0]) return;
      await updateProfile({ avatar: res.assets[0].uri });
    } catch (e) { Alert.alert('Ошибка', String(e)); }
  };

  const pickAudio = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
        multiple: false,
      });
      if (res.canceled || !res.assets?.[0]) return;
      const file = res.assets[0];
      pendingFileRef.current = { uri: file.uri, name: file.name || 'Без названия', size: file.size };
      setEditMode('track');
      setEditingTrackId(null);
      setEditTitle(t.trackName);
      setEditPlaceholder(t.newTrackName);
      setEditInitial(file.name || 'Без названия');
      setEditVisible(true);
    } catch (e) { Alert.alert('Ошибка', String(e)); }
  };

  const confirmRemove = (id: string, name: string) => {
    Alert.alert(t.confirmDelete, name, [
      { text: t.no, style: 'cancel' },
      { text: t.yes, style: 'destructive', onPress: () => removeTrack(id) },
    ]);
  };

  const langs: { code: Language; label: string; flag: string }[] = [
    { code: 'ru', label: t.langRu, flag: '🇷🇺' },
    { code: 'en', label: t.langEn, flag: '🇬🇧' },
    { code: 'kk', label: t.langKk, flag: '🇰🇿' },
  ];

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
      <TopBar />

      <Pressable onPress={pickAvatar} style={styles.avatarWrap}>
        {profile.avatar ? (
          <Image source={{ uri: profile.avatar }} style={[styles.avatar, { borderColor: theme.primary }]} />
        ) : (
          <View style={[styles.avatar, { backgroundColor: theme.surface, borderColor: theme.primary }]}>
            <Text style={[styles.avatarText, { color: theme.primary }]}>
              {(profile.displayName || user || '♪')[0].toUpperCase()}
            </Text>
          </View>
        )}
        <View style={[styles.cameraBadge, { backgroundColor: theme.primary }]}>
          <MaterialCommunityIcons name="camera" size={16} color="#FFF" />
        </View>
      </Pressable>

      <Pressable onPress={openEditName} style={styles.nameRow}>
        <Text style={[styles.name, { color: theme.text }]}>
          {profile.displayName || user || 'Guest'}
        </Text>
        <MaterialCommunityIcons name="pencil" size={18} color={theme.primary} />
      </Pressable>

      <Pressable onPress={openEditBio} style={styles.bioRow}>
        <Text style={[styles.bio, { color: theme.mutedText }]}>
          {profile.bio || '+ ' + t.changeBio}
        </Text>
      </Pressable>

      <View style={styles.statsRow}>
        <View style={[styles.statBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.statValue, { color: theme.primary }]}>{tracks.length}</Text>
          <Text style={[styles.statLabel, { color: theme.mutedText }]}>{t.tracks}</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.statValue, { color: theme.primary }]}>0</Text>
          <Text style={[styles.statLabel, { color: theme.mutedText }]}>{t.playlistsCount}</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.statValue, { color: theme.primary }]}>0</Text>
          <Text style={[styles.statLabel, { color: theme.mutedText }]}>{t.favoritesCount}</Text>
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>{t.myTracks}</Text>
      <View style={[styles.settingBlock, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Pressable onPress={pickAudio} style={[styles.uploadBtn, { backgroundColor: theme.primary }]}>
          <MaterialCommunityIcons name="music-note-plus" size={20} color="#FFF" />
          <Text style={styles.uploadText}>{t.uploadTrack}</Text>
        </Pressable>

        {tracks.length === 0 ? (
          <Text style={[styles.noTracks, { color: theme.mutedText }]}>{t.noTracks}</Text>
        ) : (
          tracks.map(tr => (
            <View key={tr.id} style={[styles.trackRow, { borderTopColor: theme.border }]}>
              <MaterialCommunityIcons name="music" size={20} color={theme.primary} />
              <Pressable style={{ flex: 1 }} onPress={() => openRenameTrack(tr.id, tr.name)}>
                <Text style={[styles.trackName, { color: theme.text }]} numberOfLines={1}>
                  {tr.name}
                </Text>
                <Text style={[styles.trackHint, { color: theme.mutedText }]}>{t.renameTrack}</Text>
              </Pressable>
              <Pressable onPress={() => confirmRemove(tr.id, tr.name)} hitSlop={8}>
                <MaterialCommunityIcons name="close-circle" size={22} color={theme.mutedText} />
              </Pressable>
            </View>
          ))
        )}
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>{t.theme}</Text>
      <View style={[styles.settingBlock, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Pressable
          onPress={() => setThemeName('light')}
          style={[styles.themeBtn, themeName === 'light' && { backgroundColor: theme.primary }]}
        >
          <MaterialCommunityIcons name="white-balance-sunny" size={20} color={themeName === 'light' ? '#FFF' : theme.text} />
          <Text style={[styles.themeText, { color: themeName === 'light' ? '#FFF' : theme.text }]}>{t.themeLight}</Text>
        </Pressable>
        <Pressable
          onPress={() => setThemeName('dark')}
          style={[styles.themeBtn, themeName === 'dark' && { backgroundColor: theme.primary }]}
        >
          <MaterialCommunityIcons name="moon-waning-crescent" size={20} color={themeName === 'dark' ? '#FFF' : theme.text} />
          <Text style={[styles.themeText, { color: themeName === 'dark' ? '#FFF' : theme.text }]}>{t.themeDark}</Text>
        </Pressable>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>{t.language}</Text>
      <View style={[styles.settingBlock, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        {langs.map(l => (
          <Pressable
            key={l.code}
            onPress={() => setLanguage(l.code)}
            style={[styles.langBtn, language === l.code && { backgroundColor: theme.primary }]}
          >
            <Text style={styles.langFlag}>{l.flag}</Text>
            <Text style={[styles.langLabel, { color: language === l.code ? '#FFF' : theme.text }]}>{l.label}</Text>
            {language === l.code && <MaterialCommunityIcons name="check" size={20} color="#FFF" />}
          </Pressable>
        ))}
      </View>

      <Pressable
        style={[styles.logoutButton, { backgroundColor: theme.primary }]}
        onPress={async () => { await logout(); navigation.replace('Login'); }}
      >
        <MaterialCommunityIcons name="logout" size={20} color="#FFF" />
        <Text style={styles.logoutText}>{t.logout}</Text>
      </Pressable>

      <EditModal
        visible={editVisible}
        title={editTitle}
        placeholder={editPlaceholder}
        initialValue={editInitial}
        onSave={handleSave}
        onClose={() => { setEditVisible(false); pendingFileRef.current = null; }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:    { flexGrow: 1, padding: 24, paddingTop: 48 },
  avatarWrap:   { alignSelf: 'center', marginTop: 8, position: 'relative' },
  avatar:       { width: 110, height: 110, borderRadius: 55, borderWidth: 2 },
  avatarText:   { fontSize: 46, fontWeight: '900', lineHeight: 110, textAlign: 'center' },
  cameraBadge:  { position: 'absolute', bottom: 4, right: 4, width: 34, height: 34, borderRadius: 17, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#1A0511' },
  nameRow:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16 },
  name:         { fontSize: 24, fontWeight: '900' },
  bioRow:       { alignItems: 'center', marginTop: 6, marginBottom: 24 },
  bio:          { fontSize: 14, textAlign: 'center' },
  statsRow:     { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statBox:      { flex: 1, padding: 14, borderRadius: 14, borderWidth: 1, alignItems: 'center' },
  statValue:    { fontSize: 22, fontWeight: '900' },
  statLabel:    { fontSize: 11, marginTop: 4, textAlign: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: '900', marginBottom: 10, marginTop: 8 },
  settingBlock: { borderRadius: 16, borderWidth: 1, padding: 8, marginBottom: 20 },
  uploadBtn:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, borderRadius: 12, marginBottom: 6 },
  uploadText:   { color: '#FFF', fontWeight: '900', fontSize: 15 },
  noTracks:     { fontSize: 13, textAlign: 'center', padding: 16, fontStyle: 'italic' },
  trackRow:     { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, paddingHorizontal: 8, borderTopWidth: 1 },
  trackName:    { fontSize: 14, fontWeight: '700' },
  trackHint:    { fontSize: 11, marginTop: 2 },
  themeBtn:     { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 12 },
  themeText:    { fontSize: 14, fontWeight: '800' },
  langBtn:      { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 12 },
  langFlag:     { fontSize: 22 },
  langLabel:    { flex: 1, fontSize: 14, fontWeight: '800' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 16, borderRadius: 16, marginTop: 8, marginBottom: 24 },
  logoutText:   { color: '#FFFFFF', fontWeight: '900', fontSize: 16 }
});