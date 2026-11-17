import ojmImage from '../../picture/OJM2026.jpg'

export type Achievement = {
  title: string;
  event: string;
  year: string;
  description: string;
  image: string;
  documentUrl?: string;
};

export const achievement: Achievement = {
  title: 'National Finalist',
  event: 'Olimpiade Jaringan Mikrotik 2026',
  year: '2026',
  description:
    'Finalist in the national-level MikroTik networking olympiad among vocational high schools on October 2, 2026. Certificate No. OJM/2026/11610.',
  image: ojmImage,
  documentUrl: ojmImage,
};
