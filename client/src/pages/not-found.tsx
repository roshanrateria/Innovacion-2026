import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Gamepad2, Home, ArrowLeft, Zap, Shield, Heart } from "lucide-react";
import SpaceShooterGame from "../components/SpaceShooterGame";

export default function NotFound() {
  const [showGame, setShowGame] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-pink-500/10 rounded-full blur-xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-40 right-1/3 w-56 h-56 bg-blue-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6 lg:p-8">
        <div className="text-center max-w-7xl mx-auto">
          {/* Enhanced 404 Header with better spacing */}
          <div className="mb-16 lg:mb-20">
            <div className="relative mb-12">
              <h1 className="text-9xl md:text-[10rem] lg:text-[14rem] xl:text-[16rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-6 animate-pulse drop-shadow-2xl leading-none">
                404
              </h1>
              <div className="absolute inset-0 text-9xl md:text-[10rem] lg:text-[14rem] xl:text-[16rem] font-bold text-purple-500/20 blur-3xl leading-none">
                404
              </div>
            </div>
            
            <div className="space-y-6 mb-12">
              <h2 className="text-3xl md:text-5xl lg:text-6xl text-white font-bold bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent leading-tight">
                🌌 Dimensional Coordinates Not Found 🌌
              </h2>
              <p className="text-xl md:text-2xl lg:text-3xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
                The interdimensional portal you're seeking has drifted into another reality. 
                But while you're here, <span className="text-yellow-400 font-bold animate-pulse">Earth needs your help!</span>
              </p>
            </div>
          </div>

          {/* Emergency Alert Section - Enhanced */}
          <div className="bg-gradient-to-r from-red-900/40 via-orange-900/40 to-red-900/40 backdrop-blur-sm border border-red-500/50 rounded-2xl p-6 md:p-8 mb-8 shadow-2xl shadow-red-500/20 animate-pulse">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
              <h2 className="text-xl md:text-3xl font-bold text-red-300">
                🚨 EMERGENCY: DIMENSIONAL BREACH DETECTED 🚨
              </h2>
              <div className="w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              <div className="text-left">
                <p className="text-gray-200 mb-4 text-base md:text-lg leading-relaxed">
                  Hostile entities are invading through interdimensional portals! Our defense systems are 
                  overwhelmed and need an experienced pilot. <span className="text-yellow-400 font-bold">Will you answer the call?</span>
                </p>
                
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-red-800/30 backdrop-blur-sm border border-red-500/30 rounded-lg p-3 text-center">
                    <Heart className="w-6 h-6 text-red-400 mx-auto mb-2" />
                    <div className="text-red-300 font-bold text-sm">Health</div>
                    <div className="text-gray-400 text-xs">Packs Ready</div>
                  </div>
                  <div className="bg-yellow-800/30 backdrop-blur-sm border border-yellow-500/30 rounded-lg p-3 text-center">
                    <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                    <div className="text-yellow-300 font-bold text-sm">Rapid Fire</div>
                    <div className="text-gray-400 text-xs">Systems Online</div>
                  </div>
                  <div className="bg-cyan-800/30 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-3 text-center">
                    <Shield className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                    <div className="text-cyan-300 font-bold text-sm">Energy</div>
                    <div className="text-gray-400 text-xs">Shields Ready</div>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30 mb-4">
                  <div className="text-4xl mb-3">🚀</div>
                  <h3 className="text-xl font-bold text-white mb-2">Innovacion Defense System</h3>
                   </div>
                
                <button
                  onClick={() => setShowGame(true)}
                  className="w-full bg-gradient-to-r from-red-600 via-orange-600 to-red-600 hover:from-red-700 hover:via-orange-700 hover:to-red-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-500/30 border border-red-400/50"
                >
                  <Gamepad2 className="w-6 h-6 inline mr-3" />
                  🚀 LAUNCH DEFENSE MISSION
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Options - Enhanced */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-black/20 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 group hover:bg-black/30 transition-all duration-300 shadow-lg hover:shadow-purple-500/20">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🏠</div>
              <h3 className="text-xl font-bold text-purple-300 mb-3">Return to Base Reality</h3>
              <p className="text-gray-400 mb-4 leading-relaxed">Navigate back to the main portal hub where all dimensions converge safely.</p>
              <Link href="/">
                <div className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-purple-500/25 cursor-pointer">
                  <Home className="w-5 h-5" />
                  Portal Hub
                </div>
              </Link>
            </div>

            <div className="bg-black/20 backdrop-blur-sm border border-gray-500/30 rounded-xl p-6 group hover:bg-black/30 transition-all duration-300 shadow-lg hover:shadow-gray-500/20">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">↩️</div>
              <h3 className="text-xl font-bold text-gray-300 mb-3">Previous Dimension</h3>
              <p className="text-gray-400 mb-4 leading-relaxed">Return to the reality you came from before this interdimensional mishap occurred.</p>
              <button 
                onClick={() => window.history.back()}
                className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 font-medium rounded-lg transition-colors shadow-lg hover:shadow-gray-500/25"
              >
                <ArrowLeft className="w-5 h-5" />
                Go Back
              </button>
            </div>
          </div>

          {/* Enhanced Footer Section */}
          <div className="text-center space-y-4">
            <div className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4">
              
              <div className="text-xs text-cyan-400 animate-pulse">
                ⭐ Share your high scores and tag <span className="font-bold">@Innovacion</span> for cosmic recognition!
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Game Modal */}
      {showGame && (
        <SpaceShooterGame onClose={() => setShowGame(false)} />
      )}

      {/* Secret keyboard activation */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('keydown', function(e) {
              if (e.key.toLowerCase() === 'g' && e.ctrlKey) {
                document.querySelector('[data-game-trigger]')?.click();
              }
            });
          `
        }}
      />
      
      {/* Hidden trigger for keyboard shortcut */}
      <button
        data-game-trigger
        onClick={() => setShowGame(true)}
        className="hidden"
        aria-hidden="true"
      />

      {/* Enhanced Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes glow {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
          
          @media (max-width: 768px) {
            .text-8xl { font-size: 4rem; }
            .text-9xl { font-size: 5rem; }
            .text-3xl { font-size: 1.875rem; }
            .text-2xl { font-size: 1.5rem; }
            .text-xl { font-size: 1.25rem; }
            .text-lg { font-size: 1rem; }
          }
          
          @media (max-width: 480px) {
            .text-8xl { font-size: 3rem !important; }
            .text-9xl { font-size: 3.5rem !important; }
            .text-3xl { font-size: 1.5rem !important; }
            .text-2xl { font-size: 1.25rem !important; }
            .text-xl { font-size: 1.125rem !important; }
          }
          
          /* Touch targets for mobile */
          @media (max-width: 768px) {
            button, .cursor-pointer {
              min-height: 44px;
              min-width: 44px;
            }
          }
          
          /* Prevent text selection on interactive elements */
          button, .cursor-pointer {
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            -webkit-tap-highlight-color: transparent;
          }
          
          /* Smooth animations */
          .transform {
            transition: transform 0.3s ease;
          }
          
          .transform:hover {
            transform: scale(1.05);
          }
          
          /* Gradient animations */
          @keyframes gradient-shift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          
          .bg-gradient-to-r {
            background-size: 200% 200%;
            animation: gradient-shift 3s ease infinite;
          }
        `
      }} />
    </div>
  );
}
