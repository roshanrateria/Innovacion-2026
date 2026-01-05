import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRoute } from 'wouter';
import { eventCategories, Event, EventCategory } from '@/data/Events';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import MatrixBackground from '@/components/MatrixBackground';
import DynamicBackground from '@/components/DynamicBackground';
import EnhancedParticleSystem from '@/components/EnhancedParticleSystem';
import CustomCursor from '@/components/CustomCursor';
import BackButton from '@/components/BackButton';
import EventRecommendationAI from '@/components/EventRecommendationAI';
import FloatingNavButton from '@/components/FloatingNavButton';

export default function EventDetails() {
  const [match, params] = useRoute('/events/:categoryId/:eventId?');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    if (params?.categoryId) {
      const category = eventCategories.find(cat => cat.id === params.categoryId);
      setSelectedCategory(category || null);

      if (params.eventId && category) {
        const event = category.events.find(evt => evt.id === params.eventId);
        setSelectedEvent(event || null);
      } else {
        setSelectedEvent(null);
      }
    }
  }, [params]);

  if (!selectedCategory) {
    return (
      <div className="min-h-screen bg-[var(--space-black)] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-orbitron font-bold text-3xl text-[var(--neon-cyan)] mb-4">
            Dimension Not Found
          </h1>
          <p className="text-[var(--steel-gray)]">The requested dimension does not exist in our multiverse.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--space-black)] text-white overflow-x-hidden custom-cursor">
      <CustomCursor />
      <MatrixBackground />
      <DynamicBackground />
      <EnhancedParticleSystem />
      <FloatingNavButton />



      <div className="pt-8">
        {selectedEvent ? (
          // Individual Event View
          <section className="py-20 relative">
            <div className="container mx-auto px-6">
              <motion.div
                className="max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <BackButton 
                  customText={`Back to ${selectedCategory.name}`}
                  customAction={() => window.location.href = `/events/${selectedCategory.id}`}
                />

                {/* Event Header */}
                <div className="text-center mb-12">
                  <motion.div
                    className="w-24 h-24 rounded-xl flex items-center justify-center mx-auto mb-6"
                    style={{
                      background: `linear-gradient(135deg, ${selectedCategory.color}, ${selectedCategory.secondaryColor})`
                    }}
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <i className={`${selectedCategory.icon} text-4xl text-white`}></i>
                  </motion.div>

                  <h1 className="font-orbitron font-bold text-4xl md:text-6xl mb-4" style={{ color: selectedCategory.color }}>
                    {selectedEvent.name}
                  </h1>
                  <p className="text-xl text-[var(--steel-gray)] mb-6">{selectedEvent.shortDescription}</p>
                </div>

                {/* Event Details Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                  {/* Main Description */}
                  <div className="lg:col-span-2">
                    <motion.div
                      className="glassmorphism bg-white/5 rounded-2xl p-8 mb-8"
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    >
                      <h3 className="font-orbitron font-bold text-2xl mb-4 text-[var(--neon-cyan)]">
                        Event Description
                      </h3>
                      <p className="text-[var(--steel-gray)] leading-relaxed text-lg">
                        {selectedEvent.description}
                      </p>
                    </motion.div>

                    {/* Rules Section */}
                    {selectedEvent.rules && (
                      <motion.div
                        className="glassmorphism bg-white/5 rounded-2xl p-8"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                      >
                        <h3 className="font-orbitron font-bold text-2xl mb-4 text-[var(--neon-cyan)]">
                          Rules & Guidelines
                        </h3>
                        <p className="text-[var(--steel-gray)] leading-relaxed">
                          {selectedEvent.rules}
                        </p>
                      </motion.div>
                    )}
                  </div>

                  {/* Event Info Sidebar */}
                  <div className="space-y-6">
                    {/* Quick Info */}
                    <motion.div
                      className="glassmorphism bg-white/5 rounded-2xl p-6"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    >
                      <h4 className="font-orbitron font-bold text-lg mb-4 text-[var(--neon-cyan)]">
                        Event Info
                      </h4>
                      <div className="space-y-4">
                        {selectedEvent.teamSize && (
                          <div className="flex items-center">
                            <i className="fas fa-users text-[var(--neon-green)] mr-3"></i>
                            <div>
                              <div className="text-sm text-[var(--steel-gray)]">Team Size</div>
                              <div className="font-semibold">{selectedEvent.teamSize}</div>
                            </div>
                          </div>
                        )}
                        {selectedEvent.venue && (
                          <div className="flex items-center">
                            <i className="fas fa-map-marker-alt text-[var(--neon-blue)] mr-3"></i>
                            <div>
                              <div className="text-sm text-[var(--steel-gray)]">Venue</div>
                              <div className="font-semibold">{selectedEvent.venue}</div>
                            </div>
                          </div>
                        )}
                        {selectedEvent.date && (
                          <div className="flex items-center">
                            <i className="fas fa-calendar text-[var(--deep-purple)] mr-3"></i>
                            <div>
                              <div className="text-sm text-[var(--steel-gray)]">Date</div>
                              <div className="font-semibold">{selectedEvent.date}</div>
                            </div>
                          </div>
                        )}
                        {selectedEvent.time && (
                          <div className="flex items-center">
                            <i className="fas fa-clock text-[var(--neon-cyan)] mr-3"></i>
                            <div>
                              <div className="text-sm text-[var(--steel-gray)]">Time</div>
                              <div className="font-semibold">{selectedEvent.time}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>

                    {/* Prizes */}
                    {selectedEvent.prizes && (
                      <motion.div
                        className="glassmorphism bg-white/5 rounded-2xl p-6"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                      >
                        <h4 className="font-orbitron font-bold text-lg mb-4 text-[var(--neon-cyan)]">
                          Prize Pool
                        </h4>
                        <div className="space-y-3">
                          {selectedEvent.prizes.map((prize, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <span className="text-[var(--steel-gray)]">
                                {index === 0 ? '1st Prize' : index === 1 ? '2nd Prize' : '3rd Prize'}
                              </span>
                              <span className="font-bold text-lg" style={{ color: selectedCategory.color }}>
                                {prize}
                              </span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Contact */}
                    {selectedEvent.contact && (
                      <motion.div
                        className="glassmorphism bg-gradient-to-br from-[var(--neon-cyan)/30] to-[var(--space-black)/80] rounded-2xl p-6 shadow-xl border border-[var(--neon-cyan)/40] relative overflow-hidden"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                      >
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-[var(--neon-cyan)/10] rounded-full blur-2xl z-0"></div>
                        <div className="relative z-10">
                          <h4 className="font-orbitron font-bold text-lg mb-4 text-[var(--neon-cyan)] flex items-center gap-2">
                            <i className="fas fa-user-astronaut text-2xl text-[var(--neon-cyan)]"></i>
                            Point of Contact
                          </h4>
                          <div className="space-y-2">
                            <div className="font-semibold text-xl text-white flex items-center gap-2">
                              <i className="fas fa-user-circle text-[var(--neon-cyan)]"></i>
                              {selectedEvent.contact.name}
                            </div>
                            <div className="flex items-center text-[var(--steel-gray)] text-base gap-2">
                              <i className="fas fa-phone text-[var(--neon-green)]"></i>
                              <a href={`tel:${selectedEvent.contact.phone}`} className="hover:underline hover:text-[var(--neon-green)] transition-colors">{selectedEvent.contact.phone}</a>
                            </div>
                            {selectedEvent.contact.email && (
                              <div className="flex items-center text-[var(--steel-gray)] text-base gap-2">
                                <i className="fas fa-envelope text-[var(--neon-blue)]"></i>
                                <a href={`mailto:${selectedEvent.contact.email}`} className="hover:underline hover:text-[var(--neon-blue)] transition-colors">{selectedEvent.contact.email}</a>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-4">
                      <motion.button
                        className="w-full py-3 rounded-lg font-semibold transition-all duration-300"
                        style={{
                          background: `linear-gradient(135deg, ${selectedCategory.color}, ${selectedCategory.secondaryColor})`
                        }}
                        whileHover={{ 
                          boxShadow: `0 8px 25px ${selectedCategory.color}50`,
                          y: -2,
                        }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => window.location.href = '/registration'}
                      >
                        <i className="fas fa-rocket mr-2"></i>
                        Register Now
                      </motion.button>

                      {selectedEvent.ruleBookLink && (
                        <motion.a
                          href={selectedEvent.ruleBookLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full py-3 text-center rounded-lg font-semibold border-2 transition-all duration-300"
                          style={{ borderColor: selectedCategory.color }}
                          whileHover={{ 
                            backgroundColor: selectedCategory.color,
                            color: 'black',
                          }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <i className="fas fa-book mr-2"></i>
                          Download Rules
                        </motion.a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        ) : (
          // Category Events List
          <section className="py-20 relative">
            <div className="container mx-auto px-6">
              <BackButton />

              <motion.div
                className="text-center mb-16"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <motion.div
                  className="w-24 h-24 rounded-xl flex items-center justify-center mx-auto mb-6"
                  style={{
                    background: `linear-gradient(135deg, ${selectedCategory.color}, ${selectedCategory.secondaryColor})`
                  }}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <i className={`${selectedCategory.icon} text-4xl text-white`}></i>
                </motion.div>

                <h1 className="font-orbitron font-bold text-5xl md:text-7xl mb-4" style={{ color: selectedCategory.color }}>
                  {selectedCategory.name}
                </h1>
                <p className="text-xl text-[var(--steel-gray)]">{selectedCategory.description}</p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {selectedCategory.events.map((event, index) => (
                  <motion.div
                    key={event.id}
                    className="glassmorphism bg-white/5 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: `0 20px 50px ${selectedCategory.color}30`,
                    }}
                    onClick={() => window.location.href = `/events/${selectedCategory.id}/${event.id}`}
                  >
                    <h3 className="font-orbitron font-bold text-2xl mb-4" style={{ color: selectedCategory.color }}>
                      {event.name}
                    </h3>
                    <p className="text-[var(--steel-gray)] mb-6">{event.shortDescription}</p>

                    <div className="space-y-2 mb-6">
                      {event.teamSize && (
                        <div className="flex items-center text-sm text-[var(--steel-gray)]">
                          <i className="fas fa-users text-[var(--neon-cyan)] mr-2"></i>
                          <span>{event.teamSize}</span>
                        </div>
                      )}
                      {event.prizes && (
                        <div className="flex items-center text-sm text-[var(--steel-gray)]">
                          <i className="fas fa-trophy text-[var(--neon-green)] mr-2"></i>
                          <span>Prize Pool: {event.prizes[0]}</span>
                        </div>
                      )}
                    </div>

                    <motion.button
                      className="w-full py-3 rounded-lg font-semibold transition-all duration-300"
                      style={{
                        background: `linear-gradient(135deg, ${selectedCategory.color}, ${selectedCategory.secondaryColor})`
                      }}
                      whileHover={{ 
                        boxShadow: `0 8px 25px ${selectedCategory.color}50`,
                        y: -2,
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/events/${selectedCategory.id}/${event.id}`;
                      }}
                    >
                      View Details
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      <Footer />

      {/* AI Assistant */}
      <EventRecommendationAI />
    </div>
  );
}