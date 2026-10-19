import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Language = 'ru' | 'en' | 'kk';
export type ThemeName = 'light' | 'dark';
export type FontScale = 'small' | 'normal' | 'large';
export type Account = { login: string; password: string };
export type Track = { id: string; name: string; uri: string; size?: number };
export type Profile = { displayName: string; avatar: string | null; bio: string };

const ACCOUNT_KEY = '@music/account';
const SESSION_KEY = '@music/session';
const TRACKS_KEY = '@music/tracks';
const PROFILE_KEY = '@music/profile';
const SETTINGS_KEY = '@music/settings';

export type Theme = {
  background: string; surface: string; surfaceMuted: string; border: string;
  primary: string; primaryPressed: string; accent: string;
  text: string; mutedText: string; placeholder: string; white: string;
};

export const themes: Record<ThemeName, Theme> = {
  dark: {
    background: '#1A0511', surface: '#2D0718', surfaceMuted: '#3D0A1F',
    border: '#5A1030', primary: '#FF2D6F', primaryPressed: '#E01E5A',
    accent: '#FFD700', text: '#FFF5F8', mutedText: '#E8B5C6',
    placeholder: '#B85A7A', white: '#FFFFFF'
  },
  light: {
    background: '#FFF5F8', surface: '#FFFFFF', surfaceMuted: '#FFEBF2',
    border: '#FFB8D0', primary: '#FF2D6F', primaryPressed: '#E01E5A',
    accent: '#FF006E', text: '#1A0511', mutedText: '#8B4560',
    placeholder: '#C88AA0', white: '#FFFFFF'
  }
};

export const fontSizes: Record<FontScale, number> = {
  small: 0.85,
  normal: 1,
  large: 1.25,
};

export const translations = {
  ru: {
    appName: 'MUSIC HUB',
    welcome: 'С возвращением!',
    loginSubtitle: 'Войди, чтобы слушать музыку',
    login: 'Логин', password: 'Пароль',
    loginPlaceholder: 'Введите логин', passwordPlaceholder: 'Введите пароль',
    loginButton: 'Войти',
    fillLogin: 'Введите логин', fillPassword: 'Введите пароль',
    minPassword: 'Пароль минимум 6 символов',
    noAccount: 'Аккаунт не найден. Зарегистрируйтесь.',
    badCreds: 'Неверный логин или пароль',
    registerTitle: 'Создать аккаунт',
    registerSubtitle: 'Придумай логин и пароль',
    registerButton: 'Зарегистрироваться',
    backToLogin: 'Уже есть аккаунт? Войти',
    repeatPassword: 'Повторите пароль',
    repeatPasswordPlaceholder: 'Ещё раз пароль',
    allFields: 'Заполните все поля',
    passwordsMismatch: 'Пароли не совпадают',
    home: 'Главная', services: 'Сервисы', settings: 'Настройки', profile: 'Профиль',
    greeting: 'Сейчас играет',
    quickAccess: 'Быстрый доступ',
    allTracks: 'Все треки', allTracksSub: 'Полный список',
    playlists: 'Плейлисты', playlistsSub: 'Твои подборки',
    favorites: 'Избранное', favoritesSub: 'Что лайкнул',
    servicesTitle: 'Сервисы', servicesSub: 'Всё для музыки',
    profileTitle: 'Профиль',
    tracks: 'Треков', playlistsCount: 'Плейлистов', favoritesCount: 'Избранных',
    settingsTitle: 'Настройки',
    appearance: 'Внешний вид',
    theme: 'Тема', themeLight: 'Светлая', themeDark: 'Тёмная',
    fontScale: 'Размер шрифта',
    fontSmall: 'Маленький', fontNormal: 'Обычный', fontLarge: 'Большой',
    resetSettings: 'Сбросить настройки',
    resetConfirm: 'Сбросить все настройки?',
    language: 'Язык', langRu: 'Русский', langEn: 'English', langKk: 'Қазақша',
    logout: 'Выйти', back: 'Назад',
    uploadTrack: 'Загрузить трек',
    myTracks: 'Мои треки',
    noTracks: 'Пока нет загруженных треков',
    remove: 'Удалить',
    changeName: 'Изменить имя',
    changePhoto: 'Изменить фото',
    changeBio: 'Изменить описание',
    save: 'Сохранить', cancel: 'Отмена',
    newName: 'Новое имя', newBio: 'Коротко о себе',
    renameTrack: 'Переименовать',
    newTrackName: 'Новое название трека',
    trackName: 'Название трека',
    confirmDelete: 'Удалить?',
    yes: 'Да', no: 'Нет'
  },
  en: {
    appName: 'MUSIC HUB',
    welcome: 'Welcome back!',
    loginSubtitle: 'Sign in to listen',
    login: 'Login', password: 'Password',
    loginPlaceholder: 'Enter login', passwordPlaceholder: 'Enter password',
    loginButton: 'Sign in',
    fillLogin: 'Enter login', fillPassword: 'Enter password',
    minPassword: 'Password needs 6+ chars',
    noAccount: 'No account. Please register.',
    badCreds: 'Wrong login or password',
    registerTitle: 'Create account',
    registerSubtitle: 'Pick a login and password',
    registerButton: 'Register',
    backToLogin: 'Have an account? Sign in',
    repeatPassword: 'Repeat password',
    repeatPasswordPlaceholder: 'Repeat password',
    allFields: 'Fill in all fields',
    passwordsMismatch: 'Passwords do not match',
    home: 'Home', services: 'Services', settings: 'Settings', profile: 'Profile',
    greeting: 'Now playing',
    quickAccess: 'Quick access',
    allTracks: 'All tracks', allTracksSub: 'Full list',
    playlists: 'Playlists', playlistsSub: 'Your collections',
    favorites: 'Favorites', favoritesSub: 'What you liked',
    servicesTitle: 'Services', servicesSub: 'Everything for music',
    profileTitle: 'Profile',
    tracks: 'Tracks', playlistsCount: 'Playlists', favoritesCount: 'Favorites',
    settingsTitle: 'Settings',
    appearance: 'Appearance',
    theme: 'Theme', themeLight: 'Light', themeDark: 'Dark',
    fontScale: 'Font size',
    fontSmall: 'Small', fontNormal: 'Normal', fontLarge: 'Large',
    resetSettings: 'Reset settings',
    resetConfirm: 'Reset all settings?',
    language: 'Language', langRu: 'Русский', langEn: 'English', langKk: 'Қазақша',
    logout: 'Sign out', back: 'Back',
    uploadTrack: 'Upload track',
    myTracks: 'My tracks',
    noTracks: 'No tracks yet',
    remove: 'Remove',
    changeName: 'Change name',
    changePhoto: 'Change photo',
    changeBio: 'Change bio',
    save: 'Save', cancel: 'Cancel',
    newName: 'New name', newBio: 'Short bio',
    renameTrack: 'Rename',
    newTrackName: 'New track name',
    trackName: 'Track name',
    confirmDelete: 'Delete?',
    yes: 'Yes', no: 'No'
  },
  kk: {
    appName: 'MUSIC HUB',
    welcome: 'Қайта келуіңізбен!',
    loginSubtitle: 'Музыка тыңдау үшін кіріңіз',
    login: 'Логин', password: 'Құпиясөз',
    loginPlaceholder: 'Логинді енгізіңіз', passwordPlaceholder: 'Құпиясөзді енгізіңіз',
    loginButton: 'Кіру',
    fillLogin: 'Логинді енгізіңіз', fillPassword: 'Құпиясөзді енгізіңіз',
    minPassword: 'Кемінде 6 таңба',
    noAccount: 'Аккаунт жоқ. Тіркеліңіз.',
    badCreds: 'Логин немесе құпиясөз қате',
    registerTitle: 'Аккаунт жасау',
    registerSubtitle: 'Логин мен құпиясөз ойлап табыңыз',
    registerButton: 'Тіркелу',
    backToLogin: 'Аккаунтыңыз бар ма? Кіру',
    repeatPassword: 'Құпиясөзді қайталаңыз',
    repeatPasswordPlaceholder: 'Қайта енгізіңіз',
    allFields: 'Барлық өрісті толтырыңыз',
    passwordsMismatch: 'Құпиясөздер сәйкес емес',
    home: 'Басты', services: 'Қызметтер', settings: 'Параметрлер', profile: 'Профиль',
    greeting: 'Қазір ойнап жатыр',
    quickAccess: 'Жылдам қатынау',
    allTracks: 'Барлық тректер', allTracksSub: 'Толық тізім',
    playlists: 'Плейлисттер', playlistsSub: 'Топтамалар',
    favorites: 'Таңдаулылар', favoritesSub: 'Ұнаған тректер',
    servicesTitle: 'Қызметтер', servicesSub: 'Музыка үшін бәрі',
    profileTitle: 'Профиль',
    tracks: 'Тректер', playlistsCount: 'Плейлисттер', favoritesCount: 'Таңдаулылар',
    settingsTitle: 'Параметрлер',
    appearance: 'Сыртқы түрі',
    theme: 'Тақырып', themeLight: 'Ашық', themeDark: 'Қараңғы',
    fontScale: 'Қаріп өлшемі',
    fontSmall: 'Кіші', fontNormal: 'Қалыпты', fontLarge: 'Үлкен',
    resetSettings: 'Параметрлерді қалпына келтіру',
    resetConfirm: 'Барлық параметрлерді қалпына келтіру?',
    language: 'Тіл', langRu: 'Русский', langEn: 'English', langKk: 'Қазақша',
    logout: 'Шығу', back: 'Артқа',
    uploadTrack: 'Трек жүктеу',
    myTracks: 'Менің тректерім',
    noTracks: 'Әзірге тректер жоқ',
    remove: 'Жою',
    changeName: 'Атын өзгерту',
    changePhoto: 'Фотосуретті өзгерту',
    changeBio: 'Сипаттаманы өзгерту',
    save: 'Сақтау', cancel: 'Болдырмау',
    newName: 'Жаңа аты', newBio: 'Өзіңіз туралы қысқаша',
    renameTrack: 'Қайта атау',
    newTrackName: 'Трек атауы',
    trackName: 'Трек атауы',
    confirmDelete: 'Жою?',
    yes: 'Иә', no: 'Жоқ'
  }
};

type AppContextType = {
  language: Language;
  setLanguage: (l: Language) => void;
  themeName: ThemeName;
  setThemeName: (t: ThemeName) => void;
  fontScale: FontScale;
  setFontScale: (f: FontScale) => void;
  fontSizeMultiplier: number;
  resetSettings: () => void;
  theme: Theme;
  t: typeof translations.ru;
  nextLanguage: () => void;
  toggleTheme: () => void;
  user: string | null;
  profile: Profile;
  isReady: boolean;
  hasAccount: boolean;
  tracks: Track[];
  login: (login: string, password: string) => Promise<string | null>;
  register: (login: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
  addTrack: (track: Track) => Promise<void>;
  removeTrack: (id: string) => Promise<void>;
  renameTrack: (id: string, newName: string) => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
};

const AppContext = createContext<AppContextType | null>(null);

const DEFAULT_PROFILE: Profile = { displayName: '', avatar: null, bio: '' };

type Settings = { theme: ThemeName; fontScale: FontScale; language: Language };

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ru');
  const [themeName, setThemeName] = useState<ThemeName>('dark');
  const [fontScale, setFontScale] = useState<FontScale>('normal');
  const [user, setUser] = useState<string | null>(null);
  const [hasAccount, setHasAccount] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);

  useEffect(() => {
    (async () => {
      try {
        const [acc, sess, trk, prof, settings] = await AsyncStorage.multiGet([
          ACCOUNT_KEY, SESSION_KEY, TRACKS_KEY, PROFILE_KEY, SETTINGS_KEY
        ]);
        setHasAccount(!!acc[1]);
        if (sess[1]) setUser(sess[1]);
        if (trk[1]) setTracks(JSON.parse(trk[1]));
        if (prof[1]) setProfile(JSON.parse(prof[1]));
        else if (acc[1]) {
          const a: Account = JSON.parse(acc[1]);
          setProfile({ ...DEFAULT_PROFILE, displayName: a.login });
        }
        if (settings[1]) {
          const s: Settings = JSON.parse(settings[1]);
          if (s.theme) setThemeName(s.theme);
          if (s.fontScale) setFontScale(s.fontScale);
          if (s.language) setLanguage(s.language);
        }
      } catch {}
      finally { setIsReady(true); }
    })();
  }, []);

  useEffect(() => {
    if (!isReady) return;
    const settings: Settings = { theme: themeName, fontScale, language };
    AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [themeName, fontScale, language, isReady]);

  const login = async (loginStr: string, password: string) => {
    try {
      const raw = await AsyncStorage.getItem(ACCOUNT_KEY);
      if (!raw) return 'noAccount';
      const acc: Account = JSON.parse(raw);
      if (acc.login !== loginStr.trim() || acc.password !== password) return 'badCreds';
      await AsyncStorage.setItem(SESSION_KEY, acc.login);
      setUser(acc.login);
      return null;
    } catch { return 'error'; }
  };

  const register = async (loginStr: string, password: string) => {
    try {
      const acc: Account = { login: loginStr.trim(), password };
      await AsyncStorage.setItem(ACCOUNT_KEY, JSON.stringify(acc));
      await AsyncStorage.setItem(SESSION_KEY, acc.login);
      const p = { ...DEFAULT_PROFILE, displayName: acc.login };
      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(p));
      setProfile(p);
      setUser(acc.login);
      setHasAccount(true);
      return null;
    } catch { return 'error'; }
  };

  const logout = async () => {
    await AsyncStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  const addTrack = async (track: Track) => {
    const next = [track, ...tracks];
    setTracks(next);
    await AsyncStorage.setItem(TRACKS_KEY, JSON.stringify(next));
  };

  const removeTrack = async (id: string) => {
    const next = tracks.filter(t => t.id !== id);
    setTracks(next);
    await AsyncStorage.setItem(TRACKS_KEY, JSON.stringify(next));
  };

  const renameTrack = async (id: string, newName: string) => {
    const next = tracks.map(t => t.id === id ? { ...t, name: newName } : t);
    setTracks(next);
    await AsyncStorage.setItem(TRACKS_KEY, JSON.stringify(next));
  };

  const updateProfile = async (data: Partial<Profile>) => {
    const next = { ...profile, ...data };
    setProfile(next);
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(next));
  };

  const resetSettings = () => {
    setThemeName('dark');
    setFontScale('normal');
    setLanguage('ru');
  };

  const nextLanguage = () => setLanguage(l => l === 'ru' ? 'en' : l === 'en' ? 'kk' : 'ru');
  const toggleTheme = () => setThemeName(t => t === 'dark' ? 'light' : 'dark');

  return (
    <AppContext.Provider value={{
      language, setLanguage, themeName, setThemeName,
      fontScale, setFontScale,
      fontSizeMultiplier: fontSizes[fontScale],
      resetSettings,
      theme: themes[themeName], t: translations[language],
      nextLanguage, toggleTheme,
      user, profile, isReady, hasAccount, tracks,
      login, register, logout, addTrack, removeTrack, renameTrack, updateProfile
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}