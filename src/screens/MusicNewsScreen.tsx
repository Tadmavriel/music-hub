import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp, Language } from '../context/AppContext';

type CatKey = 'history' | 'tech' | 'health' | 'culture';
type Filter = 'all' | CatKey;

type Article = {
  id: string;
  cat: CatKey;
  minutes: number;
  icon: string;
  text: Record<Language, { title: string; summary: string; body: string[] }>;
};

const CAT_LABELS: Record<Language, Record<Filter, string>> = {
  ru: { all: 'Все', history: 'История', tech: 'Технологии', health: 'Здоровье', culture: 'Культура' },
  en: { all: 'All', history: 'History', tech: 'Tech', health: 'Health', culture: 'Culture' },
  kk: { all: 'Барлығы', history: 'Тарих', tech: 'Технология', health: 'Денсаулық', culture: 'Мәдениет' },
};

const TEXTS = {
  ru: { header: 'Музыкальный дайджест', sub: 'Интересное о музыке и звуке', min: 'мин' },
  en: { header: 'Music Digest', sub: 'Interesting facts about music and sound', min: 'min' },
  kk: { header: 'Музыка дайджесті', sub: 'Музыка мен дыбыс туралы қызықты деректер', min: 'мин' },
};

const ARTICLES: Article[] = [
  {
    id: 'vinyl',
    cat: 'history',
    minutes: 2,
    icon: 'album',
    text: {
      ru: {
        title: 'Как пластинка стала символом музыки',
        summary: 'От шеллака на 78 оборотов до долгоиграющих LP.',
        body: [
          'Первые массовые пластинки делали из шеллака и крутили со скоростью 78 оборотов в минуту. На одной стороне помещалось около трёх–пяти минут звука.',
          'В 1948 году компания Columbia представила долгоиграющую пластинку LP из винила: 12 дюймов, 33⅓ оборота в минуту и около 20 минут музыки на стороне. Год спустя RCA выпустила маленький сингл на 45 оборотов. Поэтому пластинка до сих пор ассоциируется с музыкой.',
        ],
      },
      en: {
        title: 'How the vinyl record became a symbol of music',
        summary: 'From 78 rpm shellac discs to long-playing LPs.',
        body: [
          'The first mass-produced records were made of shellac and spun at 78 revolutions per minute. One side held only about three to five minutes of sound.',
          'In 1948 Columbia introduced the vinyl long-playing LP: 12 inches, 33⅓ rpm and about 20 minutes of music per side. A year later RCA released the small 45 rpm single. That is why the record is still linked with music today.',
        ],
      },
      kk: {
        title: 'Пластинка музыканың символына қалай айналды',
        summary: '78 айналымдық шеллактан ұзақ ойнайтын LP-ге дейін.',
        body: [
          'Алғашқы жаппай шығарылған пластинкалар шеллактан жасалып, минутына 78 айналыммен ойнатылды. Бір жағына шамамен үш-бес минуттық дыбыс сыятын.',
          '1948 жылы Columbia компаниясы винилден жасалған ұзақ ойнайтын LP пластинкасын таныстырды: 12 дюйм, минутына 33⅓ айналым, бір жағында шамамен 20 минут музыка. Бір жылдан кейін RCA минутына 45 айналымдық шағын синглды шығарды. Сондықтан пластинка әлі күнге дейін музыкамен байланыстырылады.',
        ],
      },
    },
  },
  {
    id: 'formats',
    cat: 'tech',
    minutes: 3,
    icon: 'file-music',
    text: {
      ru: {
        title: 'MP3, FLAC и компакт-диск: в чём разница',
        summary: 'Почему один и тот же трек весит по-разному.',
        body: [
          'Компакт-диск хранит звук без сжатия: 44,1 кГц и 16 бит, это около 1411 килобит в секунду.',
          'MP3 убирает детали, которые человеческое ухо слышит хуже всего, поэтому файл в несколько раз меньше: обычно 128–320 кбит/с. FLAC сжимает звук без потерь: файл примерно вдвое меньше исходного, а качество такое же, как у диска.',
          'Для наушников и повседневного прослушивания MP3 на 256–320 кбит/с чаще всего достаточно, а FLAC выбирают для архива и хорошей аппаратуры.',
        ],
      },
      en: {
        title: 'MP3, FLAC and the compact disc: what is the difference',
        summary: 'Why the same track can have very different file sizes.',
        body: [
          'A compact disc stores sound uncompressed: 44.1 kHz and 16 bits, which is about 1411 kilobits per second.',
          'MP3 removes details the human ear notices least, so the file is several times smaller, usually 128 to 320 kbps. FLAC compresses audio without loss: the file is roughly half the original size while keeping disc quality.',
          'For headphones and everyday listening, MP3 at 256 to 320 kbps is usually enough, while FLAC is chosen for archives and good equipment.',
        ],
      },
      kk: {
        title: 'MP3, FLAC және компакт-диск: айырмасы неде',
        summary: 'Бір трек неге әртүрлі салмақта болады.',
        body: [
          'Компакт-диск дыбысты қысусыз сақтайды: 44,1 кГц және 16 бит, бұл секундына шамамен 1411 килобит.',
          'MP3 адам құлағы нашар estiytin бөлшектерді алып тастайды, сондықтан файл бірнеше есе кіші болады: әдетте 128–320 кбит/с. FLAC дыбысты шығынсыз қысады: файл бастапқысынан шамамен екі есе кіші, ал сапасы дискімен бірдей.',
          'Құлаққап пен күнделікті тыңдауға 256–320 кбит/с MP3 көбіне жеткілікті, ал FLAC-ты мұрағат пен жақсы жабдық үшін таңдайды.',
        ],
      },
    },
  },
  {
    id: 'streaming',
    cat: 'tech',
    minutes: 2,
    icon: 'cloud-download',
    text: {
      ru: {
        title: 'Как работает потоковая музыка',
        summary: 'Почему трек играет, пока ещё скачивается.',
        body: [
          'Сервис режет трек на небольшие фрагменты и присылает их по очереди. Телефон копит несколько секунд в буфере и начинает воспроизведение, не дожидаясь конца загрузки.',
          'Если интернет ослабевает, многие сервисы автоматически переключаются на более лёгкую версию трека, чтобы музыка не прерывалась. В приложении вроде Music Hub файлы лежат прямо на телефоне, поэтому такая загрузка не нужна и трек запускается сразу.',
        ],
      },
      en: {
        title: 'How music streaming works',
        summary: 'Why a track plays while it is still downloading.',
        body: [
          'The service cuts a track into small pieces and sends them one after another. The phone keeps a few seconds in a buffer and starts playing without waiting for the download to finish.',
          'When the connection weakens, many services automatically switch to a lighter version of the track so the music does not stop. In an app like Music Hub the files are stored on the phone itself, so no such download is needed and the track starts instantly.',
        ],
      },
      kk: {
        title: 'Ағынды музыка қалай жұмыс істейді',
        summary: 'Трек әлі жүктеліп жатқанда неге ойнайды.',
        body: [
          'Қызмет тректі шағын бөліктерге бөліп, кезекпен жібереді. Телефон бірнеше секундты буферге жинап, жүктеу аяқталуын күтпей ойнатуды бастайды.',
          'Интернет әлсірегенде, көптеген қызметтер музыка тоқтамас үшін автоматты түрде жеңілірек нұсқаға ауысады. Music Hub сияқты қолданбада файлдар телефонның өзінде сақталады, сондықтан мұндай жүктеу қажет емес және трек бірден басталады.',
        ],
      },
    },
  },
  {
    id: 'hearing',
    cat: 'health',
    minutes: 2,
    icon: 'headphones',
    text: {
      ru: {
        title: 'Как слушать музыку и не навредить слуху',
        summary: 'Простые правила для наушников.',
        body: [
          'Вред слуху зависит от громкости и времени. Чем громче звук, тем меньше безопасное время прослушивания. Около 85 децибел считается пределом для нескольких часов в день.',
          'Популярное правило «60 на 60»: громкость не выше 60% от максимальной и перерыв после часа прослушивания. Это ориентир, а не точная норма: у разных наушников разная громкость.',
          'Если после наушников звенит в ушах или звуки кажутся приглушёнными, сделайте паузу и снизьте громкость.',
        ],
      },
      en: {
        title: 'How to enjoy music without harming your hearing',
        summary: 'Simple rules for headphone users.',
        body: [
          'Hearing damage depends on loudness and time. The louder the sound, the shorter the safe listening time. Around 85 decibels is considered the limit for several hours a day.',
          'A popular rule of thumb is "60/60": volume no higher than 60% of maximum and a break after an hour. It is a guideline, not an exact norm, because different headphones have different loudness.',
          'If your ears ring or sounds seem muffled after listening, take a break and lower the volume.',
        ],
      },
      kk: {
        title: 'Музыканы есту қабілетіне зиян келтірмей қалай тыңдау керек',
        summary: 'Құлаққапты қолданушыларға арналған қарапайым ережелер.',
        body: [
          'Есту қабілетіне келетін зиян дыбыс қаттылығы мен уақытқа байланысты. Дыбыс қаттырақ болған сайын, қауіпсіз тыңдау уақыты қысқарады. Күніне бірнеше сағатқа шамамен 85 децибел шек болып саналады.',
          'Танымал «60-қа 60» ережесі: дыбыс ең жоғарғы деңгейдің 60%-ынан аспауы керек және бір сағаттан кейін үзіліс жасалады. Бұл нақты норма емес, бағдар: құлаққаптардың қаттылығы әртүрлі.',
          'Құлаққаптан кейін құлағыңыз шуылдаса немесе дыбыстар бәсең естілсе, үзіліс жасап, дыбысты азайтыңыз.',
        ],
      },
    },
  },
  {
    id: 'dombra',
    cat: 'culture',
    minutes: 2,
    icon: 'guitar-acoustic',
    text: {
      ru: {
        title: 'Домбра: две струны и целая культура',
        summary: 'Главный инструмент казахской музыки.',
        body: [
          'Домбра — казахский щипковый инструмент с двумя струнами и длинным грифом. На ней играют и соло, и аккомпанируя пению.',
          'С домброй тесно связан жанр кюя — инструментальной пьесы. Одним из самых известных кюйши считается Курмангазы Сагырбайулы (1818–1889), автор кюев «Сарыарка» и «Адай».',
        ],
      },
      en: {
        title: 'The dombra: two strings and a whole culture',
        summary: 'The main instrument of Kazakh music.',
        body: [
          'The dombra is a Kazakh plucked instrument with two strings and a long neck. It is played both solo and as accompaniment to singing.',
          'The dombra is closely tied to the kuy, an instrumental piece. One of the best-known kuy composers is Kurmangazy Sagyrbayuly (1818–1889), the author of "Saryarka" and "Adai".',
        ],
      },
      kk: {
        title: 'Домбыра: екі ішек және тұтас мәдениет',
        summary: 'Қазақ музыкасының басты аспабы.',
        body: [
          'Домбыра — екі ішекті, мойны ұзын қазақтың шертпелі аспабы. Оны жеке орындауда да, ән сүйемелдеуде де қолданады.',
          'Домбырамен күй жанры тығыз байланысты. Ең танымал күйшілердің бірі — Құрманғазы Сағырбайұлы (1818–1889), «Сарыарқа», «Адай» күйлерінің авторы.',
        ],
      },
    },
  },
  {
    id: 'playlist',
    cat: 'culture',
    minutes: 2,
    icon: 'playlist-music',
    text: {
      ru: {
        title: 'Как собрать хороший плейлист',
        summary: 'Три приёма, чтобы список не надоедал.',
        body: [
          'Начните с одного настроения или занятия: тренировка, дорога, учёба. Плейлист из слишком разных жанров быстро начинает раздражать.',
          'Чередуйте знакомые треки и новые, например два любимых на один незнакомый. Так список остаётся приятным, но не превращается в повтор.',
          'Самые энергичные композиции ставьте ближе к началу и следите за длиной: для дороги или учёбы обычно хватает 30–60 минут.',
        ],
      },
      en: {
        title: 'How to build a good playlist',
        summary: 'Three tricks to keep a list from getting old.',
        body: [
          'Start with one mood or activity: workout, commute, study. A playlist with wildly different genres quickly becomes annoying.',
          'Mix familiar tracks with new ones, for example two favorites for every unfamiliar one. The list stays pleasant without turning into a repeat.',
          'Put the most energetic songs near the start and watch the length: for a commute or studying, 30 to 60 minutes is usually enough.',
        ],
      },
      kk: {
        title: 'Жақсы плейлистті қалай құрастыруға болады',
        summary: 'Тізім жалықтырмауы үшін үш қарапайым тәсіл.',
        body: [
          'Бір көңіл-күйден немесе іс-әрекеттен бастаңыз: жаттығу, жол, оқу. Тым әртүрлі жанрлардан тұратын плейлист тез жалықтырады.',
          'Таныс тректерді жаңаларымен кезектестіріңіз, мысалы, бір беймәлім трекке екі сүйікті трек. Сонда тізім ұнамды болып қалады, бірақ қайталанбайды.',
          'Ең қарқынды әндерді басына таяу қойып, ұзақтығын қадағалаңыз: жол немесе оқу үшін әдетте 30–60 минут жеткілікті.',
        ],
      },
    },
  },
];

export function MusicNewsScreen() {
  const { theme, language, fontSizeMultiplier } = useApp();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<Filter>('all');
  const [openId, setOpenId] = useState<string | null>(null);

  const fs = (size: number) => size * fontSizeMultiplier;
  const tx = TEXTS[language];
  const labels = CAT_LABELS[language];
  const filters: Filter[] = ['all', 'history', 'tech', 'health', 'culture'];
  const visible = filter === 'all' ? ARTICLES : ARTICLES.filter(a => a.cat === filter);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.background, paddingTop: insets.top + 16 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: theme.text, fontSize: fs(26) }]}>{tx.header}</Text>
      <Text style={[styles.sub, { color: theme.mutedText, fontSize: fs(14) }]}>{tx.sub}</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
      >
        {filters.map(f => {
          const active = filter === f;
          return (
            <Pressable
              key={f}
              onPress={() => { setFilter(f); setOpenId(null); }}
              style={[
                styles.chip,
                {
                  backgroundColor: active ? theme.primary : theme.surface,
                  borderColor: active ? theme.primary : theme.border,
                },
              ]}
            >
              <Text style={[styles.chipText, { color: active ? '#FFF' : theme.text, fontSize: fs(13) }]}>
                {labels[f]}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {visible.map(a => {
        const content = a.text[language];
        const open = openId === a.id;
        return (
          <Pressable
            key={a.id}
            onPress={() => setOpenId(open ? null : a.id)}
            style={[
              styles.card,
              { backgroundColor: theme.surface, borderColor: open ? theme.primary : theme.border },
            ]}
          >
            <View style={styles.cardTop}>
              <View style={[styles.iconBox, { backgroundColor: theme.surfaceMuted }]}>
                <MaterialCommunityIcons name={a.icon as any} size={fs(24)} color={theme.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.meta, { color: theme.primary, fontSize: fs(11) }]}>
                  {labels[a.cat].toUpperCase()} · {a.minutes} {tx.min}
                </Text>
                <Text style={[styles.cardTitle, { color: theme.text, fontSize: fs(16) }]}>
                  {content.title}
                </Text>
              </View>
              <MaterialCommunityIcons
                name={open ? 'chevron-up' : 'chevron-down'}
                size={fs(24)}
                color={theme.mutedText}
              />
            </View>

            <Text style={[styles.summary, { color: theme.mutedText, fontSize: fs(14) }]}>
              {content.summary}
            </Text>

            {open && (
              <View style={[styles.body, { borderTopColor: theme.border }]}>
                {content.body.map((p, i) => (
                  <Text
                    key={i}
                    style={[styles.paragraph, { color: theme.text, fontSize: fs(14) }]}
                  >
                    {p}
                  </Text>
                ))}
              </View>
            )}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:  { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 32 },
  title:      { fontWeight: '800' },
  sub:        { marginTop: 4, marginBottom: 16 },
  chips:      { gap: 8, paddingBottom: 16 },
  chip:       { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  chipText:   { fontWeight: '700' },
  card:       { borderRadius: 18, borderWidth: 1, padding: 16, marginBottom: 12 },
  cardTop:    { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBox:    { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  meta:       { fontWeight: '800', letterSpacing: 0.8, marginBottom: 4 },
  cardTitle:  { fontWeight: '800' },
  summary:    { marginTop: 12, lineHeight: 20 },
  body:       { marginTop: 14, paddingTop: 14, borderTopWidth: 1, gap: 10 },
  paragraph:  { lineHeight: 22 },
});