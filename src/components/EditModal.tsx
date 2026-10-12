import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';

type Props = {
  visible: boolean;
  title: string;
  placeholder: string;
  initialValue?: string;
  onSave: (value: string) => void;
  onClose: () => void;
};

export function EditModal({ visible, title, placeholder, initialValue = '', onSave, onClose }: Props) {
  const { theme, t } = useApp();
  const [value, setValue] = useState(initialValue);

  useEffect(() => { if (visible) setValue(initialValue); }, [visible, initialValue]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
          onPress={() => {}}
        >
          <Text style={[styles.title, { color: theme.text }]}>{title}</Text>

          <TextInput
            style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.surfaceMuted }]}
            placeholder={placeholder}
            placeholderTextColor={theme.placeholder}
            value={value}
            onChangeText={setValue}
            autoFocus
          />

          <View style={styles.row}>
            <Pressable
              style={[styles.btn, { backgroundColor: theme.surfaceMuted, borderColor: theme.border }]}
              onPress={onClose}
            >
              <Text style={[styles.btnText, { color: theme.text }]}>{t.cancel}</Text>
            </Pressable>
            <Pressable
              style={[styles.btn, { backgroundColor: theme.primary, borderColor: theme.primary }]}
              onPress={() => { onSave(value.trim()); onClose(); }}
            >
              <Text style={[styles.btnText, { color: '#FFF' }]}>{t.save}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  card:     { width: '100%', maxWidth: 420, padding: 24, borderRadius: 22, borderWidth: 1 },
  title:    { fontSize: 20, fontWeight: '900', marginBottom: 16 },
  input:    { height: 54, borderRadius: 14, borderWidth: 1, paddingHorizontal: 16, fontSize: 16, marginBottom: 16 },
  row:      { flexDirection: 'row', gap: 10 },
  btn:      { flex: 1, height: 50, borderRadius: 14, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  btnText:  { fontSize: 15, fontWeight: '900' }
});