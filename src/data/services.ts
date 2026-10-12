import { Service } from '../types/service';

export const services: Service[] = [
  { id: 'tracks',     title: 'Треки',       description: 'Все песни в одном списке',     icon: 'music-note',         status: 'available' },
  { id: 'playlists',  title: 'Плейлисты',   description: 'Твои музыкальные подборки',    icon: 'playlist-music',     status: 'new' },
  { id: 'artists',    title: 'Исполнители', description: 'Любимые артисты',              icon: 'account-music',      status: 'available' },
  { id: 'albums',     title: 'Альбомы',     description: 'Новые релизы и сборники',      icon: 'album',              status: 'available' },
  { id: 'genres',     title: 'Жанры',       description: 'Рок, поп, хип-хоп и другое',   icon: 'guitar-electric',    status: 'new' },
  { id: 'favorites',  title: 'Избранное',   description: 'Треки, которые ты лайкнул',    icon: 'heart',              status: 'available' },
  { id: 'history',    title: 'История',     description: 'Недавно прослушанное',         icon: 'history',            status: 'available' },
  { id: 'settings',   title: 'Настройки',   description: 'Эквалайзер и качество звука',  icon: 'cog',                status: 'unavailable' },
];
