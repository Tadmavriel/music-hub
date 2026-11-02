import { Service } from '../types/service';

export const services: Service[] = [
  { id: 'schedule',  title: 'Расписание',  description: 'Пары и экзамены на неделю', icon: 'calendar-clock',   status: 'available' },
  { id: 'library',   title: 'Библиотека',  description: 'Книги и учебные материалы',  icon: 'book-open-variant', status: 'new' },
  { id: 'cafeteria', title: 'Столовая',    description: 'Меню и часы работы',         icon: 'silverware-fork-knife', status: 'available' },
  { id: 'transport', title: 'Транспорт',   description: 'Маршруты и расписание',      icon: 'bus',              status: 'available' },
  { id: 'grades',    title: 'Оценки',      description: 'Успеваемость и зачёты',      icon: 'chart-line',       status: 'new' },
  { id: 'dean',      title: 'Деканат',     description: 'Учебные вопросы',            icon: 'office-building',  status: 'available' },
  { id: 'medical',   title: 'Медпункт',    description: 'Медицинская помощь',         icon: 'hospital-box',     status: 'available' },
  { id: 'payments',  title: 'Оплата',      description: 'Стипендия и платежи',        icon: 'cash-multiple',    status: 'unavailable' },
];