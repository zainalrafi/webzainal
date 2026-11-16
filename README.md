# Zainal Rafi Habibi Portfolio

A premium single-page portfolio built with React, TypeScript, Vite, and Framer Motion. The site follows a cinematic editorial visual language while remaining editable and ready for static hosting on Cloudflare Pages.

## Stack

- React
- Vite
- TypeScript
- Framer Motion
- Lucide React

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

## Cloudflare Pages deployment

This project is configured as a static Vite site. The build target is the `dist` folder.

Recommended deployment settings:

- Framework: Vite
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: project root

## Content editing

The portfolio content is centralized in the `src/data` folder.

### Edit profile information

- `src/data/profile.ts`

Update:

- name
- title
- education
- personal bio and interests
- email, GitHub, Instagram, LinkedIn placeholders
- footer note

### Add or replace projects

- `src/data/projects.ts`

Each project object includes:

- title
- category
- description
- status
- stack
- thumbnail label
- optional GitHub URL
- optional live demo URL
- longDescription

### Update skills

- `src/data/skills.ts`

Each category contains its title, description, and skill tag list.

### Update the single achievement

- `src/data/achievements.ts`

Replace placeholder text with your real event, year, and documentation link when available.

### Replace certificate entries

- `src/data/certificates.ts`

There are exactly two certificate entries. Update:

- title
- issuing organization
- issue date
- description
- image label
- verification URL

### Update education timeline

- `src/data/education.ts`

This file contains the three timeline entries. Keep unknown school names and dates as placeholders until they are confirmed.

### Assets and placeholders

- `public/favicon.svg` is a lightweight placeholder
- the portfolio uses CSS-based visual placeholders for project and certificate cards to avoid broken asset paths

To replace visual placeholders later, update the card styling in `src/App.tsx` and the corresponding data files.

## Notes

- The site avoids inventing personal credentials or fake achievements.
- Contact links remain placeholders until real values are provided.
- The navigation and content are intentionally editable in data files to make updates manageable.
