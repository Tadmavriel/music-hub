import React, { useState } from 'react';
import {
  KeyboardAvoidingView, Platform, Pressable,
  ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { useApp } from '../context/AppContext';

type EventType = 'Конференция' | 'Семинар' | 'Мастер-класс' | '';

type FormErrors = {
  fullName?: string;
  group?: string;
  eventType?: string;
  eventDate?: string;
  participants?: string;
  comment?: string;
  accepted?: string;
};

const eventTypes = ['Конференция', 'Семинар', 'Мастер-класс'] as const;

function isRealDate(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

export function EventRegistrationScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { theme, fontSizeMultiplier } = useApp();
  const fs = (size: number) => size * fontSizeMultiplier;

  const [fullName, setFullName] = useState('');
  const [group, setGroup] = useState('');
  const [eventType, setEventType] = useState<EventType>('');
  const [eventDate, setEventDate] = useState('');
  const [participants, setParticipants] = useState('1');
  const [comment, setComment] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState(false);

  const clearError = (field: keyof FormErrors) => {
    setErrors(current => ({ ...current, [field]: undefined }));
  };

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (fullName.trim().length < 3) next.fullName = 'Введите минимум 3 символа';
    if (!group.trim()) next.group = 'Введите название группы';
    if (!eventType) next.eventType = 'Выберите тип события';

    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!datePattern.test(eventDate)) {
      next.eventDate = 'Формат даты: ГГГГ-ММ-ДД';
    } else if (!isRealDate(eventDate)) {
      next.eventDate = 'Такой даты не существует';
    } else {
      const selected = new Date(eventDate + 'T00:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) next.eventDate = 'Нельзя выбрать прошедшую дату';
    }

    const count = Number(participants);
    if (!Number.isInteger(count) || count < 1 || count > 5) {
      next.participants = 'Введите целое число от 1 до 5';
    }
    if (comment.trim().length < 10) next.comment = 'Введите минимум 10 символов';
    if (!accepted) next.accepted = 'Необходимо согласие с правилами';

    return next;
  }

  function handleSubmit() {
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setSuccess(true);
  }

  function resetForm() {
    setFullName(''); setGroup(''); setEventType(''); setEventDate('');
    setParticipants('1'); setComment(''); setAccepted(false);
    setErrors({}); setSuccess(false);
  }

  const inputStyle = (hasError: boolean) => [
    styles.input,
    {
      backgroundColor: theme.surface,
      borderColor: hasError ? '#E5484D' : theme.border,
      color: theme.text,
      fontSize: fs(16),
    },
  ];

  const labelStyle = [styles.label, { color: theme.text, fontSize: fs(15) }];
  const errorStyle = [styles.error, { fontSize: fs(13) }];

  if (success) {
    return (
      <View style={[styles.successScreen, { backgroundColor: theme.background }]}>
        <View style={[styles.successCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <MaterialCommunityIcons name="check-circle" size={fs(80)} color={theme.primary} />
          <Text style={[styles.successTitle, { color: theme.text, fontSize: fs(24) }]}>
            Вы записаны!
          </Text>
          <Text style={[styles.successSub, { color: theme.mutedText, fontSize: fs(15) }]}>
            Ждём вас на событии «{eventType}»
          </Text>
          <Text style={[styles.successSub, { color: theme.mutedText, fontSize: fs(15) }]}>
            {eventDate} · {participants} {Number(participants) === 1 ? 'участник' : 'участников'}
          </Text>

          <Pressable
            onPress={() => navigation.goBack()}
            style={[styles.successBtn, { backgroundColor: theme.primary }]}
          >
            <MaterialCommunityIcons name="home" size={fs(20)} color="#FFF" />
            <Text style={[styles.successBtnText, { fontSize: fs(16) }]}>Готово</Text>
          </Pressable>

          <Pressable
            onPress={resetForm}
            style={[styles.successBtnSecondary, { borderColor: theme.primary }]}
          >
            <MaterialCommunityIcons name="refresh" size={fs(20)} color={theme.primary} />
            <Text style={[styles.successBtnSecondaryText, { color: theme.primary, fontSize: fs(15) }]}>
              Записаться ещё
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.screen} keyboardShouldPersistTaps="handled">
        <Pressable
          onPress={() => navigation.goBack()}
          style={[styles.backBtn, { borderColor: theme.border, backgroundColor: theme.surface }]}
        >
          <MaterialCommunityIcons name="arrow-left" size={fs(22)} color={theme.text} />
          <Text style={[styles.backText, { color: theme.text, fontSize: fs(15) }]}>Назад</Text>
        </Pressable>

        <Text style={[styles.title, { color: theme.text, fontSize: fs(26) }]}>
          Запись на мероприятие
        </Text>

        <Text style={labelStyle}>Имя и фамилия</Text>
        <TextInput
          style={inputStyle(!!errors.fullName)}
          value={fullName}
          onChangeText={(value) => { setFullName(value); clearError('fullName'); }}
          placeholder="Введите имя и фамилию"
          placeholderTextColor={theme.placeholder}
          maxLength={80}
        />
        {errors.fullName && <Text style={errorStyle}>{errors.fullName}</Text>}

        <Text style={labelStyle}>Группа</Text>
        <TextInput
          style={inputStyle(!!errors.group)}
          value={group}
          onChangeText={(value) => { setGroup(value); clearError('group'); }}
          placeholder="Например, ИС-24-2к"
          placeholderTextColor={theme.placeholder}
          maxLength={30}
        />
        {errors.group && <Text style={errorStyle}>{errors.group}</Text>}

        <Text style={labelStyle}>Тип события</Text>
        <View style={styles.options}>
          {eventTypes.map(item => {
            const active = eventType === item;
            return (
              <Pressable
                key={item}
                onPress={() => { setEventType(item); clearError('eventType'); }}
                style={[
                  styles.option,
                  { backgroundColor: theme.surfaceMuted, borderColor: theme.border },
                  active && { backgroundColor: theme.primary, borderColor: theme.primary },
                ]}
              >
                <Text style={{ color: active ? theme.white : theme.text, fontSize: fs(14), fontWeight: '700' }}>
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </View>
        {errors.eventType && <Text style={errorStyle}>{errors.eventType}</Text>}

        <Text style={labelStyle}>Дата события</Text>
        <TextInput
          style={inputStyle(!!errors.eventDate)}
          value={eventDate}
          onChangeText={(value) => { setEventDate(value); clearError('eventDate'); }}
          placeholder="ГГГГ-ММ-ДД, например 2026-12-15"
          placeholderTextColor={theme.placeholder}
          keyboardType="numbers-and-punctuation"
          maxLength={10}
        />
        {errors.eventDate && <Text style={errorStyle}>{errors.eventDate}</Text>}

        <Text style={labelStyle}>Количество участников</Text>
        <TextInput
          style={inputStyle(!!errors.participants)}
          value={participants}
          onChangeText={(value) => { setParticipants(value); clearError('participants'); }}
          placeholder="От 1 до 5"
          placeholderTextColor={theme.placeholder}
          keyboardType="numeric"
          maxLength={3}
        />
        {errors.participants && <Text style={errorStyle}>{errors.participants}</Text>}

        <Text style={labelStyle}>Комментарий</Text>
        <TextInput
          style={[inputStyle(!!errors.comment), styles.multiline]}
          value={comment}
          onChangeText={(value) => { setComment(value); clearError('comment'); }}
          placeholder="Расскажите о себе или о своих пожеланиях"
          placeholderTextColor={theme.placeholder}
          multiline
          maxLength={200}
        />
        <Text style={[styles.counter, { color: theme.mutedText, fontSize: fs(12) }]}>
          {comment.length}/200
        </Text>
        {errors.comment && <Text style={errorStyle}>{errors.comment}</Text>}

        <Pressable
          style={styles.checkRow}
          onPress={() => { setAccepted(!accepted); clearError('accepted'); }}
        >
          <MaterialCommunityIcons
            name={accepted ? 'checkbox-marked' : 'checkbox-blank-outline'}
            size={fs(26)}
            color={theme.primary}
          />
          <Text style={{ color: theme.text, fontSize: fs(15), flex: 1 }}>
            Я согласен с правилами мероприятия
          </Text>
        </Pressable>
        {errors.accepted && <Text style={errorStyle}>{errors.accepted}</Text>}

        <Pressable
          onPress={handleSubmit}
          style={[styles.button, { backgroundColor: theme.primary }]}
        >
          <Text style={[styles.buttonText, { fontSize: fs(16) }]}>Записаться</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen:     { padding: 20, paddingTop: 48, gap: 8 },
  backBtn:    { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1, marginBottom: 12 },
  backText:   { fontWeight: '700' },
  title:      { fontWeight: '900', marginBottom: 8 },
  label:      { fontWeight: '700', marginTop: 8 },
  input:      { borderWidth: 1, borderRadius: 12, padding: 14 },
  multiline:  { minHeight: 90, textAlignVertical: 'top' },
  counter:    { textAlign: 'right' },
  error:      { color: '#E5484D' },
  options:    { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  option:     { paddingVertical: 12, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1 },
  checkRow:   { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 },
  button:     { padding: 16, borderRadius: 16, alignItems: 'center', marginTop: 16, marginBottom: 24 },
  buttonText: { color: '#FFFFFF', fontWeight: '900' },
  successScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  successCard:   { width: '100%', maxWidth: 420, padding: 32, borderRadius: 24, borderWidth: 1, alignItems: 'center' },
  successTitle:  { fontWeight: '900', marginTop: 16, marginBottom: 8 },
  successSub:    { textAlign: 'center', marginBottom: 6 },
  successBtn:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 16, borderRadius: 16, width: '100%', marginTop: 24 },
  successBtnText:{ color: '#FFF', fontWeight: '900' },
  successBtnSecondary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 14, borderRadius: 16, borderWidth: 2, width: '100%', marginTop: 10 },
  successBtnSecondaryText: { fontWeight: '900' },
});