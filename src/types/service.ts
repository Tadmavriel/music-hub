export type Service = {
  id: string;
  title: string;
  description: string;
  icon: string;
  status: 'new' | 'available' | 'unavailable';
};
