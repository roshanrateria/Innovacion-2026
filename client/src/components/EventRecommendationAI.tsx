import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { eventCategories, Event } from '@/data/Events';

interface Question {
  id: string;
  question: string;
  options: { value: string; label: string; icon: string }[];
}

interface UserResponses {
  [key: string]: string;
}

export default function EventRecommendationAI() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [responses, setResponses] = useState<UserResponses>({});
  const [recommendations, setRecommendations] = useState<Event[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showTooltipDismissed, setShowTooltipDismissed] = useState(false);

  const questions: Question[] = [
    {
      id: 'experience',
      question: 'What\'s your experience level with tech events?',
      options: [
        { value: 'beginner', label: 'Beginner - New to tech events', icon: 'fas fa-seedling' },
        { value: 'intermediate', label: 'Intermediate - Some experience', icon: 'fas fa-chart-line' },
        { value: 'advanced', label: 'Advanced - Experienced participant', icon: 'fas fa-rocket' },
      ]
    },
    {
      id: 'interest',
      question: 'Which field interests you the most?',
      options: [
        { value: 'coding', label: 'Coding & Programming', icon: 'fas fa-code' },
        { value: 'robotics', label: 'Robotics & Hardware', icon: 'fas fa-robot' },
        { value: 'gaming', label: 'Gaming & Esports', icon: 'fas fa-gamepad' },
        { value: 'business', label: 'Business & Management', icon: 'fas fa-chart-line' },
        { value: 'creative', label: 'Design & Creative', icon: 'fas fa-palette' },
        { value: 'science', label: 'Science & Research', icon: 'fas fa-flask' },
      ]
    },
    {
      id: 'format',
      question: 'What type of challenge do you prefer?',
      options: [
        { value: 'individual', label: 'Individual challenges', icon: 'fas fa-user' },
        { value: 'team', label: 'Team-based competitions', icon: 'fas fa-users' },
        { value: 'both', label: 'Both individual and team', icon: 'fas fa-handshake' },
      ]
    },
    {
      id: 'duration',
      question: 'How much time can you dedicate?',
      options: [
        { value: 'short', label: 'Few hours (Quiz, Gaming)', icon: 'fas fa-clock' },
        { value: 'medium', label: 'Half day to full day', icon: 'fas fa-calendar-day' },
        { value: 'long', label: 'Multiple days (Hackathons)', icon: 'fas fa-calendar-week' },
      ]
    },
    {
      id: 'goal',
      question: 'What\'s your primary goal?',
      options: [
        { value: 'learn', label: 'Learning and skill development', icon: 'fas fa-graduation-cap' },
        { value: 'compete', label: 'Winning prizes and recognition', icon: 'fas fa-trophy' },
        { value: 'network', label: 'Networking and connections', icon: 'fas fa-network-wired' },
        { value: 'fun', label: 'Having fun and experiences', icon: 'fas fa-smile' },
      ]
    }
  ];

  const generateRecommendations = () => {
    const allEvents = eventCategories.flatMap(category => 
      category.events.map(event => ({ ...event, category }))
    );
    
    let scored = allEvents.map(event => {
      let score = 0;
      
      // Experience level scoring
      if (responses.experience === 'beginner') {
        if (event.name.toLowerCase().includes('beginner') || 
            event.name.toLowerCase().includes('odyssey') ||
            event.category.id === 'quizzes') score += 3;
        if (event.category.id === 'gaming') score += 2;
      } else if (responses.experience === 'intermediate') {
        if (event.category.id === 'projects' || 
            event.category.id === 'management') score += 3;
        if (event.name.toLowerCase().includes('individual')) score += 2;
      } else if (responses.experience === 'advanced') {
        if (event.name.toLowerCase().includes('hack') ||
            event.name.toLowerCase().includes('hell') ||
            event.name.toLowerCase().includes('cyber')) score += 3;
        if (event.category.id === 'robotics') score += 2;
      }

      // Interest-based scoring
      if (responses.interest === 'coding' && event.category.id === 'hackathons') score += 4;
      if (responses.interest === 'robotics' && event.category.id === 'robotics') score += 4;
      if (responses.interest === 'gaming' && event.category.id === 'gaming') score += 4;
      if (responses.interest === 'business' && event.category.id === 'management') score += 4;
      if (responses.interest === 'creative' && 
          (event.name.toLowerCase().includes('design') || 
           event.name.toLowerCase().includes('aperture'))) score += 4;
      if (responses.interest === 'science' && event.category.id === 'projects') score += 4;

      // Format preference scoring
      if (responses.format === 'individual' && 
          (event.teamSize === 'Individual' || 
           event.teamSize?.toLowerCase().includes('individual'))) score += 3;
      if (responses.format === 'team' && 
          event.teamSize && 
          !event.teamSize.toLowerCase().includes('individual')) score += 3;

      // Duration scoring
      if (responses.duration === 'short' && 
          (event.category.id === 'quizzes' || event.category.id === 'gaming')) score += 3;
      if (responses.duration === 'medium' && 
          (event.category.id === 'robotics' || event.category.id === 'projects')) score += 3;
      if (responses.duration === 'long' && event.category.id === 'hackathons') score += 3;

      // Goal-based scoring
      if (responses.goal === 'learn' && 
          (event.name.toLowerCase().includes('beginner') || 
           event.category.id === 'projects')) score += 2;
      if (responses.goal === 'compete' && event.prizes && event.prizes.length > 0) {
        const topPrize = parseInt(event.prizes[0].replace(/[₹,]/g, ''));
        if (topPrize > 30000) score += 3;
        else if (topPrize > 15000) score += 2;
        else score += 1;
      }
      if (responses.goal === 'network' && event.category.id === 'management') score += 3;
      if (responses.goal === 'fun' && 
          (event.category.id === 'gaming' || 
           event.name.toLowerCase().includes('football'))) score += 3;

      return { ...event, score };
    });

    // Sort by score and get top 5
    scored.sort((a, b) => b.score - a.score);
    setRecommendations(scored.slice(0, 5));
    setShowResults(true);
  };

  const handleAnswer = (value: string) => {
    const newResponses = { ...responses, [questions[currentStep].id]: value };
    setResponses(newResponses);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      generateRecommendations();
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setResponses({});
    setRecommendations([]);
    setShowResults(false);
  };

  return (
    <>
      {/* AI Assistant Button with tooltip */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Tooltip */}
        <AnimatePresence>
          {!showTooltipDismissed && (
            <motion.div
              className="absolute bottom-20 right-0 bg-[var(--space-black)]/90 glassmorphism rounded-lg p-3 w-48 mb-2"
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={() => setShowTooltipDismissed(true)}
                className="absolute top-1 right-1 text-[var(--steel-gray)] hover:text-white w-5 h-5 flex items-center justify-center"
              >
                <i className="fas fa-times text-xs"></i>
              </button>
              <p className="text-sm text-white font-semibold mb-1">
                Confused which event to choose?
              </p>
              <p className="text-xs text-[var(--steel-gray)]">
                Try our AI assistant for personalized recommendations!
              </p>
              <div className="absolute bottom-0 right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[var(--space-black)]"></div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          className="w-16 h-16 bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-green)] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={{
            boxShadow: ['0 0 20px var(--neon-cyan)', '0 0 40px var(--neon-cyan)', '0 0 20px var(--neon-cyan)'],
          }}
          transition={{
            boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          {/* Animated circuit pattern background */}
          <div className="absolute inset-0 opacity-20">
            <svg width="64" height="64" viewBox="0 0 64 64">
              <motion.path
                d="M8 8 L24 8 L24 24 L40 24 L40 8 L56 8 M8 56 L24 56 L24 40 L40 40 L40 56 L56 56"
                stroke="white"
                strokeWidth="1"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </svg>
          </div>
          
          <motion.i 
            className="fas fa-brain text-2xl text-white relative z-10"
            animate={{ 
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
        </motion.button>
      </div>

      {/* AI Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="glassmorphism bg-[var(--space-black)]/90 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-green)] rounded-full flex items-center justify-center mr-4">
                    <i className="fas fa-robot text-white text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-orbitron font-bold text-2xl text-[var(--neon-cyan)]">
                      Event AI Assistant
                    </h3>
                    <p className="text-[var(--steel-gray)]">Find your perfect events</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-[var(--steel-gray)] hover:text-white transition-colors"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>

              {!showResults ? (
                <>
                  {/* Progress Bar */}
                  <div className="mb-8">
                    <div className="flex justify-between mb-2">
                      <span className="text-[var(--steel-gray)]">Progress</span>
                      <span className="text-[var(--neon-cyan)]">
                        {currentStep + 1}/{questions.length}
                      </span>
                    </div>
                    <div className="w-full bg-[var(--dark-navy)] rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-green)] h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>

                  {/* Question */}
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h4 className="font-orbitron font-bold text-xl mb-6 text-white">
                      {questions[currentStep].question}
                    </h4>

                    <div className="space-y-3">
                      {questions[currentStep].options.map((option, index) => (
                        <motion.button
                          key={option.value}
                          className="w-full p-4 text-left glassmorphism bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 group"
                          onClick={() => handleAnswer(option.value)}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-[var(--neon-blue)] to-[var(--deep-purple)] rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                              <i className={`${option.icon} text-white`}></i>
                            </div>
                            <span className="text-white group-hover:text-[var(--neon-cyan)] transition-colors">
                              {option.label}
                            </span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                </>
              ) : (
                /* Results */
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h4 className="font-orbitron font-bold text-2xl mb-6 text-[var(--neon-cyan)]">
                    Recommended Events for You
                  </h4>

                  <div className="space-y-4 mb-6">
                    {recommendations.map((event, index) => (
                      <motion.div
                        key={event.id}
                        className="glassmorphism bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all duration-300"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-bold text-lg" style={{ color: event.category.color }}>
                            {event.name}
                          </h5>
                          <div className="flex items-center text-[var(--neon-green)]">
                            <i className="fas fa-star mr-1"></i>
                            <span className="text-sm">Match: {Math.round((event.score / 15) * 100)}%</span>
                          </div>
                        </div>
                        
                        <p className="text-[var(--steel-gray)] mb-3">{event.shortDescription}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm">
                            {event.teamSize && (
                              <span className="text-[var(--steel-gray)]">
                                <i className="fas fa-users mr-1"></i>
                                {event.teamSize}
                              </span>
                            )}
                            {event.prizes && (
                              <span className="text-[var(--neon-green)]">
                                <i className="fas fa-trophy mr-1"></i>
                                {event.prizes[0]}
                              </span>
                            )}
                          </div>
                          
                          <button
                            className="px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300"
                            style={{
                              background: `linear-gradient(135deg, ${event.category.color}, ${event.category.secondaryColor})`
                            }}
                            onClick={() => {
                              window.location.href = `/events/${event.category.id}/${event.id}`;
                            }}
                          >
                            View Details
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={resetQuiz}
                      className="flex-1 py-3 rounded-lg border-2 border-[var(--neon-cyan)] text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)] hover:text-black transition-all duration-300"
                    >
                      Take Quiz Again
                    </button>
                    
                    <button
                      onClick={() => window.location.href = '/registration'}
                      className="flex-1 py-3 rounded-lg bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-green)] text-white font-semibold hover:shadow-lg transition-all duration-300"
                    >
                      Register Now
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}