export interface Event {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  rules?: string;
  contact?: {
    name: string;
    phone: string;
    email?: string;
  };
  ruleBookLink?: string;
  registrationLink?: string;
  prizes?: string[];
  teamSize?: string;
  venue?: string;
  date?: string;
  time?: string;
}

export interface EventCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  secondaryColor: string;
  backgroundImage: string;
  events: Event[];
}

export const eventCategories: EventCategory[] = [
  {
    id: 'robotics',
    name: 'ROBOTICS',
    description: 'Enter the mechanical multiverse where robots come alive',
    icon: 'fas fa-robot',
    color: 'var(--neon-blue)',
    secondaryColor: 'var(--deep-purple)',
    backgroundImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    events: [
      {
        id: 'tracker',
        name: 'Tracker',
        shortDescription: 'Line Following Race',
        description: 'Navigate through the digital maze with precision and speed. Design autonomous robots that can follow complex line patterns while avoiding obstacles.',
        teamSize: '2-4 members',
        prizes: ['To Be Declared Soon','To Be Declared Soon','To Be Declared Soon'],
        ruleBookLink: 'https://drive.google.com/file/d/1oDIdSonfTq4-OzUh-58w3d_K-SHOLB__/view?usp=drive_link',
        contact: {
          name: 'Aniket Sharma',
          phone: '+91 9876543210',
          email: 'aniket.sharma@email.com'
        }

      },
      {
        id: 'x-race',
        name: 'X-Race',
        shortDescription: 'Robo Car Challenge',
        description: 'High-speed robotic racing where engineering meets adrenaline. Build the fastest remote-controlled vehicle to dominate the multiverse speedway.',
        teamSize: '2-3 members',
        prizes: ['To Be Declared Soon','To Be Declared Soon','To Be Declared Soon'],
        ruleBookLink:'https://drive.google.com/file/d/1oIfXRC3RiyMTGWM-FrhezAvMbWOv84uG/view?usp=drive_link'
      },
      {
        id: 'robofooties',
        name: 'Robofooties',
        shortDescription: 'Robot Football',
        description: 'The beautiful game reimagined with mechanical players. Strategy, control, and precision come together in this ultimate robot soccer championship.',
        teamSize: '3-5 members',
        prizes: ['To Be Declared Soon','To Be Declared Soon','To Be Declared Soon'],
        ruleBookLink:'https://drive.google.com/file/d/1ouqd63dlUjfLcrPt_LvVj7mX4nYPtoNH/view?usp=drive_link'
      },
      {
        id: 'hell-in-cell',
        name: 'Hell in a Cell',
        shortDescription: 'Robot War',
        description: 'The ultimate battle arena where only the strongest survive. Design combat robots and engage in thrilling battles across multiple weight categories.',
        teamSize: '2-4 members',
        prizes: ['To Be Declared Soon','To Be Declared Soon','To Be Declared Soon'],
        ruleBookLink:'https://drive.google.com/file/d/1U37bF9OmcxbcN7_Ofe3lb-WLOlsj9NwD/view?usp=drive_link'
        
      },
    ],
  },
  {
    id: 'hackathons',
    name: 'HACKATHONS',
    description: 'Code your way through digital dimensions',
    icon: 'fas fa-code',
    color: 'var(--neon-green)',
    secondaryColor: 'var(--neon-cyan)',
    backgroundImage: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    events: [
      {
        id: '360codecraft',
        name: '360CodeCraft',
        shortDescription: 'Problem Solving Hackathon',
        description: 'Tackle real-world challenges through innovative coding solutions. From dynamic pricing optimization to smart city solutions, showcase your problem-solving prowess.',
        teamSize: '1-4 members',
       prizes: ['To Be Declared Soon','To Be Declared Soon','To Be Declared Soon'],
        ruleBookLink:'https://drive.google.com/file/d/10sVbfZSQ6PN81csCoL3ALIfADGzxhHgm/view?usp=drive_link'
      },
      {
        id: 'codesphere',
        name: 'Codesphere',
        shortDescription: 'Individual Coding Challenge',
        description: 'Pure algorithmic excellence in individual competition. Test your data structures and algorithms knowledge in this intense coding marathon.',
        teamSize: 'Individual',
        prizes: ['To Be Declared Soon','To Be Declared Soon','To Be Declared Soon'],
        ruleBookLink:'https://drive.google.com/file/d/1GoAn5Jf6shO6mrF3e5muBnQjav7WOcq2/view?usp=drive_link'
      },
      {
        id: 'codebreak-odyssey',
        name: 'Codebreak Odyssey',
        shortDescription: 'Beginner Friendly Hackathon',
        description: 'Perfect entry point for coding enthusiasts. Designed for beginners to showcase their creativity and learn from experienced mentors.',
        teamSize: '1-3 members',
        prizes: ['To Be Declared Soon','To Be Declared Soon','To Be Declared Soon'],
        ruleBookLink:'https://drive.google.com/file/d/1sODOMgFHADQviUduzUgV2c53x8wr6t_U/view?usp=drive_link'
      },
      {
        id: 'cyberthon',
        name: 'Cyberthon',
        shortDescription: 'CTF Event',
        description: 'Capture The Flag cybersecurity competition. Test your skills in cryptography, reverse engineering, web exploitation, and digital forensics.',
        teamSize: '1 members',
        prizes: ['To Be Declared Soon','To Be Declared Soon','To Be Declared Soon'],
        ruleBookLink:'https://drive.google.com/file/d/1YnpK8XvaNpGSVOjJW6A3UMfn8_hs_Jnh/view?usp=drive_link'
      },
      {
        id: 'pixel-pioneer',
        name: 'Pixel Pioneer',
        shortDescription: 'UI/UX Design',
        description: 'Design the future of digital experiences. Create stunning user interfaces and seamless user experiences for next-generation applications.',
        teamSize: '1-3 members',
        prizes: ['To Be Declared Soon','To Be Declared Soon','To Be Declared Soon'],
        ruleBookLink:'https://drive.google.com/file/d/1Dxqh2rGT4mEgktzBKAyghIA4OEdIWs0O/view?usp=drive_link'
      },
      {
        id: 'hack-ai',
        name: 'Hack-AI',
        shortDescription: 'AI Innovation Challenge',
        description: 'Harness the power of artificial intelligence to solve complex real-world problems. From machine learning to deep learning, showcase AI solutions.',
        teamSize: '1-4 members',
        prizes: ['To Be Declared Soon','To Be Declared Soon','To Be Declared Soon'],
        ruleBookLink:'https://drive.google.com/file/d/1au_wBq8MyeeCwlOV1xTmFrSbMYwK8PFm/view?usp=drive_link'
      },
    ],
  },
  {
    id: 'gaming',
    name: 'GAMING',
    description: 'Battle across virtual multiverses',
    icon: 'fas fa-gamepad',
    color: 'var(--deep-purple)',
    secondaryColor: 'var(--neon-blue)',
    backgroundImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    events: [
      {
        id: 'bgmi',
        name: 'BGMI',
        shortDescription: 'Battle Royale Championship',
        description: 'Survive, strategize, and dominate in the ultimate mobile battle royale experience. Team coordination and tactical gameplay are key to victory.',
        teamSize: '4 members (Squad)',
        prizes: ['To Be Declared Soon','To Be Declared Soon','To Be Declared Soon'],
        ruleBookLink:'https://drive.google.com/file/d/11KsoRefHDtj2TtDfhfxOpFzPdRHRqDPW/view?usp=drive_link'
      },
      {
        id: 'valorant',
        name: 'Valiants',
        shortDescription: 'Tactical FPS Tournament',
        description: 'Precision shooting meets strategic gameplay in this tactical first-person shooter. Master agents, perfect your aim, and outthink your opponents.',
        teamSize: '5 members',
        prizes: ['To Be Declared Soon','To Be Declared Soon','To Be Declared Soon'],
        ruleBookLink:'https://drive.google.com/file/d/1NhNfRWHhEWFM4OtZaC6rqWBTx9HgaZnh/view?usp=drive_link'
      },
      {
        id: 'fifa',
        name: 'FIFA',
        shortDescription: 'Football Simulation',
        description: 'The world\'s most popular football simulation game. Showcase your skills, tactics, and football knowledge in this virtual stadium.',
        teamSize: 'Individual',
        prizes: ['To Be Declared Soon','To Be Declared Soon','To Be Declared Soon'],
      },
    ],
  },
  {
    id: 'management',
    name: 'MANAGEMENT',
    description: 'Navigate the business multiverse',
    icon: 'fas fa-chart-line',
    color: 'var(--neon-cyan)',
    secondaryColor: 'var(--neon-green)',
    backgroundImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    events: [
      {
        id: 'eureka',
        name: 'Eureka',
        shortDescription: 'Business Pitching Event',
        description: 'Shark Tank style business pitching competition. Present your innovative startup ideas to industry experts and potential investors.',
        teamSize: '2-5 members',
       prizes: ['To Be Declared Soon','To Be Declared Soon','To Be Declared Soon'],
        ruleBookLink:'https://drive.google.com/file/d/1YKi6CkA5LbcSmyqUA6XgQZ7TI2mm4y3M/view?usp=drive_link'
      },
      {
        id: 'bull-master',
        name: 'The Bull Master',
        shortDescription: 'Stock Trading Competition',
        description: 'Virtual stock trading competition where market knowledge meets strategic thinking. Navigate market volatility and maximize your portfolio.',
        teamSize: 'Individual or Team of 2',
       prizes: ['To Be Declared Soon','To Be Declared Soon','To Be Declared Soon'],
        ruleBookLink:'https://drive.google.com/file/d/1qmp_T2e2X0wD1Ul2aE6L337r32UFn7Of/view?usp=drive_link'
      },
      {
        id: 'ad-mania',
        name: 'AD-Mania',
        shortDescription: 'Creative Advertising',
        description: 'Unleash your creativity in this advertising campaign competition. Create compelling marketing strategies and memorable brand campaigns.',
        teamSize: '2-4 members',
     prizes: ['To Be Declared Soon','To Be Declared Soon','To Be Declared Soon'],
        ruleBookLink:'https://drive.google.com/file/d/16B1IIPgcN42ZUtVMrnuSvS6EoVzpWrRg/view?usp=drive_link'
      },
    ],
  },
  {
    id: 'projects',
    name: 'PROJECTS',
    description: 'Showcase innovations across realities',
    icon: 'fas fa-lightbulb',
    color: 'hsl(45, 100%, 60%)',
    secondaryColor: 'hsl(30, 100%, 50%)',
    backgroundImage: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    events: [
      {
        id: 'innovare',
        name: 'Innovare and Science Model Exhibition',
        shortDescription: 'Project Demonstration',
        description: 'Showcase your innovative projects and scientific models. Demonstrate practical applications of theoretical knowledge and cutting-edge research.',
        teamSize: '1-5 members',
        prizes: ['To Be Declared Soon','To Be Declared Soon','To Be Declared Soon'],
        ruleBookLink:'https://drive.google.com/file/d/1UYIHGhzXez8eBnq_2LetFTWSZaDHhBRf/view?usp=drive_link'
      },
      {
        id: 'electroslides',
        name: 'ElectroSlides',
        shortDescription: 'Technical Poster Presentation',
        description: 'Present your research and technical findings through compelling poster presentations. Communicate complex ideas with clarity and visual appeal.',
        teamSize: '1-3 members',
        prizes: ['To Be Declared Soon','To Be Declared Soon','To Be Declared Soon'],
        ruleBookLink:'https://drive.google.com/file/d/1iD6QxFqd7hQzJM6nUxmmIAeenZS5tePB/view?usp=drive_link'
      },
      {
        id: 'aperture',
        name: 'Aperture',
        shortDescription: 'Photography Competition',
        description: 'Capture the essence of innovation through the lens. Technical photography meeting artistic vision in this comprehensive photography contest.',
        teamSize: 'Individual',
        prizes: ['To Be Declared Soon','To Be Declared Soon','To Be Declared Soon'],
        ruleBookLink:'https://drive.google.com/file/d/1Xn1Hlp8EUE2n2fMwjDoMkSLfmXs9ctfi/view?usp=drive_link'
      },
    ],
  },
  {
    id: 'quizzes',
    name: 'QUIZZES',
    description: 'Test knowledge across dimensions',
    icon: 'fas fa-brain',
    color: 'hsl(320, 100%, 60%)',
    secondaryColor: 'hsl(280, 100%, 60%)',
    backgroundImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    events: [
      {
        id: 'iiiso',
        name: 'IIISO',
        shortDescription: 'Technical Olympiad',
        description: 'Ultimate test of technical knowledge across multiple engineering and science domains. From physics to computer science, prove your academic excellence.',
        teamSize: 'Individual or Team of 2',
      prizes: ['To Be Declared Soon','To Be Declared Soon','To Be Declared Soon'],
        ruleBookLink:'https://drive.google.com/file/d/10eijY1znxvaSKqI7sXoB1a41PWwvpI8U/view?usp=drive_link'
      },
      {
        id: 'mathemagic',
        name: 'Mathemagic',
        shortDescription: 'Logical and Aptitude Test',
        description: 'Mathematical puzzles and logical reasoning challenges. Test your analytical thinking and problem-solving abilities in this mind-bending competition.',
        teamSize: 'Individual',
        prizes: ['To Be Declared Soon','To Be Declared Soon','To Be Declared Soon'],
        ruleBookLink:'https://drive.google.com/file/d/1HGzzm5sDkhWN3TiM-Oxnrrt7xwMZIO9Q/view?usp=drive_link'
      },
      {
        id: 'quizcrusade',
        name: 'Quizcrusade',
        shortDescription: 'Sci-Biz-Tech Quiz',
        description: 'Comprehensive quiz covering science, business, and technology. Stay updated with current affairs and showcase your knowledge across diverse fields.',
        teamSize: 'Team of 2-3',
        prizes: ['To Be Declared Soon','To Be Declared Soon','To Be Declared Soon'],
        ruleBookLink:'https://drive.google.com/file/d/1JC3kaLz4dVny7S7bhb_A9O1K2uNtGAfi/view?usp=drive_link'
      },
    ],
  },
];
