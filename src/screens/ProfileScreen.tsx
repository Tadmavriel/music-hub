import React, { useState, useRef } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Image, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { useApp } from '../context/AppContext';
import { TopBar } from '../components/TopBar';
import { EditModal } from '../components/EditModal';

export function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {
    theme, t, user, profile, tracks, logout,
    addTrack, removeTrack, renameTrack, updateProfile, fontSizeMultiplier
  } = useApp();

  const fs = (size: number) => size * fontSizeMultiplier;

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

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
      <TopBar />

      <Pressable onPress={pickAvatar} style={styles.avatarWrap}>
        {profile.avatar ? (
          <Image source={{ uri: profile.avatar }} style={[styles.avatar, { borderColor: theme.primary }]} />
        ) : (
          <View style={[styles.avatar, { backgroundColor: theme.surface, borderColor: theme.primary }]}>
            <Text style={[styles.avatarText, { color: theme.primary, fontSize: fs(46), lineHeight: fs(46) * 2.4 }]}>
              {(profile.displayName || user || '♪')[0].toUpperCase()}
            </Text>
          </View>
        )}
        <View style={[styles.cameraBadge, { backgroundColor: theme.primary }]}>
          <MaterialCommunityIcons name="camera" size={16} color="#FFF" />
        </View>
      </Pressable>

      <Pressable onPress={openEditName} style={styles.nameRow}>
        <Text style={[styles.name, { color: theme.text, fontSize: fs(24) }]}>
          {profile.displayName || user || 'Guest'}
        </Text>
        <MaterialCommunityIcons name="pencil" size={fs(18)} color={theme.primary} />
      </Pressable>

      <Pressable onPress={openEditBio} style={styles.bioRow}>
        <Text style={[styles.bio, { color: theme.mutedText, fontSize: fs(14) }]}>
          {profile.bio || '+ ' + t.changeBio}
        </Text>
      </Pressable>

      {/* КНОПКА НАСТРОЙКИ */}
      <Pressable
        onPress={() => navigation.navigate('Settings')}
        style={[styles.settingsBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
      >
        <MaterialCommunityIcons name="cog" size={fs(22)} color={theme.primary} />
        <Text style={[styles.settingsText, { color: theme.text, fontSize: fs(15) }]}>
          {t.settingsTitle}
        </Text>
        <MaterialCommunityIcons name="chevron-right" size={fs(22)} color={theme.mutedText} />
      </Pressable>

      <View style={styles.statsRow}>
        <View style={[styles.statBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.statValue, { color: theme.primary, fontSize: fs(22) }]}>{tracks.length}</Text>
          <Text style={[styles.statLabel, { color: theme.mutedText, fontSize: fs(11) }]}>{t.tracks}</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.statValue, { color: theme.primary, fontSize: fs(22) }]}>0</Text>
          <Text style={[styles.statLabel, { color: theme.mutedText, fontSize: fs(11) }]}>{t.playlistsCount}</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.statValue, { color: theme.primary, fontSize: fs(22) }]}>0</Text>
          <Text style={[styles.statLabel, { color: theme.mutedText, fontSize: fs(11) }]}>{t.favoritesCount}</Text>
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text, fontSize: fs(16) }]}>{t.myTracks}</Text>
      <View style={[styles.settingBlock, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Pressable onPress={pickAudio} style={[styles.uploadBtn, { backgroundColor: theme.primary }]}>
          <MaterialCommunityIcons name="music-note-plus" size={fs(20)} color="#FFF" />
          <Text style={[styles.uploadText, { fontSize: fs(15) }]}>{t.uploadTrack}</Text>
        </Pressable>

        {tracks.length === 0 ? (
          <Text style={[styles.noTracks, { color: theme.mutedText, fontSize: fs(13) }]}>{t.noTracks}</Text>
        ) : (
          tracks.map(tr => (
            <View key={tr.id} style={[styles.trackRow, { borderTopColor: theme.border }]}>
              <MaterialCommunityIcons name="music" size={fs(20)} color={theme.primary} />
              <Pressable style={{ flex: 1 }} onPress={() => openRenameTrack(tr.id, tr.name)}>
                <Text style={[styles.trackName, { color: theme.text, fontSize: fs(14) }]} numberOfLines={1}>
                  {tr.name}
                </Text>
                <Text style={[styles.trackHint, { color: theme.mutedText, fontSize: fs(11) }]}>{t.renameTrack}</Text>
              </Pressable>
              <Pressable onPress={() => confirmRemove(tr.id, tr.name)} hitSlop={8}>
                <MaterialCommunityIcons name="close-circle" size={fs(22)} color={theme.mutedText} />
              </Pressable>
            </View>
          ))
        )}
      </View>

      <Pressable
        style={[styles.logoutButton, { backgroundColor: theme.primary }]}
        onPress={async () => { await logout(); navigation.replace('Login'); }}
      >
        <MaterialCommunityIcons name="logout" size={fs(20)} color="#FFF" />
        <Text style={[styles.logoutText, { fontSize: fs(16) }]}>{t.logout}</Text>
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
  avatarText:   { fontWeight: '900', textAlign: 'center' },
  cameraBadge:  { position: 'absolute', bottom: 4, right: 4, width: 34, height: 34, borderRadius: 17, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#1A0511' },
  nameRow:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16 },
  name:         { fontWeight: '900' },
  bioRow:       { alignItems: 'center', marginTop: 6, marginBottom: 20 },
  bio:          { textAlign: 'center' },
  settingsBtn:  {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 20,
  },
  settingsText: { flex: 1, fontWeight: '800' },
  statsRow:     { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statBox:      { flex: 1, padding: 14, borderRadius: 14, borderWidth: 1, alignItems: 'center' },
  statValue:    { fontWeight: '900' },
  statLabel:    { marginTop: 4, textAlign: 'center' },
  sectionTitle: { fontWeight: '900', marginBottom: 10, marginTop: 8 },
  settingBlock: { borderRadius: 16, borderWidth: 1, padding: 8, marginBottom: 20 },
  uploadBtn:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, borderRadius: 12, marginBottom: 6 },
  uploadText:   { color: '#FFF', fontWeight: '900' },
  noTracks:     { textAlign: 'center', padding: 16, fontStyle: 'italic' },
  trackRow:     { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, paddingHorizontal: 8, borderTopWidth: 1 },
  trackName:    { fontWeight: '700' },
  trackHint:    { marginTop: 2 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 16, borderRadius: 16, marginTop: 8, marginBottom: 24 },
  logoutText:   { color: '#FFFFFF', fontWeight: '900' },
});