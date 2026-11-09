import React, { useState } from 'react';
import {
  View, Text, Image, Pressable, Linking, Alert, StyleSheet, Modal,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useApp } from '../context/AppContext';

type Props = {
  visible: boolean;
  uri: string | null;
  onClose: () => void;
  onPick: (uri: string | null) => Promise<void>;
};

const MAX_SIZE_MB = 5;

export function ProfilePhoto({ visible, uri, onClose, onPick }: Props) {
  const { theme, fontSizeMultiplier } = useApp();
  const fs = (size: number) => size * fontSizeMultiplier;

  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [settings, setSettings] = useState(false);
  const [info, setInfo] = useState<string>('');

  async function choosePhoto(source: 'camera' | 'gallery') {
    if (busy) return;
    setBusy(true);
    setMessage('');
    setSettings(false);

    try {
      if (source === 'camera') {
        const p = await ImagePicker.requestCameraPermissionsAsync();
        if (!p.granted) {
          setMessage('Доступ к камере запрещён');
          setSettings(!p.canAskAgain);
          return;
        }
      }

      if (source === 'gallery') {
        const p = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!p.granted) {
          setMessage('Доступ к галерее запрещён');
          setSettings(!p.canAskAgain);
          return;
        }
      }

      const result = source === 'camera'
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            quality: 0.8,
            allowsEditing: true,
            aspect: [1, 1],
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 0.8,
            allowsEditing: true,
            aspect: [1, 1],
          });

      if (result.canceled) return;
      const asset = result.assets[0];
      if (!asset) return;

      const sizeBytes = asset.fileSize ?? 0;
      const sizeMb = sizeBytes / (1024 * 1024);

      if (sizeMb > MAX_SIZE_MB) {
        setMessage(`Файл слишком большой (${sizeMb.toFixed(1)} МБ). Максимум ${MAX_SIZE_MB} МБ`);
        return;
      }

      const parts = [];
      if (asset.width) parts.push(`${asset.width}×${asset.height}`);
      if (sizeMb > 0) parts.push(`${sizeMb.toFixed(2)} МБ`);
      setInfo(parts.join(' · '));

      await onPick(asset.uri);
      setMessage('Фото обновлено');
    } catch (error) {
      console.error(error);
      setMessage('Не удалось открыть фото');
    } finally {
      setBusy(false);
    }
  }

  function handleRemove() {
    if (!uri) return;
    Alert.alert('Удалить фото?', 'Аватар будет удалён из профиля', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить',
        style: 'destructive',
        onPress: async () => {
          await onPick(null);
          setInfo('');
          setMessage('Фото удалено');
        },
      },
    ]);
  }

  function handleClose() {
    setMessage('');
    setInfo('');
    setSettings(false);
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <View style={styles.backdrop}>
        <View style={[styles.sheet, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.handleRow}>
            <View style={[styles.handle, { backgroundColor: theme.border }]} />
          </View>

          <View style={styles.headerRow}>
            <Text style={[styles.title, { color: theme.text, fontSize: fs(18) }]}>
              Фото профиля
            </Text>
            <Pressable onPress={handleClose} hitSlop={8}>
              <MaterialCommunityIcons name="close" size={fs(24)} color={theme.mutedText} />
            </Pressable>
          </View>

          {uri ? (
            <Image source={{ uri }} style={[styles.avatar, { borderColor: theme.primary }]} />
          ) : (
            <View style={[styles.avatar, styles.emptyAvatar, { backgroundColor: theme.surfaceMuted, borderColor: theme.primary }]}>
              <MaterialCommunityIcons name="account" size={fs(64)} color={theme.primary} />
            </View>
          )}

          {info ? (
            <Text style={[styles.info, { color: theme.mutedText, fontSize: fs(12) }]}>{info}</Text>
          ) : null}

          <Pressable
            disabled={busy}
            onPress={() => void choosePhoto('gallery')}
            style={[styles.bigBtn, { backgroundColor: theme.primary }]}
          >
            <MaterialCommunityIcons name="image-multiple" size={fs(20)} color="#FFF" />
            <Text style={[styles.bigBtnText, { fontSize: fs(15) }]}>Выбрать из галереи</Text>
          </Pressable>

          <Pressable
            disabled={busy}
            onPress={() => void choosePhoto('camera')}
            style={[styles.bigBtn, { backgroundColor: theme.primary }]}
          >
            <MaterialCommunityIcons name="camera" size={fs(20)} color="#FFF" />
            <Text style={[styles.bigBtnText, { fontSize: fs(15) }]}>Сделать фото</Text>
          </Pressable>

          {uri ? (
            <Pressable
              disabled={busy}
              onPress={handleRemove}
              style={[styles.bigBtnOutline, { borderColor: '#E5484D' }]}
            >
              <MaterialCommunityIcons name="delete-outline" size={fs(20)} color="#E5484D" />
              <Text style={[styles.bigBtnOutlineText, { color: '#E5484D', fontSize: fs(15) }]}>
                Удалить фото
              </Text>
            </Pressable>
          ) : null}

          {message ? (
            <Text style={[styles.message, { color: theme.mutedText, fontSize: fs(12) }]}>
              {message}
            </Text>
          ) : null}

          {settings ? (
            <Pressable
              onPress={() => void Linking.openSettings()}
              style={[styles.bigBtnOutline, { borderColor: theme.primary }]}
            >
              <MaterialCommunityIcons name="cog" size={fs(18)} color={theme.primary} />
              <Text style={[styles.bigBtnOutlineText, { color: theme.primary, fontSize: fs(14) }]}>
                Открыть настройки
              </Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop:      { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheet:         { borderTopLeftRadius: 24, borderTopRightRadius: 24, borderWidth: 1, padding: 20, paddingBottom: 32, gap: 10, alignItems: 'center' },
  handleRow:     { width: '100%', alignItems: 'center', marginBottom: 4 },
  handle:        { width: 40, height: 4, borderRadius: 2 },
  headerRow:     { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  title:         { fontWeight: '900' },
  avatar:        { width: 140, height: 140, borderRadius: 70, borderWidth: 3, marginVertical: 8 },
  emptyAvatar:   { justifyContent: 'center', alignItems: 'center' },
  info:          { fontWeight: '600', marginBottom: 4 },
  bigBtn:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', paddingVertical: 14, borderRadius: 14 },
  bigBtnText:    { color: '#FFF', fontWeight: '900' },
  bigBtnOutline: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', paddingVertical: 12, borderRadius: 14, borderWidth: 1.5 },
  bigBtnOutlineText: { fontWeight: '900' },
  message:       { textAlign: 'center', fontStyle: 'italic', marginTop: 4 },
});