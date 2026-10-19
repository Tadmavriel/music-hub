export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Main: undefined;
  Details: { serviceId: string; title: string };
  NewsDetails: { announcementId: number };
  Settings: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Services: undefined;
  News: undefined;
  Profile: undefined;
};