import mtcnaImage from '../../picture/MTCNA.jpg'
import mtcreImage from '../../picture/MTCRE.jpg'

export type Certificate = {
  title: string;
  issuer: string;
  issueDate: string;
  description: string;
  image: string;
  verificationUrl?: string;
};

export const certificates: Certificate[] = [
  {
    title: 'MikroTik Certified Network Associate',
    issuer: 'MikroTik',
    issueDate: 'August 6, 2026',
    description: 'Certificate No. 2608NA2938. Valid for three years from the issue date.',
    image: mtcnaImage,
    verificationUrl: 'https://mikrotik.com/certificates',
  },
  {
    title: 'MikroTik Certified Routing Engineer',
    issuer: 'MikroTik',
    issueDate: 'October 23, 2026',
    description: 'Certificate No. 2610RE1208. Valid for three years from the issue date.',
    image: mtcreImage,
    verificationUrl: 'https://mikrotik.com/certificates',
  },
];
