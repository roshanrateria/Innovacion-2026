import React, { useEffect, useRef, useState, useCallback } from 'react';
import { toast } from 'sonner';

// Core interfaces
interface Position {
  x: number;
  y: number;
}

interface GameObject extends Position {
  dx: number;
  dy: number;
}

interface Player extends Position {
  health: number;
  maxHealth: number;
  energy: number;
  maxEnergy: number;
  score: number;
  level: number;
  speed: number;
  shield: number;
  isInvincible: boolean;
  invincibilityEnd: number;
  thrusterEffect: number;
  lastShot: number;
}

interface Enemy extends Position {
  health: number;
  speed: number;
  type: string;
  lastShot: number;
  rotation: number;
}

interface Bullet extends GameObject {
  damage: number;
  owner: 'player' | 'enemy';
  color: string;
  trail: Array<{x: number, y: number, alpha: number}>;
  glowSize: number;
}

interface Particle extends GameObject {
  life: number;
  color: string;
  size: number;
  type: 'explosion' | 'thruster' | 'spark' | 'debris';
}

interface PowerUp extends Position {
  type: string;
  effect: {
    type: string;
    value: number;
  };
  icon: string;
  color: string;
  collected: boolean;
  pulsePhase: number;
  floatOffset: number;
}

interface GameState {
  player: Player;
  enemies: Enemy[];
  bullets: Bullet[];
  particles: Particle[];
  powerUps: PowerUp[];
  stars: Array<{
    x: number;
    y: number;
    speed: number;
    brightness: number;
    size: number;
    twinkle: number;
  }>;
  screenShake: {
    intensity: number;
    duration: number;
    remaining: number;
  };
  gameRunning: boolean;
  gameOver: boolean;
  gamePaused: boolean;
  gameState: 'intro' | 'playing' | 'paused' | 'gameOver' | 'share';
  keys: Set<string>;
  lastEnemySpawn: number;
  lastPowerUpSpawn: number;
  highScore: number;  stats: {
    enemiesKilled: number;
    powerUpsCollected: number;
    shotsFired: number;
    gameStartTime: number;
    gameEndTime?: number;
  };
}

const POWER_UP_TYPES = [
  {
    type: 'health',
    effect: { type: 'health_restore', value: 30 },
    icon: '❤️',
    color: '#ff0000'
  },
  {
    type: 'energy',
    effect: { type: 'energy_boost', value: 50 },
    icon: '⚡',
    color: '#00aaff'
  },
  {
    type: 'shield',
    effect: { type: 'shield', value: 100 },
    icon: '🛡️',
    color: '#4ecdc4'
  },
  {
    type: 'damage',
    effect: { type: 'damage_boost', value: 2 },
    icon: '🔥',
    color: '#ff6b35'
  }
];

export default function SpaceShooterGame({ onClose }: { onClose: () => void }) {  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shareCanvasRef = useRef<HTMLCanvasElement>(null);
  const gameStateRef = useRef<GameState>();
  const animationIdRef = useRef<number>();
  const controlsRef = useRef({
    up: false,
    down: false,
    left: false,
    right: false,
    shoot: false
  });  const [isMobile, setIsMobile] = useState(false);
  const [isGeneratingShareImage, setIsGeneratingShareImage] = useState(false);
  const [controls, setControls] = useState({
    up: false,
    down: false,
    left: false,
    right: false,
    shoot: false
  });
  // Keep controlsRef in sync with controls state
  useEffect(() => {
    controlsRef.current = controls;
  }, [controls]);// Detect mobile devices - more aggressive detection
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth <= 768 || 
                           'ontouchstart' in window || 
                           navigator.maxTouchPoints > 0 ||
                           /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      setIsMobile(isMobileDevice);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize game state
  const initializeGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const savedHighScore = localStorage.getItem('spaceShooter-highScore');
    const highScore = savedHighScore ? parseInt(savedHighScore) : 0;

    const gameState: GameState = {      player: {
        x: canvas.width / 2,
        y: canvas.height - 100,
        health: 100,
        maxHealth: 100,
        energy: 100,
        maxEnergy: 100,
        score: 0,
        level: 1,
        speed: 10, // Increased from 6 to 10 for faster movement
        shield: 0,
        isInvincible: false,
        invincibilityEnd: 0,
        thrusterEffect: 0,
        lastShot: 0
      },
      enemies: [],
      bullets: [],
      particles: [],
      powerUps: [],
      stars: [],
      screenShake: { intensity: 0, duration: 0, remaining: 0 },
      gameRunning: true,
      gameOver: false,
      gamePaused: false,
      gameState: 'intro',
      keys: new Set(),
      lastEnemySpawn: 0,
      lastPowerUpSpawn: 0,
      highScore,        stats: {
        enemiesKilled: 0,
        powerUpsCollected: 0,
        shotsFired: 0,
        gameStartTime: Date.now(),
        gameEndTime: undefined
      }
    };    // Initialize starfield
    for (let i = 0; i < 200; i++) {
      gameState.stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: Math.random() * 5 + 2, // Faster stars: 2-7 speed
        brightness: Math.random() * 0.9 + 0.1,
        size: Math.random() * 2 + 0.5,
        twinkle: Math.random() * Math.PI * 2
      });
    }

    return gameState;
  }, []);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Game update functions
  const createExplosion = (gameState: GameState, x: number, y: number, color: string, size: 'small' | 'medium' | 'large') => {
    const particleCount = size === 'large' ? 20 : size === 'medium' ? 12 : 6;
    const maxSize = size === 'large' ? 8 : size === 'medium' ? 5 : 3;
    
    for (let i = 0; i < particleCount; i++) {
      gameState.particles.push({
        x: x,
        y: y,
        dx: (Math.random() - 0.5) * 15, // Faster explosion particles
        dy: (Math.random() - 0.5) * 15,
        life: 0.8 + Math.random() * 0.5,
        color: color,
        size: Math.random() * maxSize + 2,
        type: 'explosion'
      });
    }
  };

  const createScreenShake = (gameState: GameState, intensity: number, duration: number) => {
    if (!gameState.gamePaused && !gameState.gameOver) {
      gameState.screenShake = { intensity, duration, remaining: duration };
    }
  };  const spawnEnemy = (gameState: GameState) => {
    const canvas = canvasRef.current!;
    
    // Score-based difficulty scaling (+5 enemies per 1000 points)
    const scoreMultiplier = Math.floor(gameState.player.score / 1000);
    
    // Mobile-optimized enemy stats for better engagement with score scaling
    const baseEnemyHealth = isMobile ? 40 : 60;
    const enemyHealth = baseEnemyHealth + (scoreMultiplier * 10); // +10 HP per 1000 points
    
    const baseSpeed = isMobile ? Math.max(scoreMultiplier/2,4) : 6;
    const enemySpeed = baseSpeed + (scoreMultiplier * 0.5); // +0.5 speed per 1000 points
    
    const speedVariation = isMobile ? 5 : 10;
    
    // Spawn multiple enemies based on score (every 1000 points = +1 enemy, max 5)
    const enemyCount = Math.min(1 + Math.floor(scoreMultiplier / 5), 5);
    
    for (let i = 0; i < enemyCount; i++) {
      gameState.enemies.push({
        x: Math.random() * (canvas.width - 100) + 50,
        y: -40 - (i * 60), // Stagger spawn positions
        health: enemyHealth,
        speed: enemySpeed + Math.random() * speedVariation,
        type: 'basic',
        lastShot: Date.now() + (i * 200), // Stagger shooting
        rotation: 0
      });
    }
  };

  const spawnPowerUp = (gameState: GameState) => {
    const canvas = canvasRef.current!;
    const powerUpData = POWER_UP_TYPES[Math.floor(Math.random() * POWER_UP_TYPES.length)];
    
    gameState.powerUps.push({
      x: Math.random() * (canvas.width - 100) + 50,
      y: -40,
      type: powerUpData.type,
      effect: powerUpData.effect,
      icon: powerUpData.icon,
      color: powerUpData.color,
      collected: false,
      pulsePhase: 0,
      floatOffset: 0
    });
  };  const shoot = (gameState: GameState) => {
    const now = Date.now();
    const shootCooldown = 150; // 150ms between shots for reasonable firing rate
    
    if (gameState.player.energy >= 8 && (now - gameState.player.lastShot) >= shootCooldown) {
      gameState.bullets.push({
        x: gameState.player.x,
        y: gameState.player.y - 25,
        dx: 0,
        dy: -16, // Increased bullet speed from -12 to -16
        damage: 25,
        owner: 'player',
        color: '#00aaff',
        trail: [],
        glowSize: 8
      });
      
      gameState.player.energy -= 8; // Reduced from 10 to 8
      gameState.player.lastShot = now; // Update last shot time
      gameState.stats.shotsFired++;
        // Muzzle flash particles
      for (let i = 0; i < 5; i++) {
        gameState.particles.push({
          x: gameState.player.x + (Math.random() - 0.5) * 10,
          y: gameState.player.y - 20,
          dx: (Math.random() - 0.5) * 6, // Faster muzzle flash
          dy: -Math.random() * 4,
          life: 0.3,
          color: '#ffffff',
          size: Math.random() * 3 + 1,
          type: 'spark'
        });
      }
    }
  };

  const collectPowerUp = (gameState: GameState, powerUp: PowerUp) => {
    switch (powerUp.effect.type) {
      case 'health_restore':
        gameState.player.health = Math.min(gameState.player.maxHealth, 
          gameState.player.health + powerUp.effect.value);
        break;
      case 'energy_boost':
        gameState.player.energy = Math.min(gameState.player.maxEnergy, 
          gameState.player.energy + powerUp.effect.value);
        break;
      case 'shield':
        gameState.player.shield = Math.min(100, gameState.player.shield + powerUp.effect.value);
        break;
    }
    
    gameState.stats.powerUpsCollected++;
    toast.success(`Collected ${powerUp.type}!`);
  };

  const updateGame = (gameState: GameState, deltaTime: number) => {
    const canvas = canvasRef.current!;
    
    // Update screen shake
    if (gameState.screenShake.remaining > 0) {
      gameState.screenShake.remaining -= deltaTime;
      if (gameState.screenShake.remaining <= 0) {
        gameState.screenShake.intensity = 0;
      }
    }    // Update player
    const { player, keys } = gameState;
    const currentControls = controlsRef.current;
    let isMoving = false;

    // Handle mobile drag-to-move controls AND desktop controls
    if (currentControls.shoot && touchTargetRef.current.x !== 0 && touchTargetRef.current.y !== 0) {
      // Drag-to-move system (works for both mobile and desktop)
      const targetX = touchTargetRef.current.x;
      const targetY = touchTargetRef.current.y;
      
      // Calculate distance to target
      const dx = targetX - player.x;
      const dy = targetY - player.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Move towards touch position if we're not already there
      if (distance > 5) { // Small threshold to prevent jittering
        // Normalize direction and apply speed
        const moveX = (dx / distance) * player.speed;
        const moveY = (dy / distance) * player.speed;
        
        // Apply movement with bounds checking
        const newX = player.x + moveX;
        const newY = player.y + moveY;
        
        if (newX > 30 && newX < canvas.width - 30) {
          player.x = newX;
          isMoving = true;
        }
        if (newY > 30 && newY < canvas.height - 30) {
          player.y = newY;
          isMoving = true;
        }
      }
    }
    
    // Handle keyboard/desktop controls (still available as backup)
    if ((keys.has('a') || keys.has('arrowleft') || currentControls.left) && player.x > 30) {
      player.x -= player.speed;
      isMoving = true;
    }
    if ((keys.has('d') || keys.has('arrowright') || currentControls.right) && player.x < canvas.width - 30) {
      player.x += player.speed;
      isMoving = true;
    }
    if ((keys.has('w') || keys.has('arrowup') || currentControls.up) && player.y > 30) {
      player.y -= player.speed;
      isMoving = true;
    }
    if ((keys.has('s') || keys.has('arrowdown') || currentControls.down) && player.y < canvas.height - 30) {
      player.y += player.speed;
      isMoving = true;
    }

    // Update thruster effect
    if (isMoving) {
      player.thrusterEffect = Math.min(1, player.thrusterEffect + deltaTime * 0.005);      // Create thruster particles
      for (let i = 0; i < 3; i++) { // More thruster particles for speed feeling
        gameState.particles.push({
          x: player.x + (Math.random() - 0.5) * 10,
          y: player.y + 15,
          dx: (Math.random() - 0.5) * 3, // Faster thruster particles
          dy: Math.random() * 3 + 2,
          life: 0.5,
          color: '#00aaff',
          size: Math.random() * 3 + 1,
          type: 'thruster'
        });
      }
    } else {
      player.thrusterEffect = Math.max(0, player.thrusterEffect - deltaTime * 0.003);
    }    // Shooting
    if (keys.has(' ') || currentControls.shoot) {
      shoot(gameState);
    }// Energy regeneration (faster regen for more responsive gameplay)
    player.energy = Math.min(player.maxEnergy, player.energy + deltaTime * 0.05); // Increased from 0.03

    // Remove invincibility
    if (player.isInvincible && Date.now() > player.invincibilityEnd) {
      player.isInvincible = false;
    }

    // Update enemies
    gameState.enemies.forEach((enemy, index) => {
      enemy.y += enemy.speed;
      
      // Enemy rotation towards player
      const dx = player.x - enemy.x;
      const dy = player.y - enemy.y;
      enemy.rotation = Math.atan2(dy, dx) + Math.PI / 2;
      
      if (enemy.y > canvas.height + 50) {
        gameState.enemies.splice(index, 1);
        return;
      }      // Enemy shooting - mobile-optimized for better engagement
      const baseShotDelay = isMobile ? 1200 : 800; // Slower shooting on mobile
      const shotVariation = isMobile ? 800 : 600; // More variation on mobile
      const bulletSpeed = isMobile ? 4 : 6; // Slower bullets on mobile
      
      if (Date.now() - enemy.lastShot > baseShotDelay + Math.random() * shotVariation) {
        const distance = Math.sqrt(dx * dx + dy * dy);
        gameState.bullets.push({
          x: enemy.x,
          y: enemy.y + 25,
          dx: (dx / distance) * bulletSpeed,
          dy: (dy / distance) * bulletSpeed,
          damage: 20,
          owner: 'enemy',
          color: '#ff3333',
          trail: [],
          glowSize: 6
        });
        enemy.lastShot = Date.now();
      }
    });

    // Update bullets
    gameState.bullets.forEach((bullet, index) => {
      // Update trail
      if (!bullet.trail) bullet.trail = [];
      bullet.trail.unshift({ x: bullet.x, y: bullet.y, alpha: 1.0 });
      if (bullet.trail.length > 6) bullet.trail.pop();
      
      bullet.trail.forEach((point, i) => {
        point.alpha = 1.0 - (i / bullet.trail.length);
      });
      
      bullet.x += bullet.dx;
      bullet.y += bullet.dy;
      
      if (bullet.x < -50 || bullet.x > canvas.width + 50 ||
          bullet.y < -50 || bullet.y > canvas.height + 50) {
        gameState.bullets.splice(index, 1);
      }
    });

    // Update particles
    gameState.particles.forEach((particle, index) => {
      particle.x += particle.dx;
      particle.y += particle.dy;
      particle.life -= deltaTime * 0.001;
      
      if (particle.type === 'thruster') {
        particle.size *= 0.98;
        particle.dy += 0.1;
      } else if (particle.type === 'explosion') {
        particle.size *= 0.98;
        particle.dx *= 0.95;
        particle.dy *= 0.95;
      }
      
      if (particle.life <= 0 || particle.size < 0.5) {
        gameState.particles.splice(index, 1);
      }
    });    // Update power-ups
    gameState.powerUps.forEach((powerUp, index) => {
      powerUp.y += 4; // Faster power-up movement to match game pace
      powerUp.pulsePhase += deltaTime * 0.005;
      powerUp.floatOffset = Math.sin(powerUp.pulsePhase) * 3;
      
      if (powerUp.y > canvas.height + 50) {
        gameState.powerUps.splice(index, 1);
        return;
      }
      
      // Check collection
      const dx = powerUp.x - player.x;
      const dy = powerUp.y - player.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 30 && !powerUp.collected) {
        collectPowerUp(gameState, powerUp);
        gameState.powerUps.splice(index, 1);
      }
    });

    // Update stars
    gameState.stars.forEach(star => {
      star.y += star.speed;
      star.twinkle += deltaTime * 0.005;
      
      if (star.y > canvas.height + 10) {
        star.y = -10;
        star.x = Math.random() * canvas.width;
      }
    });

    // Collision detection
    gameState.bullets.forEach((bullet, bIndex) => {
      if (bullet.owner === 'player') {
        // Player bullets vs enemies
        gameState.enemies.forEach((enemy, eIndex) => {
          const dx = bullet.x - enemy.x;
          const dy = bullet.y - enemy.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 25) {
            enemy.health -= bullet.damage;
            gameState.bullets.splice(bIndex, 1);
            
            createExplosion(gameState, enemy.x, enemy.y, '#ff6b6b', 'medium');
            
            if (enemy.health <= 0) {
              gameState.enemies.splice(eIndex, 1);
              gameState.player.score += 100;
              gameState.stats.enemiesKilled++;
              
              createExplosion(gameState, enemy.x, enemy.y, '#ffaa00', 'large');
              createScreenShake(gameState, 5, 200);
              
              // Chance to drop power-up
              if (Math.random() < 0.2) {
                const powerUpData = POWER_UP_TYPES[Math.floor(Math.random() * POWER_UP_TYPES.length)];
                gameState.powerUps.push({
                  x: enemy.x,
                  y: enemy.y,
                  type: powerUpData.type,
                  effect: powerUpData.effect,
                  icon: powerUpData.icon,
                  color: powerUpData.color,
                  collected: false,
                  pulsePhase: 0,
                  floatOffset: 0
                });
              }
            }
          }
        });
      } else {
        // Enemy bullets vs player
        const dx = bullet.x - player.x;
        const dy = bullet.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 20 && !player.isInvincible) {
          let damage = bullet.damage;
          
          if (player.shield > 0) {
            const shieldDamage = Math.min(damage, player.shield);
            player.shield -= shieldDamage;
            damage -= shieldDamage;
          }
          
          if (damage > 0) {
            player.health -= damage;
            createScreenShake(gameState, 8, 300);
          }
          
          gameState.bullets.splice(bIndex, 1);
          createExplosion(gameState, player.x, player.y, '#ff4444', 'medium');
            if (player.health <= 0) {
            gameState.gameOver = true;
            gameState.gameState = 'gameOver';
            gameState.stats.gameEndTime = Date.now(); // Stop the timer
            
            // Update high score
            if (player.score > gameState.highScore) {
              gameState.highScore = player.score;
              localStorage.setItem('spaceShooter-highScore', player.score.toString());
            }
          }
        }
      }
    });    // Spawn enemies - reduce spawn rate on mobile for better engagement with score-based scaling
    const baseSpawnDelay = isMobile ? 1200 : 800; // Slower spawning on mobile
    const levelSpeedIncrease = isMobile ? 30 : 40; // Gentler difficulty progression on mobile
    const scoreSpeedIncrease = Math.floor(gameState.player.score / 1000) * 50; // Faster spawning per 1000 points
    const finalSpawnDelay = Math.max(200, baseSpawnDelay - (gameState.player.level * levelSpeedIncrease) - scoreSpeedIncrease);
    
    if (Date.now() - gameState.lastEnemySpawn > finalSpawnDelay) {
      spawnEnemy(gameState);
      gameState.lastEnemySpawn = Date.now();
    }

    // Spawn power-ups
    if (Date.now() - gameState.lastPowerUpSpawn > 12000 + Math.random() * 8000) { // Slightly faster power-up spawning
      spawnPowerUp(gameState);
      gameState.lastPowerUpSpawn = Date.now();
    }    // Level progression - keep max health at 100
    const scoreThreshold = gameState.player.level * 1000;
    if (gameState.player.score >= scoreThreshold) {
      gameState.player.level++;
      // Only heal to full, don't increase max health
      gameState.player.health = gameState.player.maxHealth;
      toast.success(`Level ${gameState.player.level}! Health Restored!`);
    }
  };
  // Rendering functions
  const drawBackground = (ctx: CanvasRenderingContext2D, gameState: GameState, canvas: HTMLCanvasElement) => {
    // Enhanced space background with nebula effects
    const gradient = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.width);
    gradient.addColorStop(0, '#0a0a2e');
    gradient.addColorStop(0.3, '#16213e');
    gradient.addColorStop(0.7, '#0f0f23');
    gradient.addColorStop(1, '#000000');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add nebula clouds for depth
    const time = Date.now() * 0.0001;
    for (let i = 0; i < 3; i++) {
      const x = (canvas.width * 0.3) + Math.sin(time + i * 2) * 100;
      const y = (canvas.height * 0.4) + Math.cos(time + i * 1.5) * 80;
      const size = 150 + Math.sin(time + i) * 30;
      
      const nebulaGradient = ctx.createRadialGradient(x, y, 0, x, y, size);
      const colors = ['#ff00ff', '#00ffff', '#ff8800'];
      const color = colors[i % colors.length];
      nebulaGradient.addColorStop(0, color + '10');
      nebulaGradient.addColorStop(0.5, color + '05');
      nebulaGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = nebulaGradient;
      ctx.fillRect(x - size, y - size, size * 2, size * 2);
    }
    
    // Enhanced starfield with twinkling
    gameState.stars.forEach(star => {
      const twinkle = Math.sin(star.twinkle) * 0.4 + 0.6;
      ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness * twinkle})`;
      
      // Larger stars get glow effects
      if (star.size > 1.5) {
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 6;
        ctx.fillRect(star.x, star.y, star.size, star.size);
        ctx.shadowBlur = 0;
        
        // Cross pattern for bright stars
        ctx.strokeStyle = `rgba(255, 255, 255, ${star.brightness * twinkle * 0.5})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(star.x - star.size * 2, star.y + star.size / 2);
        ctx.lineTo(star.x + star.size * 3, star.y + star.size / 2);
        ctx.moveTo(star.x + star.size / 2, star.y - star.size * 2);
        ctx.lineTo(star.x + star.size / 2, star.y + star.size * 3);
        ctx.stroke();
      } else {
        ctx.fillRect(star.x, star.y, star.size, star.size);
      }
    });
  };
  const drawPlayer = (ctx: CanvasRenderingContext2D, player: Player) => {
    ctx.save();
    ctx.translate(player.x, player.y);
    
    if (player.isInvincible) {
      ctx.globalAlpha = Math.sin(Date.now() * 0.02) * 0.4 + 0.6;
    }
    
    // Enhanced player ship design with more detail
    const hullGradient = ctx.createLinearGradient(0, -20, 0, 20);
    hullGradient.addColorStop(0, '#00ffaa');
    hullGradient.addColorStop(0.5, '#00cc88');
    hullGradient.addColorStop(1, '#008855');
    ctx.fillStyle = hullGradient;
    
    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.lineTo(-15, 20);
    ctx.lineTo(-8, 15);
    ctx.lineTo(0, 18);
    ctx.lineTo(8, 15);
    ctx.lineTo(15, 20);
    ctx.closePath();
    ctx.fill();
    
    // Hull outline with glow
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#00ffaa';
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.shadowBlur = 0;
    
    // Cockpit with enhanced glow
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(0, -5, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Wing details with energy lines
    ctx.strokeStyle = '#00ffaa';
    ctx.lineWidth = 1;
    ctx.shadowColor = '#00ffaa';
    ctx.shadowBlur = 4;
    ctx.beginPath();
    ctx.moveTo(-12, 5);
    ctx.lineTo(-8, 12);
    ctx.moveTo(12, 5);
    ctx.lineTo(8, 12);
    // Add energy conduits
    ctx.moveTo(-10, -10);
    ctx.lineTo(-6, 0);
    ctx.moveTo(10, -10);
    ctx.lineTo(6, 0);
    ctx.stroke();
    ctx.shadowBlur = 0;
    
    // Engine exhausts
    ctx.fillStyle = '#0088ff';
    ctx.shadowColor = '#0088ff';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(-8, 16, 2, 0, Math.PI * 2);
    ctx.arc(8, 16, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    ctx.restore();
      // Shield effect with enhanced visuals
    if (player.shield > 0) {
      // Multiple shield layers for depth
      ctx.strokeStyle = '#4ecdc4';
      ctx.lineWidth = 4;
      ctx.globalAlpha = 0.8;
      ctx.shadowColor = '#4ecdc4';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(player.x, player.y, 30, 0, Math.PI * 2);
      ctx.stroke();
      
      // Inner shield ring
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.arc(player.x, player.y, 25, 0, Math.PI * 2);
      ctx.stroke();
      
      // Shield particles
      const time = Date.now() * 0.01;
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 + time;
        const x = player.x + Math.cos(angle) * 28;
        const y = player.y + Math.sin(angle) * 28;
        ctx.fillStyle = '#4ecdc4';
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    }
      // Enhanced thruster effects with multiple layers
    if (player.thrusterEffect > 0) {
      const thrusterIntensity = player.thrusterEffect;
      
      // Main thruster flame
      const thrusterGradient = ctx.createLinearGradient(player.x, player.y + 20, player.x, player.y + 40);
      thrusterGradient.addColorStop(0, '#00aaff');
      thrusterGradient.addColorStop(0.5, '#0088cc');
      thrusterGradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = thrusterGradient;
      ctx.globalAlpha = thrusterIntensity;
      
      // Central thruster
      ctx.beginPath();
      ctx.moveTo(player.x - 8, player.y + 20);
      ctx.lineTo(player.x + 8, player.y + 20);
      ctx.lineTo(player.x, player.y + 40);
      ctx.closePath();
      ctx.fill();
      
      // Side thrusters
      ctx.beginPath();
      ctx.moveTo(player.x - 14, player.y + 18);
      ctx.lineTo(player.x - 10, player.y + 18);
      ctx.lineTo(player.x - 12, player.y + 32);
      ctx.closePath();
      ctx.fill();
      
      ctx.beginPath();
      ctx.moveTo(player.x + 10, player.y + 18);
      ctx.lineTo(player.x + 14, player.y + 18);
      ctx.lineTo(player.x + 12, player.y + 32);
      ctx.closePath();
      ctx.fill();
      
      // Thruster core glow
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = thrusterIntensity * 0.8;
      ctx.shadowColor = '#00aaff';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(player.x, player.y + 20, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
    
    ctx.globalAlpha = 1;
  };
  const drawEnemy = (ctx: CanvasRenderingContext2D, enemy: Enemy) => {
    ctx.save();
    ctx.translate(enemy.x, enemy.y);
    ctx.rotate(enemy.rotation);
    
    // Enhanced enemy ship design with menacing look
    const enemyGradient = ctx.createLinearGradient(0, -15, 0, 15);
    enemyGradient.addColorStop(0, '#ff6666');
    enemyGradient.addColorStop(0.5, '#ff4444');
    enemyGradient.addColorStop(1, '#cc2222');
    
    ctx.fillStyle = enemyGradient;
    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.lineTo(-15, -5);
    ctx.lineTo(-12, 5);
    ctx.lineTo(-18, 10);
    ctx.lineTo(-8, 15);
    ctx.lineTo(0, 12);
    ctx.lineTo(8, 15);
    ctx.lineTo(18, 10);
    ctx.lineTo(12, 5);
    ctx.lineTo(15, -5);
    ctx.closePath();
    ctx.fill();
    
    // Hull outline with ominous glow
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.shadowColor = '#ff4444';
    ctx.shadowBlur = 6;
    ctx.stroke();
    ctx.shadowBlur = 0;
    
    // Weapon ports
    ctx.fillStyle = '#ff8888';
    ctx.shadowColor = '#ff0000';
    ctx.shadowBlur = 4;
    ctx.beginPath();
    ctx.arc(-10, -10, 1.5, 0, Math.PI * 2);
    ctx.arc(10, -10, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Engine glow with pulsing effect
    const enginePulse = Math.sin(Date.now() * 0.01) * 0.3 + 0.7;
    ctx.fillStyle = `rgba(255, 221, 0, ${enginePulse})`;
    ctx.shadowColor = '#ffdd00';
    ctx.shadowBlur = 8 * enginePulse;
    ctx.beginPath();
    ctx.arc(0, 8, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Side engine ports
    ctx.beginPath();
    ctx.arc(-8, 10, 2, 0, Math.PI * 2);
    ctx.arc(8, 10, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    ctx.restore();
    
    // Health bar
    if (enemy.health < 60) {
      const healthBarWidth = 30;
      const healthPercentage = enemy.health / 60;
      
      ctx.fillStyle = '#333333';
      ctx.fillRect(enemy.x - healthBarWidth/2, enemy.y - 30, healthBarWidth, 4);
      
      const healthGradient = ctx.createLinearGradient(enemy.x - healthBarWidth/2, 0, enemy.x + healthBarWidth/2, 0);
      healthGradient.addColorStop(0, '#ff0000');
      healthGradient.addColorStop(0.5, '#ffaa00');
      healthGradient.addColorStop(1, '#00ff00');
      ctx.fillStyle = healthGradient;
      ctx.fillRect(enemy.x - healthBarWidth/2, enemy.y - 30, healthPercentage * healthBarWidth, 4);
    }
  };
  const drawBullet = (ctx: CanvasRenderingContext2D, bullet: Bullet) => {
    // Enhanced trail with fading effect
    if (bullet.trail && bullet.trail.length > 0) {
      bullet.trail.forEach((point, index) => {
        if (point && point.alpha > 0) {
          ctx.globalAlpha = point.alpha * 0.8;
          ctx.fillStyle = bullet.color;
          const size = (4 - (index / bullet.trail.length) * 3);
          
          // Trail glow
          ctx.shadowColor = bullet.color;
          ctx.shadowBlur = size * 2;
          ctx.beginPath();
          ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });
    }
    
    // Main bullet with enhanced glow
    ctx.globalAlpha = 1;
    ctx.shadowColor = bullet.color;
    ctx.shadowBlur = bullet.glowSize + Math.sin(Date.now() * 0.02) * 3;
    ctx.fillStyle = bullet.color;
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, 5, 0, Math.PI * 2);
    ctx.fill();
    
    // Core highlight with pulsing effect
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = 0.8 + Math.sin(Date.now() * 0.05) * 0.2;
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, 2.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Energy ring around bullet
    ctx.globalAlpha = 0.6;
    ctx.strokeStyle = bullet.color;
    ctx.lineWidth = 1;
    ctx.shadowColor = bullet.color;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, 7, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  };
  const drawParticle = (ctx: CanvasRenderingContext2D, particle: Particle) => {
    ctx.globalAlpha = particle.life;
    
    if (particle.type === 'explosion') {
      // Enhanced explosion particles with multiple layers
      ctx.shadowColor = particle.color;
      ctx.shadowBlur = particle.size * 2;
      
      // Outer glow
      ctx.fillStyle = particle.color + '60';
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * 1.5, 0, Math.PI * 2);
      ctx.fill();
      
      // Core particle
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      
      // White hot center
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = particle.life * 0.7;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (particle.type === 'thruster') {
      // Thruster particles with streak effect
      ctx.shadowColor = particle.color;
      ctx.shadowBlur = particle.size;
      ctx.fillStyle = particle.color;
      
      // Streak shape for motion
      ctx.beginPath();
      ctx.ellipse(particle.x, particle.y, particle.size, particle.size * 2, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Regular particles with glow
      ctx.shadowColor = particle.color;
      ctx.shadowBlur = particle.size;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  };
  const drawPowerUp = (ctx: CanvasRenderingContext2D, powerUp: PowerUp) => {
    const y = powerUp.y + powerUp.floatOffset;
    const pulseSize = 25 + Math.sin(powerUp.pulsePhase * 2) * 6;
    const time = Date.now() * 0.005;
    
    // Multiple ring effects for enhanced visual
    // Outer energy ring
    ctx.shadowColor = powerUp.color;
    ctx.shadowBlur = 20;
    ctx.strokeStyle = powerUp.color + '60';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(powerUp.x, y, pulseSize + 5, 0, Math.PI * 2);
    ctx.stroke();
    
    // Middle ring
    ctx.strokeStyle = powerUp.color + '80';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(powerUp.x, y, pulseSize, 0, Math.PI * 2);
    ctx.stroke();
    
    // Inner energy ring with rotation
    ctx.shadowBlur = 10;
    ctx.strokeStyle = powerUp.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(powerUp.x, y, pulseSize - 8, 0, Math.PI * 2);
    ctx.stroke();
    
    // Core background with gradient
    ctx.shadowBlur = 0;
    const coreGradient = ctx.createRadialGradient(powerUp.x, y, 0, powerUp.x, y, 15);
    coreGradient.addColorStop(0, powerUp.color + 'AA');
    coreGradient.addColorStop(0.7, powerUp.color + '60');
    coreGradient.addColorStop(1, powerUp.color + '20');
    ctx.fillStyle = coreGradient;
    ctx.beginPath();
    ctx.arc(powerUp.x, y, 15, 0, Math.PI * 2);
    ctx.fill();
    
    // Rotating energy sparks
    for (let i = 0; i < 6; i++) {
      const angle = (time + i * Math.PI / 3);
      const sparkX = powerUp.x + Math.cos(angle) * (pulseSize + 3);
      const sparkY = y + Math.sin(angle) * (pulseSize + 3);
      
      ctx.fillStyle = powerUp.color;
      ctx.shadowColor = powerUp.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(sparkX, sparkY, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Icon with enhanced styling
    ctx.shadowColor = powerUp.color;
    ctx.shadowBlur = 8;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(powerUp.icon, powerUp.x, y + 8);
    
    // Icon outline for better visibility
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeText(powerUp.icon, powerUp.x, y + 8);
    
    ctx.shadowBlur = 0;
  };
  const drawUI = (ctx: CanvasRenderingContext2D, gameState: GameState, canvas: HTMLCanvasElement) => {
    const player = gameState.player;
    
    // Mobile-optimized UI
    if (isMobile) {
      // Compact top HUD for mobile
      const hudHeight = 80;
      const margin = 8;
      
      // Semi-transparent background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(margin, margin, canvas.width - margin * 2, hudHeight);
      ctx.strokeStyle = '#00ffaa';
      ctx.lineWidth = 1;
      ctx.strokeRect(margin, margin, canvas.width - margin * 2, hudHeight);
      
      // Health bar (top)
      const barWidth = canvas.width - margin * 4;
      const barHeight = 12;
      const startY = margin + 8;
      
      ctx.fillStyle = '#333333';
      ctx.fillRect(margin * 2, startY, barWidth, barHeight);
      
      const healthGradient = ctx.createLinearGradient(margin * 2, 0, margin * 2 + barWidth, 0);
      healthGradient.addColorStop(0, '#ff0000');
      healthGradient.addColorStop(0.5, '#ffaa00');
      healthGradient.addColorStop(1, '#00ff00');
      ctx.fillStyle = healthGradient;
      ctx.fillRect(margin * 2, startY, (player.health / player.maxHealth) * barWidth, barHeight);
      
      // Health text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 8px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`HP: ${player.health}`, canvas.width / 2, startY + 9);
      
      // Energy bar
      const energyY = startY + barHeight + 4;
      ctx.fillStyle = '#333333';
      ctx.fillRect(margin * 2, energyY, barWidth, 8);
      ctx.fillStyle = '#0088ff';
      ctx.fillRect(margin * 2, energyY, (player.energy / player.maxEnergy) * barWidth, 8);
      
      // Shield bar (if active)
      if (player.shield > 0) {
        const shieldY = energyY + 10;
        ctx.fillStyle = '#333333';
        ctx.fillRect(margin * 2, shieldY, barWidth, 6);
        ctx.fillStyle = '#4ecdc4';
        ctx.fillRect(margin * 2, shieldY, (player.shield / 100) * barWidth, 6);
      }
      
      // Score and level (compact)
      ctx.fillStyle = '#00ffaa';
      ctx.font = 'bold 10px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`SCORE: ${player.score.toLocaleString()}`, margin * 2, energyY + 20);
      ctx.textAlign = 'right';
      ctx.fillText(`LVL: ${player.level}`, canvas.width - margin * 2, energyY + 20);
      
      // High Score (mobile)
      if (gameState.highScore > 0) {
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 8px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`HIGH: ${gameState.highScore.toLocaleString()}`, canvas.width / 2, energyY + 32);
      }
    } else {
      // Desktop UI (original)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(10, 10, 300, 120);
      ctx.strokeStyle = '#00ffaa';
      ctx.lineWidth = 2;
      ctx.strokeRect(10, 10, 300, 120);
      
      // Health bar
      ctx.shadowColor = '#00ff00';
      ctx.shadowBlur = 5;
      ctx.fillStyle = '#333333';
      ctx.fillRect(25, 25, 250, 20);
      
      const healthGradient = ctx.createLinearGradient(25, 0, 275, 0);
      healthGradient.addColorStop(0, '#ff0000');
      healthGradient.addColorStop(0.5, '#ffaa00');
      healthGradient.addColorStop(1, '#00ff00');
      ctx.fillStyle = healthGradient;
      ctx.fillRect(25, 25, (player.health / player.maxHealth) * 250, 20);
      
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`HULL: ${player.health}/${player.maxHealth}`, 150, 38);
      
      // Shield bar (if active)
      if (player.shield > 0) {
        ctx.shadowColor = '#4ecdc4';
        ctx.shadowBlur = 5;
        ctx.fillStyle = '#333333';
        ctx.fillRect(25, 50, 250, 15);
        ctx.fillStyle = '#4ecdc4';
        ctx.fillRect(25, 50, (player.shield / 100) * 250, 15);
        ctx.shadowBlur = 0;
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 8px Arial';
        ctx.fillText(`SHIELD: ${player.shield}`, 150, 60);
      }
      
      // Energy bar
      const energyY = player.shield > 0 ? 70 : 50;
      ctx.shadowColor = '#0088ff';
      ctx.shadowBlur = 5;
      ctx.fillStyle = '#333333';
      ctx.fillRect(25, energyY, 250, 15);
      ctx.fillStyle = '#0088ff';
      ctx.fillRect(25, energyY, (player.energy / player.maxEnergy) * 250, 15);
      ctx.shadowBlur = 0;
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 8px Arial';
      ctx.fillText(`ENERGY: ${Math.floor(player.energy)}/${player.maxEnergy}`, 150, energyY + 11);
      
      // Score and level
      ctx.fillStyle = '#00ffaa';
      ctx.font = 'bold 18px Arial';
      ctx.textAlign = 'left';
      const scoreY = energyY + 25;
      ctx.fillText(`SCORE: ${player.score.toLocaleString()}`, 25, scoreY);
      ctx.fillText(`LEVEL: ${player.level}`, 25, scoreY + 20);
      
      // High Score
      if (gameState.highScore > 0) {
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(`HIGH: ${gameState.highScore.toLocaleString()}`, canvas.width - 25, 35);
      }
        // Controls hint
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '12px Arial';
      ctx.textAlign = 'right';
      if (isMobile) {
        ctx.fillText('DRAG: Move & Shoot, P: Pause', canvas.width - 25, canvas.height - 20);
      } else {
        ctx.fillText('WASD: Move, SPACE: Shoot, P: Pause', canvas.width - 25, canvas.height - 20);
      }
    }
  };  const drawIntroScreen = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Dark overlay with subtle animation
    ctx.fillStyle = 'rgba(0, 0, 0, 0.95)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Responsive sizing based on viewport dimensions - MUCH larger minimum sizes
    const viewportWidth = canvas.width;
    const viewportHeight = canvas.height;
    const isSmallScreen = viewportWidth < 768;
    const isTinyScreen = viewportWidth < 480;
    
    // DRAMATICALLY increased minimum font sizes for mobile readability
    const titleSize = isMobile ? Math.max(32, Math.min(viewportWidth * 0.12, 48)) : Math.max(40, Math.min(viewportWidth * 0.08, 64));
    const subtitleSize = isMobile ? Math.max(18, Math.min(viewportWidth * 0.05, 28)) : Math.max(24, Math.min(viewportWidth * 0.035, 32));
    const headerSize = isMobile ? Math.max(16, Math.min(viewportWidth * 0.04, 24)) : Math.max(20, Math.min(viewportWidth * 0.025, 28));
    const textSize = isMobile ? Math.max(14, Math.min(viewportWidth * 0.035, 20)) : Math.max(16, Math.min(viewportWidth * 0.022, 20));
    const buttonSize = isMobile ? Math.max(18, Math.min(viewportWidth * 0.045, 26)) : Math.max(20, Math.min(viewportWidth * 0.03, 28));
    
    // Animated background elements with responsive scaling
    const time = Date.now() * 0.001;
    const particleCount = isMobile ? 3 : 5;
    const animationScale = Math.min(viewportWidth / 800, 1);
    
    for (let i = 0; i < particleCount; i++) {
      const x = (viewportWidth * 0.2) + Math.sin(time + i * 0.5) * (50 * animationScale);
      const y = (viewportHeight * 0.3) + Math.cos(time + i * 0.3) * (30 * animationScale);
      const alpha = (Math.sin(time + i) + 1) * 0.1;
      
      ctx.fillStyle = `rgba(0, 255, 170, ${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, Math.max(8, 15 * animationScale), 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Responsive layout positioning - better spacing for mobile
    const titleY = isMobile ? Math.max(80, viewportHeight * 0.15) : Math.max(100, viewportHeight * 0.2);
      // Title with enhanced glow - fully responsive - split into two lines
    ctx.shadowColor = '#00ffaa';
    ctx.shadowBlur = Math.max(15, titleSize * 0.3);
    ctx.fillStyle = '#00ffaa';
    ctx.font = `bold ${titleSize}px Arial`;
    ctx.textAlign = 'center';
    
    // Split title into two lines for better mobile display
    ctx.fillText('🚀 SPACE', viewportWidth / 2, titleY);
    ctx.fillText('SHOOTER 🚀', viewportWidth / 2, titleY + (isMobile ? Math.max(titleSize * 0.8, 25) : Math.max(titleSize * 0.9, 35)));
    
    // Subtitle with responsive positioning - better spacing
    ctx.shadowBlur = Math.max(5, subtitleSize * 0.2);
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${subtitleSize}px Arial`;
    const subtitleText = isMobile ? 'Defend Earth!' : 'Defend Earth from the Alien Invasion!';
    const subtitleY = titleY + (isMobile ? Math.max(titleSize * 1.6, 60) : Math.max(titleSize * 1.8, 70));
    ctx.fillText(subtitleText, viewportWidth / 2, subtitleY);
    
    // How to play section - responsive layout with better spacing
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#4ecdc4';
    ctx.font = `bold ${headerSize}px Arial`;
    const howToPlayY = subtitleY + (isMobile ? Math.max(40, headerSize * 2.5) : Math.max(50, headerSize * 2.5));
    ctx.fillText(isMobile ? 'CONTROLS:' : 'HOW TO PLAY:', viewportWidth / 2, howToPlayY);
      // Instructions with responsive spacing - much better readability with text wrapping
    ctx.fillStyle = '#ffffff';
    ctx.font = `${textSize}px Arial`;
    
    let instructionY = howToPlayY + (isMobile ? Math.max(25, textSize * 2) : Math.max(30, headerSize * 1.5));
    const lineSpacing = isMobile ? Math.max(22, textSize * 1.6) : Math.max(24, textSize * 1.4);
    
    // Helper function to wrap text
    const wrapText = (text: string, maxWidth: number) => {
      const words = text.split(' ');
      const lines = [];
      let currentLine = '';
      
      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      
      if (currentLine) {
        lines.push(currentLine);
      }
      
      return lines;
    };
    
    if (isMobile) {
      // Mobile instructions - larger, clearer text with wrapping
      const maxWidth = viewportWidth * 0.85; // 85% of screen width for text
      const mobileInstructions = isTinyScreen ? [
        '📱 DRAG to move & shoot',
        '⚡ Collect power-ups', 
        '🎯 Survive & score!'
      ] : [
        '📱 DRAG anywhere to move',
        '🔫 Auto-fires while touching',
        '⚡ Collect power-ups',
        '🎯 Survive as long as possible!'
      ];
      
      let currentY = instructionY;
      mobileInstructions.forEach((instruction) => {
        const wrappedLines = wrapText(instruction, maxWidth);
        wrappedLines.forEach((line) => {
          ctx.fillText(line, viewportWidth / 2, currentY);
          currentY += lineSpacing;
        });
      });
    } else {
      // Desktop instructions with responsive layout and wrapping
      const maxWidth = viewportWidth * 0.7; // 70% of screen width for text
      const desktopInstructions = [
        '🎮 WASD or Arrow Keys to move your ship',
        '🔫 SPACEBAR to shoot (hold for rapid fire)',
        '⏸️ P to pause the game',
        '⚡ Collect power-ups to boost your abilities',
        '🎯 Survive as long as possible and beat your high score!'
      ];
      
      let currentY = instructionY;
      desktopInstructions.forEach((instruction) => {
        const wrappedLines = wrapText(instruction, maxWidth);
        wrappedLines.forEach((line) => {
          ctx.fillText(line, viewportWidth / 2, currentY);
          currentY += lineSpacing;
        });
      });
    }
      // Start button with responsive positioning and sizing - larger touch targets
    // Calculate final Y position after wrapped text
    let finalInstructionY = instructionY;
    if (isMobile) {
      const maxWidth = viewportWidth * 0.85;
      const mobileInstructions = isTinyScreen ? [
        '📱 DRAG to move & shoot',
        '⚡ Collect power-ups', 
        '🎯 Survive & score!'
      ] : [
        '📱 DRAG anywhere to move',
        '🔫 Auto-fires while touching',
        '⚡ Collect power-ups',
        '🎯 Survive as long as possible!'
      ];
      
      mobileInstructions.forEach((instruction) => {
        const wrappedLines = wrapText(instruction, maxWidth);
        finalInstructionY += wrappedLines.length * lineSpacing;
      });
    } else {
      const maxWidth = viewportWidth * 0.7;
      const desktopInstructions = [
        '🎮 WASD or Arrow Keys to move your ship',
        '🔫 SPACEBAR to shoot (hold for rapid fire)',
        '⏸️ P to pause the game',
        '⚡ Collect power-ups to boost your abilities',
        '🎯 Survive as long as possible and beat your high score!'
      ];
      
      desktopInstructions.forEach((instruction) => {
        const wrappedLines = wrapText(instruction, maxWidth);
        finalInstructionY += wrappedLines.length * lineSpacing;
      });
    }
    
    const buttonY = finalInstructionY + (isMobile ? 30 : 40);
    const buttonWidth = isMobile ? Math.min(Math.max(240, viewportWidth * 0.6), 320) : Math.min(Math.max(200, viewportWidth * 0.3), 300);
    const buttonHeight = isMobile ? Math.max(50, Math.min(viewportHeight * 0.08, 70)) : Math.max(45, Math.min(viewportHeight * 0.06, 60));
    
    const pulseAlpha = (Math.sin(time * 3) + 1) * 0.3 + 0.4;
    ctx.fillStyle = `rgba(0, 255, 170, ${pulseAlpha})`;
    ctx.fillRect(viewportWidth / 2 - buttonWidth / 2, buttonY, buttonWidth, buttonHeight);
    
    ctx.strokeStyle = '#00ffaa';
    ctx.lineWidth = Math.max(2, buttonWidth * 0.008);
    ctx.strokeRect(viewportWidth / 2 - buttonWidth / 2, buttonY, buttonWidth, buttonHeight);
    
    ctx.fillStyle = '#000000';
    ctx.font = `bold ${buttonSize}px Arial`;
    ctx.fillText('TAP TO START', viewportWidth / 2, buttonY + buttonHeight / 2 + buttonSize / 3);
    
    // High score display with responsive positioning - larger text
    const gameState = gameStateRef.current;
    if (gameState && gameState.highScore > 0) {
      ctx.fillStyle = '#ffd700';
      const highScoreSize = isMobile ? Math.max(14, buttonSize * 0.8) : Math.max(12, buttonSize * 0.7);
      ctx.font = `bold ${highScoreSize}px Arial`;
      const highScoreY = buttonY + buttonHeight + (isMobile ? 25 : 20);
      ctx.fillText(`🏆 High Score: ${gameState.highScore.toLocaleString()}`, viewportWidth / 2, highScoreY);
    }
  };

  const drawPauseScreen = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Pause title
    ctx.fillStyle = '#4ecdc4';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#4ecdc4';
    ctx.shadowBlur = 15;
    ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2 - 40);
    ctx.shadowBlur = 0;
    
    // Instructions
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px Arial';
    ctx.fillText('Press P or Click to Resume', canvas.width / 2, canvas.height / 2 + 20);
  };  const drawGameOverScreen = (ctx: CanvasRenderingContext2D, gameState: GameState, canvas: HTMLCanvasElement, isGeneratingShare: boolean = false) => {
    // Dark overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.95)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Responsive sizing based on viewport dimensions - MUCH larger minimum sizes
    const viewportWidth = canvas.width;
    const viewportHeight = canvas.height;
    const isSmallScreen = viewportWidth < 768;
    const isTinyScreen = viewportWidth < 480;
    
    // DRAMATICALLY increased minimum font sizes for mobile readability - same as intro
    const titleSize = isMobile ? Math.max(32, Math.min(viewportWidth * 0.1, 44)) : Math.max(40, Math.min(viewportWidth * 0.08, 56));
    const subtitleSize = isMobile ? Math.max(20, Math.min(viewportWidth * 0.06, 32)) : Math.max(24, Math.min(viewportWidth * 0.04, 28));
    const textSize = isMobile ? Math.max(16, Math.min(viewportWidth * 0.04, 22)) : Math.max(16, Math.min(viewportWidth * 0.025, 20));
    const buttonTextSize = isMobile ? Math.max(14, Math.min(viewportWidth * 0.035, 20)) : Math.max(12, Math.min(viewportWidth * 0.022, 18));
    const instructionSize = isMobile ? Math.max(12, Math.min(viewportWidth * 0.03, 18)) : Math.max(10, Math.min(viewportWidth * 0.02, 16));
    
    // Game Over title with pulsing effect - fully responsive
    const pulse = Math.sin(Date.now() * 0.005) * 0.3 + 0.7;
    ctx.shadowColor = '#ff0000';
    ctx.shadowBlur = Math.max(10, titleSize * 0.3) * pulse;
    ctx.fillStyle = '#ff0000';
    ctx.font = `bold ${titleSize}px Arial`;
    ctx.textAlign = 'center';
    
    // Responsive positioning - more space on mobile
    const titleY = isMobile ? Math.max(60, viewportHeight * 0.12) : Math.max(80, viewportHeight * 0.15);
    ctx.fillText('GAME OVER', viewportWidth / 2, titleY);
    
    // Stats section - responsive layout with better spacing
    const statsStartY = titleY + (isMobile ? Math.max(35, titleSize * 0.9) : Math.max(40, titleSize * 0.8));
    
    // Final score - prominent display with responsive spacing
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#00ffaa';
    ctx.font = `bold ${subtitleSize}px Arial`;
    ctx.fillText(`SCORE: ${gameState.player.score.toLocaleString()}`, viewportWidth / 2, statsStartY);
    
    // Responsive stats layout with much better spacing
    ctx.fillStyle = '#ffffff';
    ctx.font = `${textSize}px Arial`;
    const lineSpacing = isMobile ? Math.max(24, textSize * 1.8) : Math.max(18, textSize * 1.5);
    let currentY = statsStartY + (isMobile ? Math.max(35, subtitleSize * 1.4) : Math.max(30, subtitleSize * 1.2));
      if (isMobile) {
      // Compact mobile stats with better spacing and larger text
      const endTime = gameState.stats.gameEndTime || Date.now();
      const gameTime = Math.floor((endTime - gameState.stats.gameStartTime) / 1000);
      const minutes = Math.floor(gameTime / 60);
      const seconds = gameTime % 60;
      
      const mobileStats = isTinyScreen ? [
        `🏆 Level ${gameState.player.level}`,
        `💀 ${gameState.stats.enemiesKilled} Enemies`, 
        `⚡ ${gameState.stats.powerUpsCollected} Power-ups`,
        `⏱️ ${minutes}:${seconds.toString().padStart(2, '0')}`
      ] : [
        `🏆 Level Reached: ${gameState.player.level}`,
        `💀 Enemies Defeated: ${gameState.stats.enemiesKilled}`,
        `⚡ Power-ups Collected: ${gameState.stats.powerUpsCollected}`,
        `⏱️ Time Survived: ${minutes}:${seconds.toString().padStart(2, '0')}`
      ];
      
      mobileStats.forEach((stat, index) => {
        ctx.fillText(stat, viewportWidth / 2, currentY + (index * lineSpacing));
      });
      
      currentY += mobileStats.length * lineSpacing;    } else {
      // Desktop stats with responsive spacing
      ctx.fillText(`Level Reached: ${gameState.player.level}`, viewportWidth / 2, currentY);
      currentY += lineSpacing;
      ctx.fillText(`Enemies Defeated: ${gameState.stats.enemiesKilled}`, viewportWidth / 2, currentY);
      currentY += lineSpacing;
      ctx.fillText(`Power-ups Collected: ${gameState.stats.powerUpsCollected}`, viewportWidth / 2, currentY);
      
      const endTime = gameState.stats.gameEndTime || Date.now();
      const gameTime = Math.floor((endTime - gameState.stats.gameStartTime) / 1000);
      const minutes = Math.floor(gameTime / 60);
      const seconds = gameTime % 60;
      currentY += lineSpacing;
      ctx.fillText(`Time Survived: ${minutes}:${seconds.toString().padStart(2, '0')}`, viewportWidth / 2, currentY);
    }
    
    // High score notification with responsive font size
    if (gameState.player.score === gameState.highScore && gameState.player.score > 0) {
      ctx.fillStyle = '#ffd700';
      ctx.font = `bold ${Math.max(textSize * 0.9, 14)}px Arial`;
      ctx.shadowColor = '#ffd700';
      ctx.shadowBlur = Math.max(8, textSize * 0.6);
      const highScoreText = isMobile ? '🎉 NEW HIGH SCORE!' : '🎉 NEW HIGH SCORE! 🎉';
      ctx.fillText(highScoreText, viewportWidth / 2, currentY + lineSpacing + Math.max(12, textSize * 0.8));
      ctx.shadowBlur = 0;
    }
    
    // Responsive button layout - MUCH larger touch targets for mobile
    const buttonAreaY = Math.max(currentY + lineSpacing * 2.5, viewportHeight * 0.65);
    const buttonWidth = isMobile ? Math.min(Math.max(200, viewportWidth * 0.5), 280) : Math.min(Math.max(120, viewportWidth * 0.25), 250);
    const buttonHeight = isMobile ? Math.max(50, Math.min(viewportHeight * 0.08, 70)) : Math.max(35, Math.min(viewportHeight * 0.06, 60));
    const buttonSpacing = isMobile ? Math.max(20, buttonHeight * 0.4) : Math.max(12, buttonHeight * 0.3);
    
    // Always stack vertically on mobile for better touch targets
    if (isMobile) {
      // Mobile: Vertical stack with larger touch targets
      const playButtonY = buttonAreaY;
      const shareButtonY = playButtonY + buttonHeight + buttonSpacing;
      
      // Play again button (primary action) - larger and more prominent
      ctx.fillStyle = '#00ff88';
      ctx.fillRect(viewportWidth / 2 - buttonWidth / 2, playButtonY, buttonWidth, buttonHeight);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.strokeRect(viewportWidth / 2 - buttonWidth / 2, playButtonY, buttonWidth, buttonHeight);
      
      ctx.fillStyle = '#000000';
      ctx.font = `bold ${buttonTextSize}px Arial`;
      ctx.fillText('🎮 PLAY AGAIN', viewportWidth / 2, playButtonY + buttonHeight / 2 + buttonTextSize / 3);
        // Share button (secondary action) - clearly defined touch area
      ctx.fillStyle = isGeneratingShare ? '#666666' : '#00aaff';
      ctx.fillRect(viewportWidth / 2 - buttonWidth / 2, shareButtonY, buttonWidth, buttonHeight);
      ctx.strokeStyle = isGeneratingShare ? '#888888' : '#ffffff';
      ctx.lineWidth = 3;
      ctx.strokeRect(viewportWidth / 2 - buttonWidth / 2, shareButtonY, buttonWidth, buttonHeight);
      
      ctx.fillStyle = isGeneratingShare ? '#999999' : '#ffffff';
      const shareText = isGeneratingShare ? '⏳ GENERATING...' : '📤 SHARE SCORE';
      ctx.fillText(shareText, viewportWidth / 2, shareButtonY + buttonHeight / 2 + buttonTextSize / 3);
      
      // Clear instructions for mobile - larger text
      ctx.fillStyle = '#bbbbbb';
      ctx.font = `${instructionSize}px Arial`;
      const instructionY = shareButtonY + buttonHeight + Math.max(25, buttonHeight * 0.5);
      ctx.fillText('Tap the buttons above', viewportWidth / 2, instructionY);
    } else {
      // Desktop: Side by side layout
      const buttonY = buttonAreaY;
        // Share button (left)
      ctx.fillStyle = isGeneratingShare ? '#666666' : '#00aaff';
      ctx.fillRect(viewportWidth / 2 - buttonWidth - 10, buttonY, buttonWidth, buttonHeight);
      ctx.strokeStyle = isGeneratingShare ? '#888888' : '#ffffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(viewportWidth / 2 - buttonWidth - 10, buttonY, buttonWidth, buttonHeight);
      
      ctx.fillStyle = isGeneratingShare ? '#999999' : '#ffffff';
      ctx.font = `bold ${buttonTextSize}px Arial`;
      const shareText = isGeneratingShare ? '⏳ GENERATING...' : '📤 SHARE SCORE';
      ctx.fillText(shareText, viewportWidth / 2 - buttonWidth / 2 - 10, buttonY + buttonHeight / 2 + buttonTextSize / 3);
      
      // Play again button (right)
      ctx.fillStyle = '#00ff88';
      ctx.fillRect(viewportWidth / 2 + 10, buttonY, buttonWidth, buttonHeight);
      ctx.strokeRect(viewportWidth / 2 + 10, buttonY, buttonWidth, buttonHeight);
      
      ctx.fillStyle = '#000000';
      ctx.fillText('🎮 PLAY AGAIN', viewportWidth / 2 + buttonWidth / 2 + 10, buttonY + buttonHeight / 2 + buttonTextSize / 3);
      
      // Instructions for desktop
      ctx.fillStyle = '#888888';
      ctx.font = `${instructionSize}px Arial`;
      ctx.fillText('Click the buttons above or press SPACE to restart', viewportWidth / 2, buttonY + buttonHeight + Math.max(25, buttonHeight * 0.5));
    }
  };const generateShareImage = useCallback((gameState: GameState) => {
    const shareCanvas = shareCanvasRef.current;
    if (!shareCanvas) return null;
    
    shareCanvas.width = 600;
    shareCanvas.height = 600;
    const ctx = shareCanvas.getContext('2d')!;
    
    // Enhanced background with gradient and stars
    const gradient = ctx.createRadialGradient(300, 300, 0, 300, 300, 400);
    gradient.addColorStop(0, '#0a0a2e');
    gradient.addColorStop(0.5, '#16213e');
    gradient.addColorStop(1, '#000000');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 600, 600);
    
    // Add some stars
    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2})`;
      ctx.beginPath();
      ctx.arc(Math.random() * 600, Math.random() * 600, Math.random() * 2 + 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Title with glow
    ctx.shadowColor = '#00ffaa';
    ctx.shadowBlur = 20;
    ctx.fillStyle = '#00ffaa';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🚀 SPACE SHOOTER 🚀', 300, 120);
    
    // Score highlight box
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(0, 255, 170, 0.2)';
    ctx.fillRect(150, 180, 300, 120);
    ctx.strokeStyle = '#00ffaa';
    ctx.lineWidth = 3;
    ctx.strokeRect(150, 180, 300, 120);
    
    // Score
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 56px Arial';
    ctx.fillText(gameState.player.score.toLocaleString(), 300, 230);
    
    ctx.fillStyle = '#00ffaa';
    ctx.font = 'bold 24px Arial';
    ctx.fillText('FINAL SCORE', 300, 280);
    
    // Stats section
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px Arial';
    ctx.fillText(`🏆 Level Reached: ${gameState.player.level}`, 300, 340);
    ctx.fillText(`💀 Enemies Defeated: ${gameState.stats.enemiesKilled}`, 300, 370);
    ctx.fillText(`⚡ Power-ups Collected: ${gameState.stats.powerUpsCollected}`, 300, 400);
      // Time played
    const endTime = gameState.stats.gameEndTime || Date.now();
    const gameTime = Math.floor((endTime - gameState.stats.gameStartTime) / 1000);
    const minutes = Math.floor(gameTime / 60);
    const seconds = gameTime % 60;
    ctx.fillText(`⏱️ Time Survived: ${minutes}:${seconds.toString().padStart(2, '0')}`, 300, 430);
    
    // High score badge
    if (gameState.player.score === gameState.highScore) {
      ctx.fillStyle = '#ffd700';
      ctx.font = 'bold 28px Arial';
      ctx.fillText('🎉 NEW HIGH SCORE! 🎉', 300, 480);
    }
    
    // Footer
    ctx.fillStyle = '#888888';
    ctx.font = '16px Arial';
    ctx.fillText('Can you beat this score?', 300, 530);
    ctx.fillText('Play at Innovacion Portal', 300, 550);
      return shareCanvas.toDataURL('image/png');
  }, []);
  const shareScore = useCallback(async (gameState: GameState) => {
    setIsGeneratingShareImage(true);
    
    try {
      const shareImageData = generateShareImage(gameState);
      const shareText = `🚀 I just scored ${gameState.player.score.toLocaleString()} points in Space Shooter! 🎮\n\n🏆 Level: ${gameState.player.level}\n💀 Enemies: ${gameState.stats.enemiesKilled}\n⚡ Power-ups: ${gameState.stats.powerUpsCollected}\n\nCan you beat my score? 🔥`;
      
      if (navigator.share && navigator.canShare) {
        try {
          // Convert data URL to blob for sharing
          const response = await fetch(shareImageData!);
          const blob = await response.blob();
          const file = new File([blob], 'space-shooter-score.png', { type: 'image/png' });
          
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: 'Space Shooter High Score',
              text: shareText,
              files: [file],
              url: window.location.href
            });
          } else {
            await navigator.share({
              title: 'Space Shooter High Score',
              text: shareText,
              url: window.location.href
            });
          }
          toast.success('Score shared successfully!');
        } catch (error) {
          console.error('Error sharing:', error);
          fallbackShare(shareImageData!, shareText);
        }
      } else {
        fallbackShare(shareImageData!, shareText);
      }
    } finally {
      setIsGeneratingShareImage(false);
    }
  }, [generateShareImage]);

  const fallbackShare = (imageData: string, text: string) => {
    // Create a temporary link to download the image
    const link = document.createElement('a');
    link.download = 'space-shooter-score.png';
    link.href = imageData;
    
    // Copy text to clipboard
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Score copied to clipboard! Image download started.');
      link.click();
    }).catch(() => {
      toast.success('Image download started! Share your score manually.');
      link.click();
    });
  };

  const render = (ctx: CanvasRenderingContext2D, gameState: GameState, canvas: HTMLCanvasElement) => {
    // Reset transformation
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    
    // Apply screen shake
    if (gameState.screenShake.intensity > 0 && !gameState.gamePaused && !gameState.gameOver) {
      const shakeX = (Math.random() - 0.5) * gameState.screenShake.intensity;
      const shakeY = (Math.random() - 0.5) * gameState.screenShake.intensity;
      ctx.translate(shakeX, shakeY);
    }
    
    // Draw background
    drawBackground(ctx, gameState, canvas);
    
    if (gameState.gameState === 'intro') {
      drawIntroScreen(ctx, canvas);
    } else if (gameState.gameState === 'playing') {
      // Draw game objects
      drawPlayer(ctx, gameState.player);
      gameState.enemies.forEach(enemy => drawEnemy(ctx, enemy));
      gameState.bullets.forEach(bullet => drawBullet(ctx, bullet));
      gameState.powerUps.forEach(powerUp => drawPowerUp(ctx, powerUp));
      gameState.particles.forEach(particle => drawParticle(ctx, particle));
      drawUI(ctx, gameState, canvas);
    } else if (gameState.gameState === 'paused') {
      // Draw game objects first
      drawPlayer(ctx, gameState.player);
      gameState.enemies.forEach(enemy => drawEnemy(ctx, enemy));
      gameState.bullets.forEach(bullet => drawBullet(ctx, bullet));
      gameState.powerUps.forEach(powerUp => drawPowerUp(ctx, powerUp));
      gameState.particles.forEach(particle => drawParticle(ctx, particle));
      drawUI(ctx, gameState, canvas);
      
      // Reset transform for pause overlay
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      drawPauseScreen(ctx, canvas);    } else if (gameState.gameState === 'gameOver') {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      drawGameOverScreen(ctx, gameState, canvas, isGeneratingShareImage);
    }
    
    // Reset transform
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  };

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const gameState = initializeGame();
    if (!gameState) return;
    
    gameStateRef.current = gameState;
    
    // Event handlers
    const handleKeyDown = (e: KeyboardEvent) => {
      gameState.keys.add(e.key.toLowerCase());
      
      if (gameState.gameState === 'intro' && e.key === ' ') {
        gameState.gameState = 'playing';
        gameState.stats.gameStartTime = Date.now();
      } else if (gameState.gameState === 'playing' && e.key.toLowerCase() === 'p') {
        gameState.gameState = 'paused';
        gameState.gamePaused = true;
      } else if (gameState.gameState === 'paused' && e.key.toLowerCase() === 'p') {
        gameState.gameState = 'playing';
        gameState.gamePaused = false;
      } else if (gameState.gameState === 'gameOver' && e.key === ' ') {
        // Restart game
        const newGameState = initializeGame();
        if (newGameState) {
          Object.assign(gameState, newGameState);
          gameState.highScore = Math.max(gameState.highScore, newGameState.highScore);
        }
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      gameState.keys.delete(e.key.toLowerCase());
    };      const handleClick = (e: MouseEvent) => {
      if (gameState.gameState === 'intro') {
        gameState.gameState = 'playing';
        gameState.stats.gameStartTime = Date.now();
      } else if (gameState.gameState === 'paused') {
        gameState.gameState = 'playing';
        gameState.gamePaused = false;      } else if (gameState.gameState === 'gameOver') {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Get responsive button dimensions and positions from game over screen
        const viewportWidth = canvas.width;
        const viewportHeight = canvas.height;
        
        // Use the EXACT same calculations as in drawGameOverScreen
        const titleSize = isMobile ? Math.max(32, Math.min(viewportWidth * 0.1, 44)) : Math.max(40, Math.min(viewportWidth * 0.08, 56));
        const subtitleSize = isMobile ? Math.max(20, Math.min(viewportWidth * 0.06, 32)) : Math.max(24, Math.min(viewportWidth * 0.04, 28));
        const textSize = isMobile ? Math.max(16, Math.min(viewportWidth * 0.04, 22)) : Math.max(16, Math.min(viewportWidth * 0.025, 20));
        const lineSpacing = isMobile ? Math.max(24, textSize * 1.8) : Math.max(18, textSize * 1.5);
        
        const titleY = isMobile ? Math.max(60, viewportHeight * 0.12) : Math.max(80, viewportHeight * 0.15);
        const statsStartY = titleY + (isMobile ? Math.max(35, titleSize * 0.9) : Math.max(40, titleSize * 0.8));
        let currentY = statsStartY + (isMobile ? Math.max(35, subtitleSize * 1.4) : Math.max(30, subtitleSize * 1.2));
        
        // Add the stats lines to get the actual currentY
        if (isMobile) {
          const mobileStats = viewportWidth < 480 ? 4 : 4; // 4 lines of stats
          currentY += mobileStats * lineSpacing;
        } else {
          currentY += 4 * lineSpacing; // 4 lines of stats on desktop
        }
        
        const buttonAreaY = Math.max(currentY + lineSpacing * 2.5, viewportHeight * 0.65);        const buttonWidth = isMobile ? Math.min(Math.max(200, viewportWidth * 0.5), 280) : Math.min(Math.max(120, viewportWidth * 0.25), 250);
        const buttonHeight = isMobile ? Math.max(50, Math.min(viewportHeight * 0.08, 70)) : Math.max(35, Math.min(viewportHeight * 0.06, 60));
        const buttonSpacing = isMobile ? Math.max(20, buttonHeight * 0.4) : Math.max(12, buttonHeight * 0.3);
        
        if (isMobile) {
          // Mobile: Vertical stack layout - ONLY buttons work, no "tap anywhere"
          const playButtonY = buttonAreaY;
          const shareButtonY = playButtonY + buttonHeight + buttonSpacing;
          
          // Check if clicked on play again button (top button)
          if (x >= viewportWidth / 2 - buttonWidth / 2 && 
              x <= viewportWidth / 2 + buttonWidth / 2 &&
              y >= playButtonY && 
              y <= playButtonY + buttonHeight) {
            // Restart game
            const newGameState = initializeGame();
            if (newGameState) {
              Object.assign(gameState, newGameState);
              gameState.highScore = Math.max(gameState.highScore, newGameState.highScore);
            }
          }          // Check if clicked on share button (bottom button)
          else if (x >= viewportWidth / 2 - buttonWidth / 2 && 
                   x <= viewportWidth / 2 + buttonWidth / 2 &&
                   y >= shareButtonY && 
                   y <= shareButtonY + buttonHeight) {
            if (!isGeneratingShareImage) {
              shareScore(gameState);
            }
          }
          // Mobile: NO "tap anywhere" functionality - REMOVED completely
        } else {
          // Desktop: Side by side layout
          const buttonY = buttonAreaY;
            // Check if clicked on share button (left)
          if (x >= viewportWidth / 2 - buttonWidth - 10 && 
              x <= viewportWidth / 2 - 10 &&
              y >= buttonY && 
              y <= buttonY + buttonHeight) {
            if (!isGeneratingShareImage) {
              shareScore(gameState);
            }
          }
          // Check if clicked on play again button (right)
          else if (x >= viewportWidth / 2 + 10 && 
                   x <= viewportWidth / 2 + buttonWidth + 10 &&
                   y >= buttonY && 
                   y <= buttonY + buttonHeight) {
            // Restart game
            const newGameState = initializeGame();
            if (newGameState) {
              Object.assign(gameState, newGameState);
              gameState.highScore = Math.max(gameState.highScore, newGameState.highScore);
            }
          }
          // Desktop: Allow "click anywhere else" to restart as before
          else {
            const newGameState = initializeGame();
            if (newGameState) {
              Object.assign(gameState, newGameState);
              gameState.highScore = Math.max(gameState.highScore, newGameState.highScore);
            }
          }
        }
      }
    };
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('click', handleClick);
    window.addEventListener('resize', handleResize);    // Game loop
    let lastFrameTime = 0;
    let fpsCounter = 0;
    let lastFpsTime = 0;
    let currentFps = 60;
    const targetFPS = 60;
    const targetFrameTime = 1000 / targetFPS;
    
    const gameLoop = (currentTime: number) => {
      if (!gameState.gameRunning) return;
      
      // FPS calculation
      fpsCounter++;
      if (currentTime - lastFpsTime >= 1000) {
        currentFps = fpsCounter;
        fpsCounter = 0;
        lastFpsTime = currentTime;
      }
      
      let deltaTime = targetFrameTime; // Default to target frame time
      if (lastFrameTime !== 0) {
        deltaTime = currentTime - lastFrameTime;
      }
      deltaTime = Math.min(deltaTime, 50); // Cap at 50ms to prevent huge jumps
      
      lastFrameTime = currentTime;
      
      if (gameState.gameState === 'playing' && !gameState.gamePaused && !gameState.gameOver) {
        updateGame(gameState, deltaTime);
      }
      
      render(ctx, gameState, canvas);
      
      animationIdRef.current = requestAnimationFrame(gameLoop);
    };
    
    gameLoop(performance.now());
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [initializeGame, isMobile]);  // Touch controls for mobile - simplified for testing
  const touchTargetRef = useRef({ x: 0, y: 0 });  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const gameState = gameStateRef.current;
    if (!gameState) return;

    // Get touch coordinates
    const touch = e.touches[0];
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    // Only handle firing during actual gameplay - ignore intro/gameOver/paused
    if (gameState.gameState === 'playing') {
      // Set touch target for movement
      touchTargetRef.current = { x, y };
      
      // Activate shooting
      setControls(prev => ({ ...prev, shoot: true }));
    }
  }, []);  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const gameState = gameStateRef.current;
    if (!gameState || gameState.gameState !== 'playing') return;
    
    // Get touch coordinates
    const touch = e.touches[0];
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    // Update touch target for movement
    touchTargetRef.current = { x, y };
    
    // Keep shooting during touch move
    setControls(prev => ({ ...prev, shoot: true }));
  }, []);  const handleTouchEnd = useCallback(() => {
    const gameState = gameStateRef.current;
    if (!gameState || gameState.gameState !== 'playing') return;
    
    // Reset touch target
    touchTargetRef.current = { x: 0, y: 0 };
    
    // Stop shooting when touch ends
    setControls(prev => ({ ...prev, shoot: false }));
  }, []);
  // Fallback click handler for testing
  const handleClick = useCallback((e: React.MouseEvent) => {
    const gameState = gameStateRef.current;
    if (!gameState) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Simulate touch behavior for testing
    touchTargetRef.current = { x, y };
    setControls(prev => ({ ...prev, shoot: true }));
    
    // Auto-stop after a short time for click testing
    setTimeout(() => {
      setControls(prev => ({ ...prev, shoot: false }));
      touchTargetRef.current = { x: 0, y: 0 };
    }, 100);
  }, []);return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-black z-50">      <canvas
        ref={canvasRef}
        className="block w-full h-full"
        style={{ 
          background: 'radial-gradient(ellipse at center, #0a0a2e 0%, #16213e 50%, #0f0f23 100%)',
          cursor: 'crosshair',
          touchAction: 'none',
          userSelect: 'none'
        }}        onTouchStart={gameStateRef.current?.gameState === 'playing' ? handleTouchStart : undefined}
        onTouchMove={gameStateRef.current?.gameState === 'playing' ? handleTouchMove : undefined}
        onTouchEnd={gameStateRef.current?.gameState === 'playing' ? handleTouchEnd : undefined}
        onClick={handleClick}
      />
      
      {/* Hidden canvas for share functionality */}
      <canvas
        ref={shareCanvasRef}
        style={{ display: 'none' }}
      />
        {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold transition-colors"
      >
        ✕ Close
      </button>

      {/* Share Image Generation Loading Overlay */}
      {isGeneratingShareImage && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[var(--space-black)]/95 border border-[var(--neon-cyan)] rounded-xl p-8 text-center">
            <div className="mb-4">
              <div className="w-16 h-16 border-4 border-t-[var(--neon-cyan)] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
            </div>
            <h3 className="text-[var(--neon-cyan)] font-orbitron font-bold text-xl mb-2">
              Generating Share Image
            </h3>
            <p className="text-[var(--steel-gray)] text-sm">
              Creating your high score image...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
