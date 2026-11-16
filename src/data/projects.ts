export type Project = {
  id: string;
  title: string;
  category: string;
  description: string;
  status: string;
  stack: string[];
  accent: string;
  thumbnailLabel: string;
  githubUrl?: string;
  liveUrl?: string;
  longDescription: string;
};

export const projects: Project[] = [
  {
    id: 'network-ops-map',
    title: 'Network Operations Map',
    category: 'Networking',
    description:
      'A demo concept for documenting network infrastructure, topology layouts, and troubleshooting flows.',
    status: 'Editable demo data',
    stack: ['MikroTik', 'VLAN', 'Routing', 'Troubleshooting'],
    accent: 'network',
    thumbnailLabel: 'Topology / Core',
    githubUrl: '',
    liveUrl: '',
    longDescription:
      'This project template is designed for documenting a network operations dashboard, visualizing device relationships, and tracking infrastructure maintenance notes. It acts as a polished concept for future portfolio work.',
  },
  {
    id: 'linux-lab-host',
    title: 'Linux Lab Host',
    category: 'Linux & Infrastructure',
    description:
      'A demo project idea for exploring Linux hosting, system maintenance, and secure server orchestration workflows.',
    status: 'Editable demo data',
    stack: ['Linux', 'Debian', 'Nginx', 'MariaDB', 'System Admin'],
    accent: 'infrastructure',
    thumbnailLabel: 'Server Lab',
    githubUrl: '',
    liveUrl: '',
    longDescription:
      'This concept represents a self-hosted lab environment focused on Linux systems, web services, and infrastructure experimentation. It is a strong example of a future portfolio project that can be updated with real project details later.',
  },
  {
    id: 'interface-lab',
    title: 'Interface Lab',
    category: 'Web Development',
    description:
      'A demo portfolio concept for experimenting with UI patterns, responsive layouts, and frontend design systems.',
    status: 'Editable demo data',
    stack: ['HTML', 'CSS', 'JavaScript', 'React', 'Vite'],
    accent: 'web',
    thumbnailLabel: 'Frontend / UI',
    githubUrl: '',
    liveUrl: '',
    longDescription:
      'This frontend concept explores how visual polish, interaction design, and practical implementation combine into a more refined digital presence. It can evolve into a showcase of completed web interfaces or learning projects.',
  },
];
