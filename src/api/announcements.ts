import { Announcement } from '../types/announcement';

const API_URL = 'https://jsonplaceholder.typicode.com';
const ANNOUNCEMENTS_URL = API_URL + '/posts?_limit=10';

export async function getAnnouncements(): Promise<Announcement[]> {
  const response = await fetch(ANNOUNCEMENTS_URL);
  if (!response.ok) {
    throw new Error('HTTP ' + response.status);
  }
  return response.json();
}

export async function getAnnouncement(id: number): Promise<Announcement> {
  const response = await fetch(API_URL + '/posts/' + id);
  if (!response.ok) {
    throw new Error('HTTP ' + response.status);
  }
  return response.json();
}