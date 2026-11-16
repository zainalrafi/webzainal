export type Certificate = {
  title: string;
  issuer: string;
  issueDate: string;
  description: string;
  imageLabel: string;
  verificationUrl?: string;
};

export const certificates: Certificate[] = [
  {
    title: 'Certificate Placeholder 01',
    issuer: 'Issuing organization',
    issueDate: 'Issue date',
    description: 'Add your certificate information here. This placeholder is ready to be replaced with your official certificate details.',
    imageLabel: 'Certificate 01',
    verificationUrl: '',
  },
  {
    title: 'Certificate Placeholder 02',
    issuer: 'Issuing organization',
    issueDate: 'Issue date',
    description: 'Add your second certificate information here. Keep the details clear and editable for quick updates.',
    imageLabel: 'Certificate 02',
    verificationUrl: '',
  },
];
