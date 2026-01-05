export interface RegistrationType {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  secondaryColor: string;
  features: string[];
  price?: string;
  registrationLink?: string;
  benefits?: string[];
}

export const registrationTypes: RegistrationType[] = [
  {
    id: 'central',
    name: 'CENTRAL',
    description: 'Any 5 events access',
    icon: 'fas fa-star',
    color: 'var(--neon-blue)',
    secondaryColor: 'var(--deep-purple)',
    features: [
      'Access to any 5 events(Except Some)',
      'Certificate of participation',
      'Networking opportunities',
      'Workshop access (if applicable)'
    ],
    price: '₹449',
    benefits: [
      'Maximum flexibility in event selection',
      'Best value for money',
      'Priority registration',
      'Exclusive central registration perks'
    ],
    registrationLink: 'https://forms.gle/Ee37PVS6PAsNnqvu9'
  },
  {
    id: 'individual',
    name: 'INDIVIDUAL',
    description: 'Single event access',
    icon: 'fas fa-user',
    color: 'var(--neon-green)',
    secondaryColor: 'var(--neon-cyan)',
    features: [
      'Access to specific event',
      'Certificate of Participation',
      'Networking opportunities',
      'Event-specific workshops (if applicable)',
    ],
    price: '₹99 - 749',
    benefits: [
      'Cost-effective for single events',
      'Perfect for specialized participation',
      'No commitment to multiple events'
    ],
    registrationLink: 'https://forms.gle/Nh4Rsot3fkNUt1Ym9'
  },
  {
    id: 'gaming',
    name: 'GAMING',
    description: 'All gaming events access',
    icon: 'fas fa-gamepad',
    color: 'var(--deep-purple)',
    secondaryColor: 'var(--neon-blue)',
    features: [
      'Access to selected gaming events',
      'Special gaming zone access',
      'Gaming community networking',
    ],
    price: '₹79 - 899',
    benefits: [
      'Certificate of participation',
      'Gaming community networking',
      'Special gaming zone privileges'
    ],
    registrationLink: 'https://forms.gle/e4oWqeWARcANfZW67'
  },
  {
    id: 'school',
    name: 'SCHOOL',
    description: 'Special school rates',
    icon: 'fas fa-school',
    color: 'hsl(45, 100%, 60%)',
    secondaryColor: 'hsl(30, 100%, 50%)',
    features: [
      'Discounted rates',
      'Group registrations',
      'Educational workshops',
      'Mentorship programs',
      'School competition categories'
    ],
    price: 'FREE',
    benefits: [
      'Affordable for school students',
      'Educational focus',
      'Group participation encouraged',
      'Age-appropriate competitions'
    ]
  },
  {
    id: 'international',
    name: 'INTERNATIONAL',
    description: 'Global participants',
    icon: 'fas fa-globe',
    color: 'var(--neon-cyan)',
    secondaryColor: 'var(--neon-green)',
    features: [
      'Access to Selected events',
      'International networking',

    ],
    price: '$10',
    benefits: [
      'Certificate of participation',
      'Cultural immersion experience',
      'Global networking opportunities',
    ]
  }
];
