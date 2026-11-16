export type EducationEntry = {
  level: string;
  school: string;
  location: string;
  period: string;
  details: string;
  note: string;
};

export const education: EducationEntry[] = [
  {
    level: 'Elementary School',
    school: 'School name',
    location: 'Location',
    period: 'Year - Year',
    details: 'Add your elementary school information here. Keep this editable and accurate as your education timeline grows.',
    note: 'Edit me',
  },
  {
    level: 'Junior High School',
    school: 'School name',
    location: 'Location',
    period: 'Year - Year',
    details: 'Add your junior high school information here. This placeholder allows you to keep the timeline structured without inventing details.',
    note: 'Edit me',
  },
  {
    level: 'Vocational High School',
    school: 'SMKN 2 Depok',
    location: 'Sleman, Yogyakarta',
    period: 'Current',
    details: 'Major: SIJA · Class: XI SIJA B. This is the current education stage and the center of the portfolio narrative.',
    note: 'SIJA / XI SIJA B',
  },
];
