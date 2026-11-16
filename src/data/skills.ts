export type SkillCategory = {
  title: string;
  description: string;
  skills: string[];
};

export const skills: SkillCategory[] = [
  {
    title: 'Networking',
    description: 'Core infrastructure concepts and practical routing knowledge.',
    skills: ['MikroTik RouterOS', 'Routing', 'Switching', 'VLAN', 'OSPF', 'BGP', 'Network Troubleshooting'],
  },
  {
    title: 'Linux & Server Administration',
    description: 'Operating systems, services, and server fundamentals.',
    skills: ['Linux', 'Debian', 'Fedora', 'Nginx', 'MariaDB', 'PHP', 'System Administration'],
  },
  {
    title: 'Web Development',
    description: 'Frontend fundamentals and UI-focused learning.',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'TypeScript', 'Vite'],
  },
  {
    title: 'Tools & Technologies',
    description: 'Practical tooling and lab environments.',
    skills: ['Git', 'GitHub', 'Cloudflare', 'VirtualBox', 'PNETLab', 'Proxmox VE'],
  },
];
