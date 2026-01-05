export interface ContactPerson {
  id: string;
  name: string;
  role: string;
  phone: string;
  email?: string;
  photo?: string;
  icon: string;
  color: string;
  secondaryColor: string;
  department?: string;
  responsibilities?: string[];
}

export const contactPersons: ContactPerson[] = [
  {
    id: 'coordinator',
    name: 'Event Coordinator',
    role: 'Primary Contact',
    phone: '+91 XXXXX XXXXX',
    email: 'coordinator@innovacion.com',
    icon: 'fas fa-user',
    color: 'var(--neon-blue)',
    secondaryColor: 'var(--deep-purple)',
    department: 'Event Management',
    responsibilities: [
      'Overall event coordination',
      'Registration queries',
      'General information',
      'Partnership inquiries'
    ]
  },
  {
    id: 'technical',
    name: 'Technical Support',
    role: 'Tech Queries',
    phone: '+91 XXXXX XXXXX',
    email: 'tech@innovacion.com',
    icon: 'fas fa-headset',
    color: 'var(--neon-green)',
    secondaryColor: 'var(--neon-cyan)',
    department: 'Technical Team',
    responsibilities: [
      'Technical event queries',
      'Platform support',
      'Hardware requirements',
      'Software assistance'
    ]
  },
  {
    id: 'registration',
    name: 'Registration Help',
    role: 'Registration Support',
    phone: '+91 XXXXX XXXXX',
    email: 'registration@innovacion.com',
    icon: 'fas fa-users',
    color: 'var(--deep-purple)',
    secondaryColor: 'hsl(320, 100%, 60%)',
    department: 'Registration Team',
    responsibilities: [
      'Registration assistance',
      'Payment queries',
      'Team formation help',
      'Document verification'
    ]
  },
  {
    id: 'hospitality',
    name: 'Hospitality Team',
    role: 'Accommodation & Travel',
    phone: '+91 XXXXX XXXXX',
    email: 'hospitality@innovacion.com',
    icon: 'fas fa-hotel',
    color: 'var(--neon-cyan)',
    secondaryColor: 'var(--neon-green)',
    department: 'Hospitality',
    responsibilities: [
      'Accommodation booking',
      'Travel assistance',
      'Local transportation',
      'Emergency support'
    ]
  },
  {
    id: 'sponsors',
    name: 'Sponsorship Team',
    role: 'Partnership & Sponsors',
    phone: '+91 XXXXX XXXXX',
    email: 'sponsors@innovacion.com',
    icon: 'fas fa-handshake',
    color: 'hsl(45, 100%, 60%)',
    secondaryColor: 'hsl(30, 100%, 50%)',
    department: 'Sponsorship',
    responsibilities: [
      'Sponsorship opportunities',
      'Partnership proposals',
      'Corporate relations',
      'Brand collaborations'
    ]
  },
  {
    id: 'media',
    name: 'Media Team',
    role: 'Media & Publicity',
    phone: '+91 XXXXX XXXXX',
    email: 'media@innovacion.com',
    icon: 'fas fa-camera',
    color: 'hsl(320, 100%, 60%)',
    secondaryColor: 'hsl(280, 100%, 60%)',
    department: 'Media & PR',
    responsibilities: [
      'Media coverage',
      'Press releases',
      'Social media management',
      'Photography requests'
    ]
  }
];
