import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { toast } from 'sonner';
import { PowerUp, ActivePowerUp, getRandomPowerUp } from '../services/PowerUps';

interface GameState {
  player: {
    x: number;
    y: number;
    health: number;
    maxHealth: number;
    energy: number;
    maxEnergy: number;
    score: number;
    speed: number;
    weapons: Array<{
      name: string;
      damage: number;
      fireRate: number;
      energyCost: number;
      color: string;
    }>;
    currentWeapon: number;
    shield: number;
    isInvincible: boolean;
    invincibilityEnd: number;
    thrusterEffect: number;
  };
  enemies: Array<{
    x: number;
    y: number;
    health: number;
    speed: number;
    type: string;
    lastShot: number;
    rotation: number;
    explosionTime?: number;
  }>;
  gamePaused: boolean;
  projectiles: Array<{
    x: number;
    y: number;
    dx: number;
    dy: number;
    damage: number;
    owner: 'player' | 'enemy';
    color: string;
    trail: Array<{x: number, y: number, alpha: number}>;
    glowSize: number;
  }>;
  particles: Array<{
    x: number;
    y: number;
    dx: number;
    dy: number;
    life: number;
    color: string;
    size: number;
    type: 'explosion' | 'thruster' | 'spark' | 'debris';
  }>;
  powerUps: Array<{
    x: number;
    y: number;
    powerUp: PowerUp;
    collected: boolean;
    pulsePhase: number;
    floatOffset: number;
  }>;
  activePowerUps: ActivePowerUp[];
  stars: Array<{
    x: number;
    y: number;
    speed: number;
    brightness: number;
    size: number;
    twinkle: number;
  }>;
  nebula: Array<{
    x: number;
    y: number;
    size: number;
    color: string;
    alpha: number;
    drift: number;
  }>;
  screenShake: {
    intensity: number;
    duration: number;
    remaining: number;
  };
  gameRunning: boolean;
  gameOver: boolean;
  gameStats: {
    enemiesKilled: number;
    bossesDefeated: number;
    powerUpsCollected: number;
    shotsFired: number;
    damageDealt: number;
    gameStartTime: number;
  };
  lastEnemySpawn: number;
  lastBossSpawn: number;
  lastPowerUpSpawn: number;
  keys: Set<string>;
  backgroundOffset: number;
}

export interface GameEngineHandle {
  destroy: () => void;
}

export const GameEngine = forwardRef<GameEngineHandle>((props, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameStateRef = useRef<GameState>();
  const animationIdRef = useRef<number>();

  useImperativeHandle(ref, () => ({
    destroy: () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (gameStateRef.current) {
        gameStateRef.current.gameRunning = false;
      }
    }
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Initialize enhanced game state
    const gameState: GameState = {
      player: {
        x: canvas.width / 2,
        y: canvas.height - 100,
        health: 100,
        maxHealth: 100,
        energy: 100,
        maxEnergy: 100,
        score: 0,
        level: 1,
        speed: 6,
        weapons: [{
          name: "Photon Cannons",
          damage: 35,
          fireRate: 150,
          energyCost: 8,
          color: "#00aaff"
        }],
        currentWeapon: 0,
        shield: 0,
        isInvincible: false,
        invincibilityEnd: 0,
        thrusterEffect: 0
      },
      enemies: [],
      projectiles: [],
      particles: [],
      powerUps: [],
      activePowerUps: [],
      stars: [],
      nebula: [],
      screenShake: { intensity: 0, duration: 0, remaining: 0 },
      gameRunning: true,
      gameOver: false,
      gamePaused: false,
      gameStats: {
        enemiesKilled: 0,
        bossesDefeated: 0,
        powerUpsCollected: 0,
        shotsFired: 0,
        damageDealt: 0,
        gameStartTime: Date.now()
      },
      lastEnemySpawn: 0,
      lastPowerUpSpawn: 0,
      keys: new Set(),
      backgroundOffset: 0
    };

    gameStateRef.current = gameState;

    // Initialize enhanced starfield
    for (let i = 0; i < 300; i++) {
      gameState.stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: Math.random() * 4 + 1,
        brightness: Math.random() * 0.9 + 0.1,
        size: Math.random() * 2 + 0.5,
        twinkle: Math.random() * Math.PI * 2
      });
    }

    // Initialize nebula clouds
    for (let i = 0; i < 8; i++) {
      gameState.nebula.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 200 + 100,
        color: ['#ff00ff', '#00ffff', '#ff8800', '#8800ff'][Math.floor(Math.random() * 4)],
        alpha: Math.random() * 0.1 + 0.05,
        drift: Math.random() * 0.5 + 0.2
      });
    }

    // Event listeners
    const handleKeyDown = (e: KeyboardEvent) => {
      gameState.keys.add(e.key.toLowerCase());
      
      // Game restart functionality - works only when game is over
      if (gameState.gameOver && (e.key.toLowerCase() === 'r')) {
        e.preventDefault(); // Prevent any default browser behavior
        restartGame(gameState, canvas);
        return;
      }
      
      // Add pause functionality - works only when game is not over
      if (!gameState.gameOver && (e.key.toLowerCase() === 'p' || e.key.toLowerCase() === 'escape')) {
        e.preventDefault(); // Prevent any default browser behavior
        togglePause(gameState);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      gameState.keys.delete(e.key.toLowerCase());
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('resize', handleResize);

    // Game loop
    const gameLoop = (currentTime: number) => {
      if (!gameState.gameRunning) return;

      // For the first frame, use a static delta to avoid large jumps
      let deltaTime = 16; // ~60fps
      
      // For subsequent frames, calculate actual delta
      if (lastFrameTime !== 0) {
        deltaTime = currentTime - lastFrameTime;
      }
      
      // Cap delta time to prevent large jumps after tab switching or inactivity
      deltaTime = Math.min(deltaTime, 100);
      
      // Store current time for next frame
      lastFrameTime = currentTime;

      if (!gameState.gameOver && !gameState.gamePaused) {
        update(gameState, deltaTime, canvas);
      }
      render(ctx, gameState, canvas);

      animationIdRef.current = requestAnimationFrame(gameLoop);
    };

    let lastFrameTime = 0;
    gameLoop(performance.now());
    generateInitialContent(gameState);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []);

  const restartGame = (gameState: GameState, canvas: HTMLCanvasElement) => {
    // Cancel any existing animation frame
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = undefined;
    }

    // Reset game state
    gameState.gameOver = false;
    gameState.gameRunning = true;
    gameState.gamePaused = false;
    gameState.player.health = gameState.player.maxHealth;
    gameState.player.energy = gameState.player.maxEnergy;  // Reset energy too
    gameState.player.x = canvas.width / 2;
    gameState.player.y = canvas.height - 100;
    gameState.player.score = 0;
    gameState.player.shield = 0;
    gameState.player.isInvincible = false;
    gameState.enemies = [];
    gameState.projectiles = [];
    gameState.particles = [];
    gameState.powerUps = [];
    gameState.activePowerUps = [];
    gameState.gameStats = {
      enemiesKilled: 0,
      bossesDefeated: 0,
      powerUpsCollected: 0,
      shotsFired: 0,
      damageDealt: 0,
      gameStartTime: Date.now()
    };
    gameState.lastEnemySpawn = Date.now();
    gameState.lastPowerUpSpawn = Date.now();
    
    // Restart the animation loop
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Reuse the same game loop logic for consistency
      let restartLastFrameTime = 0;
      
      const gameLoop = (currentTime: number) => {
        if (!gameState.gameRunning) return;
        
        // For the first frame, use a static delta to avoid large jumps
        let deltaTime = 16; // ~60fps
        
        // For subsequent frames, calculate actual delta
        if (restartLastFrameTime !== 0) {
          deltaTime = currentTime - restartLastFrameTime;
        }
        
        // Cap delta time to prevent large jumps
        deltaTime = Math.min(deltaTime, 100);
        
        // Store current time for next frame
        restartLastFrameTime = currentTime;
        
        if (!gameState.gameOver && !gameState.gamePaused) {
          update(gameState, deltaTime, canvas);
        }
        render(ctx, gameState, canvas);
        
        // Set the next animation frame
        animationIdRef.current = requestAnimationFrame(gameLoop);
      };
      
      // Start the game loop
      gameLoop(performance.now());
    }
    
    toast.success('🚀 MISSION RESTARTED! Welcome back, Commander!', {
      position: 'top-center',
      duration: 3000,
    });
  };

  const togglePause = (gameState: GameState) => {
    // Only allow pausing when game is running and not over
    if (!gameState.gameOver) {
      gameState.gamePaused = !gameState.gamePaused;
      
      if (gameState.gamePaused) {
        // Reset screen shake when pausing
        gameState.screenShake = {
          intensity: 0,
          duration: 0,
          remaining: 0
        };
        
        toast.info(`⏸️ GAME PAUSED`, {
          position: 'top-center',
          duration: 1500,
        });
      } else {
        toast.info(`▶️ GAME RESUMED`, {
          position: 'top-center', 
          duration: 1500,
        });
      }
    }
  };

  const drawPauseOverlay = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Pause title
    ctx.fillStyle = '#4ecdc4';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.shadowColor = '#4ecdc4';
    ctx.shadowBlur = 15;
    ctx.fillText('GAME PAUSED', canvas.width / 2, canvas.height / 2 - 40);
    ctx.shadowBlur = 0;
    
    // Instructions
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px Arial';
    ctx.fillText('Press P or ESC to Resume', canvas.width / 2, canvas.height / 2 + 20);
    
    // Controls reminder
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '18px Arial';
    ctx.fillText('WASD/Arrows: Move', canvas.width / 2, canvas.height / 2 + 80);
    ctx.fillText('SPACE: Fire Weapons', canvas.width / 2, canvas.height / 2 + 110);
    ctx.fillText('Q: Switch Weapons', canvas.width / 2, canvas.height / 2 + 140);
    ctx.fillText('R: Restart When Game Over', canvas.width / 2, canvas.height / 2 + 170);
  };

  const generateInitialContent = async (gameState: GameState) => {
    try {
      setTimeout(async () => {
        const newWeapon = await AIService.generateWeapon(gameState.player.level, []);
        gameState.player.weapons.push(newWeapon);
        toast.success(`🎉 NEW WEAPON: ${newWeapon.name}!`, {
          position: 'top-center',
          duration: 3000,
          style: {
            background: 'rgba(0, 0, 0, 0.9)',
            border: '2px solid #00ffaa',
            color: '#00ffaa',
            fontSize: '16px',
            fontWeight: 'bold'
          }
        });
      }, 3000);

      const environment = await AIService.generateEnvironment({ level: 1, score: 0 });
      toast.info(`🌌 MISSION: ${environment.storyElements[0]}`, {
        position: 'top-center',
        duration: 4000,
        style: {
          background: 'rgba(0, 0, 0, 0.9)',
          border: '2px solid #4ecdc4',
          color: '#4ecdc4',
          fontSize: '14px'
        }
      });
    } catch (error) {
      console.log('AI content generation will use fallbacks');
    }
  };

  const update = (gameState: GameState, deltaTime: number, canvas: HTMLCanvasElement) => {
    // Update screen shake
    if (gameState.screenShake.remaining > 0) {
      gameState.screenShake.remaining -= deltaTime;
      if (gameState.screenShake.remaining <= 0) {
        gameState.screenShake.intensity = 0;
      }
    }

    updatePlayer(gameState, deltaTime);
    updateEnemies(gameState, deltaTime);
    updateBoss(gameState, deltaTime);
    updateProjectiles(gameState, deltaTime);
    updateParticles(gameState, deltaTime);
    updatePowerUps(gameState, deltaTime);
    updateActivePowerUps(gameState, deltaTime);
    updateBackground(gameState, canvas, deltaTime);
    spawnEnemies(gameState, deltaTime);
    spawnPowerUps(gameState, deltaTime);
    checkBossSpawn(gameState);
    checkCollisions(gameState);
    updateUI(gameState);
  };

  const updatePlayer = (gameState: GameState, deltaTime: number) => {
    const { player, keys } = gameState;
    
    if (player.isInvincible && Date.now() > player.invincibilityEnd) {
      player.isInvincible = false;
    }
    
    const speedMultiplier = getActivePowerUpMultiplier(gameState, 'speed_boost');
    const currentSpeed = player.speed * speedMultiplier;
    
    let isMoving = false;
    
    if (keys.has('a') || keys.has('arrowleft')) {
      player.x = Math.max(30, player.x - currentSpeed);
      isMoving = true;
    }
    if (keys.has('d') || keys.has('arrowright')) {
      player.x = Math.min(canvasRef.current!.width - 30, player.x + currentSpeed);
      isMoving = true;
    }
    if (keys.has('w') || keys.has('arrowup')) {
      player.y = Math.max(30, player.y - currentSpeed);
      isMoving = true;
    }
    if (keys.has('s') || keys.has('arrowdown')) {
      player.y = Math.min(canvasRef.current!.height - 30, player.y + currentSpeed);
      isMoving = true;
    }
    
    // Update thruster effect
    if (isMoving) {
      player.thrusterEffect = Math.min(1, player.thrusterEffect + deltaTime * 0.005);
      createThrusterParticles(gameState, player.x, player.y + 20);
    } else {
      player.thrusterEffect = Math.max(0, player.thrusterEffect - deltaTime * 0.003);
    }
    
    if (keys.has(' ')) {
      shoot(gameState);
    }
    
    if (keys.has('q') && player.weapons.length > 1) {
      player.currentWeapon = (player.currentWeapon + 1) % player.weapons.length;
      keys.delete('q');
      toast.success(`🔄 Switched to: ${player.weapons[player.currentWeapon].name}`);
    }
    
    player.energy = Math.min(player.maxEnergy, player.energy + deltaTime * 0.03);
  };

  const updateEnemies = (gameState: GameState, deltaTime: number) => {
    gameState.enemies.forEach((enemy, index) => {
      enemy.y += enemy.speed;
      
      // Make enemies rotate to face player
      const dx = gameState.player.x - enemy.x;
      const dy = gameState.player.y - enemy.y;
      enemy.rotation = Math.atan2(dy, dx) + Math.PI / 2;
      
      if (enemy.y > canvasRef.current!.height + 50) {
        gameState.enemies.splice(index, 1);
        return;
      }
      
      if (Date.now() - enemy.lastShot > 1200 + Math.random() * 800) {
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const projectile = {
          x: enemy.x,
          y: enemy.y + 25,
          dx: (dx / distance) * 4,
          dy: (dy / distance) * 4,
          damage: 20,
          owner: 'enemy' as const,
          color: '#ff3333',
          trail: [] as Array<{x: number, y: number, alpha: number}>,
          glowSize: 8
        };
        
        gameState.projectiles.push(projectile);
        enemy.lastShot = Date.now();
      }
    });
  };

  const updateBoss = (gameState: GameState, deltaTime: number) => {
    if (!gameState.boss || !gameState.boss.active) return;
    
    const boss = gameState.boss;
    const canvas = canvasRef.current!;
    const time = Date.now() * 0.001;
    
    boss.rotation += 0.01;
    boss.thrusterEffect = Math.sin(time * 3) * 0.5 + 0.5;
    
    const movementPattern = MOVEMENT_PATTERNS[boss.movementPattern];
    if (movementPattern) {
      const newPos = movementPattern.calculate(time, canvas.width, boss, gameState.player);
      boss.x = Math.max(60, Math.min(canvas.width - 60, newPos.x));
      boss.y = Math.max(60, Math.min(250, newPos.y));
    }
    
    if (Date.now() - boss.lastAttack > boss.attackFrequency) {
      const attackPattern = boss.attackPatterns[Math.floor(Math.random() * boss.attackPatterns.length)];
      
      if (attackPattern) {
        executeAttackPattern(attackPattern, boss, gameState.player, gameState.projectiles);
        createScreenShake(gameState, 5, 200);
      }
      
      boss.lastAttack = Date.now();
    }
  };

  const updateProjectiles = (gameState: GameState, deltaTime: number) => {
    gameState.projectiles.forEach((projectile, index) => {
      // Ensure trail array exists and is properly initialized
      if (!projectile.trail) {
        projectile.trail = [];
      }
      
      // Update trail
      projectile.trail.unshift({
        x: projectile.x,
        y: projectile.y,
        alpha: 1.0
      });
      
      if (projectile.trail.length > 8) {
        projectile.trail.pop();
      }
      
      projectile.trail.forEach((point, i) => {
        point.alpha = 1.0 - (i / projectile.trail.length);
      });
      
      projectile.x += projectile.dx;
      projectile.y += projectile.dy;
      projectile.glowSize = 6 + Math.sin(Date.now() * 0.01) * 2;
      
      if (projectile.x < -50 || projectile.x > canvasRef.current!.width + 50 ||
          projectile.y < -50 || projectile.y > canvasRef.current!.height + 50) {
        gameState.projectiles.splice(index, 1);
      }
    });
  };

  const updateParticles = (gameState: GameState, deltaTime: number) => {
    gameState.particles.forEach((particle, index) => {
      particle.x += particle.dx;
      particle.y += particle.dy;
      particle.life -= deltaTime * 0.001;
      
      if (particle.type === 'thruster') {
        particle.size *= 0.95;
        particle.dy += 0.1; // Gravity effect
      } else if (particle.type === 'explosion') {
        particle.size *= 0.98;
        particle.dx *= 0.95;
        particle.dy *= 0.95;
      }
      
      if (particle.life <= 0 || particle.size < 0.5) {
        gameState.particles.splice(index, 1);
      }
    });
  };

  const updateBackground = (gameState: GameState, canvas: HTMLCanvasElement, deltaTime: number) => {
    gameState.backgroundOffset += deltaTime * 0.05;
    
    // Update stars with parallax and twinkling
    gameState.stars.forEach(star => {
      star.y += star.speed;
      star.twinkle += deltaTime * 0.005;
      
      if (star.y > canvas.height + 10) {
        star.y = -10;
        star.x = Math.random() * canvas.width;
      }
    });
    
    // Update nebula drift
    gameState.nebula.forEach(cloud => {
      cloud.y += cloud.drift;
      cloud.x += Math.sin(Date.now() * 0.0005) * 0.2;
      
      if (cloud.y > canvas.height + cloud.size) {
        cloud.y = -cloud.size;
        cloud.x = Math.random() * canvas.width;
      }
    });
  };

  const spawnEnemies = (gameState: GameState, deltaTime: number) => {
    if (!gameState.boss?.active && Date.now() - gameState.lastEnemySpawn > 1800) {
      gameState.enemies.push({
        x: Math.random() * (canvasRef.current!.width - 100) + 50,
        y: -40,
        health: 60,
        speed: 2.5 + Math.random() * 2,
        type: 'interceptor',
        lastShot: Date.now(),
        rotation: 0
      });
      gameState.lastEnemySpawn = Date.now();
    }
  };

  const spawnPowerUps = (gameState: GameState, deltaTime: number) => {
    if (Date.now() - gameState.lastPowerUpSpawn > 15000 + Math.random() * 10000) {
      const powerUp = getRandomPowerUp();
      gameState.powerUps.push({
        x: Math.random() * (canvasRef.current!.width - 100) + 50,
        y: -40,
        powerUp: powerUp,
        collected: false,
        pulsePhase: 0,
        floatOffset: 0
      });
      gameState.lastPowerUpSpawn = Date.now();
      
      toast.info(`🎁 POWER-UP INCOMING: ${powerUp.name}!`, {
        duration: 2500,
      });
    }
  };

  const checkBossSpawn = (gameState: GameState) => {
    // Only spawn boss if no current boss exists and enough time has passed since last boss was defeated
    if (!gameState.boss && gameState.player.score > 800 && 
        Date.now() - gameState.lastBossSpawn > 45000) {
      generateBoss(gameState);
    }
  };

  const generateBoss = async (gameState: GameState) => {
    try {
      console.log('🔥 SUMMONING BOSS...');
      const bossData = await AIService.generateBoss({
        level: gameState.player.level,
        score: gameState.player.score,
        currentWeapon: gameState.player.weapons[gameState.player.currentWeapon].name,
        playerWeaknesses: gameState.player.health < 50 ? ['low_health'] : [],
        timeInLevel: Date.now() - gameState.lastBossSpawn
      }, gameState.player.level);
      
      gameState.boss = {
        ...bossData,
        x: canvasRef.current!.width / 2,
        y: 120,
        currentHealth: bossData.health,
        lastAttack: Date.now(),
        phase: 1,
        active: true,
        rotation: 0,
        thrusterEffect: 0
      };
      
      createScreenShake(gameState, 15, 1000);
      toast.warning(`⚠️ BOSS INCOMING: ${bossData.name}!`, {
        position: 'top-center',
        duration: 5000,
        style: {
          background: 'rgba(139, 0, 0, 0.95)',
          border: '3px solid #ff0000',
          color: '#ffffff',
          fontSize: '18px',
          fontWeight: 'bold',
          textAlign: 'center'
        }
      });
      gameState.lastBossSpawn = Date.now();
    } catch (error) {
      console.error('Boss generation failed:', error);
    }
  };

  const collectPowerUp = (gameState: GameState, powerUp: PowerUp) => {
    const player = gameState.player;
    
    if (powerUp.type === 'permanent') {
      switch (powerUp.effect.type) {
        case 'health_restore':
          player.health = Math.min(player.maxHealth, player.health + powerUp.effect.value);
          break;
        case 'energy_boost':
          player.energy = Math.min(player.maxEnergy, player.energy + powerUp.effect.value);
          break;
      }
    } else {
      const activePowerUp: ActivePowerUp = {
        ...powerUp,
        activatedAt: Date.now(),
        remainingTime: powerUp.duration
      };
      
      gameState.activePowerUps = gameState.activePowerUps.filter(p => p.id !== powerUp.id);
      gameState.activePowerUps.push(activePowerUp);
      
      switch (powerUp.effect.type) {
        case 'shield':
          player.shield = powerUp.effect.value;
          break;
        case 'invincibility':
          player.isInvincible = true;
          player.invincibilityEnd = Date.now() + powerUp.duration!;
          break;
      }
    }
    
    toast.success(`🥳 ${powerUp.icon} ${powerUp.name.toUpperCase()} ACTIVATED! 
    ⚡ ${powerUp.description}`, {
      duration: 3000,
    });
    
    createPowerUpCollectionEffect(gameState, gameState.player.x, gameState.player.y, powerUp.color);
  };

  const getActivePowerUpMultiplier = (gameState: GameState, effectType: string): number => {
    const activePowerUp = gameState.activePowerUps.find(p => p.effect.type === effectType);
    return activePowerUp ? activePowerUp.effect.value : 1.0;
  };

  const hasActivePowerUp = (gameState: GameState, effectType: string): boolean => {
    return gameState.activePowerUps.some(p => p.effect.type === effectType);
  };

  const updatePowerUps = (gameState: GameState, deltaTime: number) => {
    gameState.powerUps.forEach((powerUpItem, index) => {
      powerUpItem.y += 1.5;
      powerUpItem.pulsePhase += deltaTime * 0.005;
      powerUpItem.floatOffset = Math.sin(powerUpItem.pulsePhase) * 3;
      
      if (powerUpItem.y > canvasRef.current!.height + 50) {
        gameState.powerUps.splice(index, 1);
        return;
      }
      
      const dx = powerUpItem.x - gameState.player.x;
      const dy = powerUpItem.y - gameState.player.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 35 && !powerUpItem.collected) {
        collectPowerUp(gameState, powerUpItem.powerUp);
        gameState.powerUps.splice(index, 1);
      }
    });
  };

  const updateActivePowerUps = (gameState: GameState, deltaTime: number) => {
    gameState.activePowerUps.forEach((activePowerUp, index) => {
      if (activePowerUp.type === 'temporary') {
        const elapsed = Date.now() - activePowerUp.activatedAt;
        if (elapsed >= activePowerUp.duration!) {
          gameState.activePowerUps.splice(index, 1);
          toast.info(`⏰ ${activePowerUp.name} effect expired`);
          
          // Remove shield power-up when shield is depleted
          if (activePowerUp.effect.type === 'shield') {
            gameState.player.shield = 0;
          }
        } else {
          activePowerUp.remainingTime = activePowerUp.duration! - elapsed;
        }
      }
    });
  };

  const createScreenShake = (gameState: GameState, intensity: number, duration: number) => {
    // Only apply screen shake if the game is active (not paused and not over)
    if (!gameState.gamePaused && !gameState.gameOver) {
      gameState.screenShake = {
        intensity,
        duration,
        remaining: duration
      };
    } else {
      // Reset screen shake if game is paused or over
      gameState.screenShake = {
        intensity: 0,
        duration: 0,
        remaining: 0
      };
    }
  };

  const createThrusterParticles = (gameState: GameState, x: number, y: number) => {
    for (let i = 0; i < 3; i++) {
      gameState.particles.push({
        x: x + (Math.random() - 0.5) * 15,
        y: y + 5,
        dx: (Math.random() - 0.5) * 2,
        dy: Math.random() * 3 + 2,
        life: 0.8,
        color: ['#00aaff', '#0088cc', '#ffffff'][Math.floor(Math.random() * 3)],
        size: Math.random() * 4 + 2,
        type: 'thruster'
      });
    }
  };

  const createPowerUpCollectionEffect = (gameState: GameState, x: number, y: number, color: string) => {
    for (let i = 0; i < 25; i++) {
      gameState.particles.push({
        x: x,
        y: y,
        dx: (Math.random() - 0.5) * 10,
        dy: (Math.random() - 0.5) * 10,
        life: 1.5,
        color: color,
        size: Math.random() * 6 + 3,
        type: 'explosion'
      });
    }
    createScreenShake(gameState, 8, 300);
  };

  const shoot = (gameState: GameState) => {
    const weapon = gameState.player.weapons[gameState.player.currentWeapon];
    const damageMultiplier = getActivePowerUpMultiplier(gameState, 'damage_boost');
    const rapidFire = hasActivePowerUp(gameState, 'rapid_fire');
    const multiShot = hasActivePowerUp(gameState, 'multi_shot');
    const multiShotCount = gameState.activePowerUps.find(p => p.effect.type === 'multi_shot')?.effect.value || 1;
    
    const energyCost = rapidFire ? weapon.energyCost * 0.3 : weapon.energyCost;
    
    if (gameState.player.energy >= energyCost) {
      const damage = weapon.damage * damageMultiplier;
      const projectileColor = weapon.rarity === 'legendary' ? '#ffd700' : 
                             weapon.rarity === 'epic' ? '#ff6b6b' : 
                             weapon.rarity === 'rare' ? '#4ecdc4' : '#00aaff';
      
      gameState.gameStats.shotsFired++;
      
      if (multiShot) {
        for (let i = 0; i < multiShotCount; i++) {
          const angle = (i - Math.floor(multiShotCount / 2)) * 0.4;
          const projectile = {
            x: gameState.player.x,
            y: gameState.player.y - 25,
            dx: Math.sin(angle) * 3,
            dy: -10,
            damage: damage,
            owner: 'player' as const,
            color: projectileColor,
            trail: [] as Array<{x: number, y: number, alpha: number}>,
            glowSize: 10
          };
          gameState.projectiles.push(projectile);
        }
      } else {
        const projectile = {
          x: gameState.player.x,
          y: gameState.player.y - 25,
          dx: 0,
          dy: -10,
          damage: damage,
          owner: 'player' as const,
          color: projectileColor,
          trail: [] as Array<{x: number, y: number, alpha: number}>,
          glowSize: 10
        };
        gameState.projectiles.push(projectile);
      }
      
      gameState.player.energy -= energyCost;
      
      // Enhanced muzzle flash
      const particleCount = multiShot ? 15 : 8;
      for (let i = 0; i < particleCount; i++) {
        gameState.particles.push({
          x: gameState.player.x + (Math.random() - 0.5) * 12,
          y: gameState.player.y - 20,
          dx: (Math.random() - 0.5) * 6,
          dy: -Math.random() * 4,
          life: 0.4,
          color: '#ffffff',
          size: Math.random() * 4 + 2,
          type: 'spark'
        });
      }
    }
  };

  const checkCollisions = (gameState: GameState) => {
    // Player projectiles vs enemies
    gameState.projectiles.forEach((projectile, pIndex) => {
      if (projectile.owner !== 'player') return;
      
      gameState.enemies.forEach((enemy, eIndex) => {
        const dx = projectile.x - enemy.x;
        const dy = projectile.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 28) {
          enemy.health -= projectile.damage;
          gameState.gameStats.damageDealt += projectile.damage;
          gameState.projectiles.splice(pIndex, 1);
          
          createExplosion(gameState, enemy.x, enemy.y, '#ff6b6b', 'medium');
          createScreenShake(gameState, 3, 150);
          
          if (enemy.health <= 0) {
            gameState.enemies.splice(eIndex, 1);
            gameState.player.score += 150;
            gameState.gameStats.enemiesKilled++;
            
            createExplosion(gameState, enemy.x, enemy.y, '#ffaa00', 'large');
            createScreenShake(gameState, 6, 250);
            
            if (Math.random() < 0.15) {
              const powerUp = getRandomPowerUp();
              gameState.powerUps.push({
                x: enemy.x,
                y: enemy.y,
                powerUp: powerUp,
                collected: false,
                pulsePhase: 0,
                floatOffset: 0
              });
            }
          }
        }
      });
      
      // Player projectiles vs boss
      if (gameState.boss?.active) {
        const dx = projectile.x - gameState.boss.x;
        const dy = projectile.y - gameState.boss.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 55) {
          gameState.boss.currentHealth -= projectile.damage;
          gameState.gameStats.damageDealt += projectile.damage;
          gameState.projectiles.splice(pIndex, 1);
          
          createExplosion(gameState, gameState.boss.x, gameState.boss.y, '#ff00ff', 'large');
          createScreenShake(gameState, 8, 200);
          
          if (gameState.boss.currentHealth <= 0) {
            gameState.player.score += 2000;
            gameState.gameStats.bossesDefeated++;
            gameState.boss.active = false;
            gameState.boss = null;
            gameState.lastBossSpawn = Date.now(); // Reset boss spawn timer
            
            toast.success(`🏆 BOSS DEFEATED! +2000 POINTS!`, {
              position: 'top-center',
              duration: 5000,
              style: {
                background: 'rgba(255, 215, 0, 0.95)',
                border: '3px solid #ffd700',
                color: '#000000',
                fontSize: '20px',
                fontWeight: 'bold'
              }
            });
            
            generateNewWeapon(gameState);
            
            // Guaranteed legendary power-up from boss
            const powerUp = getRandomPowerUp();
            gameState.powerUps.push({
              x: gameState.player.x,
              y: gameState.player.y - 60,
              powerUp: powerUp,
              collected: false,
              pulsePhase: 0,
              floatOffset: 0
            });
            
            createExplosion(gameState, gameState.player.x, gameState.player.y - 60, '#ffd700', 'massive');
            createScreenShake(gameState, 20, 800);
          }
        }
      }
    });
    
    // Enemy projectiles vs player
    gameState.projectiles.forEach((projectile, pIndex) => {
      if (projectile.owner !== 'enemy') return;
      
      const dx = projectile.x - gameState.player.x;
      const dy = projectile.y - gameState.player.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 22) {
        if (!gameState.player.isInvincible) {
          let damage = projectile.damage;
          
          if (gameState.player.shield > 0) {
            const shieldDamage = Math.min(damage, gameState.player.shield);
            gameState.player.shield -= shieldDamage;
            damage -= shieldDamage;
            
            if (gameState.player.shield <= 0) {
              // Remove shield power-up when shield is depleted
              gameState.activePowerUps = gameState.activePowerUps.filter(p => p.effect.type !== 'shield');
              toast.info('🛡️ SHIELD DEPLETED!');
            }
          }
          
          if (damage > 0) {
            gameState.player.health -= damage;
            createScreenShake(gameState, 10, 300);
          }
        }
        
        gameState.projectiles.splice(pIndex, 1);
        createExplosion(gameState, gameState.player.x, gameState.player.y, '#ff4444', 'medium');
        
        if (gameState.player.health <= 0) {
          gameState.gameOver = true;
          // Reset screen shake when game is over
          gameState.screenShake = {
            intensity: 0,
            duration: 0,
            remaining: 0
          };
          // Keep gameRunning true so render is still called, but game state stops updating
          // This allows us to continue displaying the game over screen
        }
      }
    });
  };

  const createExplosion = (gameState: GameState, x: number, y: number, color: string, size: 'small' | 'medium' | 'large' | 'massive') => {
    const particleCount = size === 'massive' ? 40 : size === 'large' ? 25 : size === 'medium' ? 15 : 8;
    const maxSize = size === 'massive' ? 12 : size === 'large' ? 8 : size === 'medium' ? 5 : 3;
    
    for (let i = 0; i < particleCount; i++) {
      gameState.particles.push({
        x: x,
        y: y,
        dx: (Math.random() - 0.5) * 12,
        dy: (Math.random() - 0.5) * 12,
        life: 0.8 + Math.random() * 0.7,
        color: color,
        size: Math.random() * maxSize + 2,
        type: 'explosion'
      });
    }
  };

  const generateNewWeapon = async (gameState: GameState) => {
    try {
      console.log('🔫 FORGING NEW WEAPON...');
      const weaponNames = gameState.player.weapons.map(w => w.name);
      const newWeapon = await AIService.generateWeapon(gameState.player.level, weaponNames);
      
      gameState.player.weapons.push(newWeapon);
      toast.success(`🥳 LEGENDARY WEAPON FORGED: ${newWeapon.name.toUpperCase()}! 
      ⚡ Special Power: ${newWeapon.specialEffect} 
      🔥 Rarity: ${newWeapon.rarity.toUpperCase()}`, {
        duration: 6000,
      });
    } catch (error) {
      console.error('Weapon generation failed:', error);
    }
  };

  const updateUI = (gameState: GameState) => {
    const scoreThreshold = gameState.player.level * 1200;
    if (gameState.player.score >= scoreThreshold) {
      gameState.player.level++;
      gameState.player.maxHealth += 25;
      gameState.player.health = gameState.player.maxHealth;
      toast.success(`🚀 RANK UP! Level ${gameState.player.level} 
      💪 Enhanced hull integrity: +25 HP!`, {
        duration: 4000,
      });
    }
  };

  const render = (ctx: CanvasRenderingContext2D, gameState: GameState, canvas: HTMLCanvasElement) => {
    // Reset transformation matrix at the beginning of each frame
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    
    // Only apply screen shake during active gameplay (not paused, not game over)
    const applyShake = gameState.screenShake.intensity > 0 && !gameState.gamePaused && !gameState.gameOver;
    if (applyShake) {
      const shakeX = (Math.random() - 0.5) * gameState.screenShake.intensity;
      const shakeY = (Math.random() - 0.5) * gameState.screenShake.intensity;
      ctx.translate(shakeX, shakeY);
    }
    
    // Enhanced space background
    const gradient = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.width);
    gradient.addColorStop(0, '#0a0a2e');
    gradient.addColorStop(0.5, '#16213e');
    gradient.addColorStop(1, '#0f0f23');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw nebula clouds
    gameState.nebula.forEach(cloud => {
      ctx.globalAlpha = cloud.alpha;
      const nebulaGradient = ctx.createRadialGradient(cloud.x, cloud.y, 0, cloud.x, cloud.y, cloud.size);
      nebulaGradient.addColorStop(0, cloud.color + '40');
      nebulaGradient.addColorStop(0.5, cloud.color + '20');
      nebulaGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = nebulaGradient;
      ctx.fillRect(cloud.x - cloud.size, cloud.y - cloud.size, cloud.size * 2, cloud.size * 2);
    });
    ctx.globalAlpha = 1;
    
    // Enhanced starfield
    gameState.stars.forEach(star => {
      const twinkle = Math.sin(star.twinkle) * 0.3 + 0.7;
      ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness * twinkle})`;
      ctx.fillRect(star.x, star.y, star.size, star.size);
      
      // Add star glow for larger stars
      if (star.size > 1.5) {
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 4;
        ctx.fillRect(star.x, star.y, star.size, star.size);
        ctx.shadowBlur = 0;
      }
    });
    
    if (!gameState.gameOver) {
      drawEnhancedPlayer(ctx, gameState);
      gameState.enemies.forEach(enemy => drawEnhancedEnemy(ctx, enemy));
      if (gameState.boss?.active) drawEnhancedBoss(ctx, gameState.boss);
      gameState.projectiles.forEach(projectile => drawEnhancedProjectile(ctx, projectile));
      gameState.powerUps.forEach(powerUpItem => drawEnhancedPowerUp(ctx, powerUpItem));
      gameState.particles.forEach(particle => drawEnhancedParticle(ctx, particle));
      drawEnhancedUI(ctx, gameState, canvas);
      
      // Draw pause overlay when game is paused
      if (gameState.gamePaused) {
        // Reset any active shake before drawing pause overlay
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        drawPauseOverlay(ctx, canvas);
      }
    } else {
      // Reset any active shake before drawing game over overlay
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      drawGameOverOverlay(ctx, gameState, canvas);
    }
    
    // Reset transform matrix after drawing everything
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  };

  const drawEnhancedPlayer = (ctx: CanvasRenderingContext2D, gameState: GameState) => {
    const player = gameState.player;
    
    if (player.isInvincible) {
      ctx.globalAlpha = Math.sin(Date.now() * 0.02) * 0.4 + 0.6;
    }
    
    // Enhanced player ship design
    ctx.save();
    ctx.translate(player.x, player.y);
    
    // Main hull with gradient
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
    
    // Hull outline
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Cockpit
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, -5, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Wing details
    ctx.strokeStyle = '#00ffaa';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-12, 5);
    ctx.lineTo(-8, 12);
    ctx.moveTo(12, 5);
    ctx.lineTo(8, 12);
    ctx.stroke();
    
    ctx.restore();
    
    // Shield effect
    if (player.shield > 0) {
      ctx.strokeStyle = '#4ecdc4';
      ctx.lineWidth = 4;
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.arc(player.x, player.y, 30, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    
    // Enhanced thruster effects
    if (player.thrusterEffect > 0) {
      const thrusterGradient = ctx.createLinearGradient(player.x, player.y + 20, player.x, player.y + 35);
      thrusterGradient.addColorStop(0, '#00aaff');
      thrusterGradient.addColorStop(0.5, '#0088cc');
      thrusterGradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = thrusterGradient;
      ctx.globalAlpha = player.thrusterEffect;
      
      ctx.beginPath();
      ctx.moveTo(player.x - 6, player.y + 20);
      ctx.lineTo(player.x + 6, player.y + 20);
      ctx.lineTo(player.x, player.y + 35);
      ctx.closePath();
      ctx.fill();
      
      ctx.beginPath();
      ctx.moveTo(player.x - 12, player.y + 18);
      ctx.lineTo(player.x - 8, player.y + 18);
      ctx.lineTo(player.x - 10, player.y + 28);
      ctx.closePath();
      ctx.fill();
      
      ctx.beginPath();
      ctx.moveTo(player.x + 8, player.y + 18);
      ctx.lineTo(player.x + 12, player.y + 18);
      ctx.lineTo(player.x + 10, player.y + 28);
      ctx.closePath();
      ctx.fill();
    }
    
    ctx.globalAlpha = 1;
  };

  const drawEnhancedEnemy = (ctx: CanvasRenderingContext2D, enemy: any) => {
    ctx.save();
    ctx.translate(enemy.x, enemy.y);
    ctx.rotate(enemy.rotation);
    
    // Enhanced enemy ship design pointing toward player
    const enemyGradient = ctx.createLinearGradient(0, -15, 0, 15);
    enemyGradient.addColorStop(0, '#ff6666');
    enemyGradient.addColorStop(0.5, '#ff4444');
    enemyGradient.addColorStop(1, '#cc2222');
    
    // Main hull
    ctx.fillStyle = enemyGradient;
    ctx.beginPath();
    ctx.moveTo(0, -20); // Front tip
    ctx.lineTo(-15, -5); // Left front wing
    ctx.lineTo(-12, 5); // Left mid section
    ctx.lineTo(-18, 10); // Left wing extension
    ctx.lineTo(-8, 15); // Left engine
    ctx.lineTo(0, 12); // Center back
    ctx.lineTo(8, 15); // Right engine
    ctx.lineTo(18, 10); // Right wing extension
    ctx.lineTo(12, 5); // Right mid section
    ctx.lineTo(15, -5); // Right front wing
    ctx.closePath();
    ctx.fill();
    
    // Hull details - armor plates
    ctx.strokeStyle = '#ff9999';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-8, -10);
    ctx.lineTo(8, -10);
    ctx.moveTo(-10, 0);
    ctx.lineTo(10, 0);
    ctx.stroke();
    
    // Cockpit/sensor array with glow
    ctx.fillStyle = '#ffdd00';
    ctx.shadowColor = '#ffdd00';
    ctx.shadowBlur = 5;
    ctx.beginPath();
    ctx.arc(0, -5, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Engine glow with pulsing effect
    const glowIntensity = 0.6 + Math.sin(Date.now() * 0.01) * 0.4;
    const engineGradient = ctx.createRadialGradient(-8, 15, 0, -8, 15, 6);
    engineGradient.addColorStop(0, `rgba(255, 150, 0, ${glowIntensity})`);
    engineGradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
    ctx.fillStyle = engineGradient;
    ctx.beginPath();
    ctx.arc(-8, 15, 6, 0, Math.PI * 2);
    ctx.fill();
    
    const engineGradient2 = ctx.createRadialGradient(8, 15, 0, 8, 15, 6);
    engineGradient2.addColorStop(0, `rgba(255, 150, 0, ${glowIntensity})`);
    engineGradient2.addColorStop(1, 'rgba(255, 0, 0, 0)');
    ctx.fillStyle = engineGradient2;
    ctx.beginPath();
    ctx.arc(8, 15, 6, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
    
    // Health bar with enhanced styling
    const healthBarWidth = 35;
    const healthPercentage = enemy.health / 60;
    
    ctx.fillStyle = '#333333';
    ctx.fillRect(enemy.x - healthBarWidth/2, enemy.y - 30, healthBarWidth, 5);
    
    const healthGradient = ctx.createLinearGradient(enemy.x - healthBarWidth/2, 0, enemy.x + healthBarWidth/2, 0);
    healthGradient.addColorStop(0, '#ff0000');
    healthGradient.addColorStop(0.5, '#ffaa00');
    healthGradient.addColorStop(1, '#00ff00');
    ctx.fillStyle = healthGradient;
    ctx.fillRect(enemy.x - healthBarWidth/2, enemy.y - 30, healthPercentage * healthBarWidth, 5);
  };

  const drawEnhancedBoss = (ctx: CanvasRenderingContext2D, boss: any) => {
    ctx.save();
    ctx.translate(boss.x, boss.y);
    
    // LETHAL DREADNOUGHT - "ANNIHILATOR" CLASS
    
    // Time-based effects for dynamic visual elements
    const time = Date.now();
    const primaryPulse = Math.sin(time * 0.003) * 0.3 + 0.7;
    const secondaryPulse = Math.sin(time * 0.006) * 0.4 + 0.6;
    const weaponPulse = Math.sin(time * 0.008) * 0.5 + 0.5;
    
    // Cast shadow for depth
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 10;
    
    // MENACING HULL DESIGN - Dark, aggressive shapes
    // Main hull gradient - dark metallic with red undertones
    const hullGradient = ctx.createLinearGradient(0, -70, 0, 70);
    hullGradient.addColorStop(0, '#272727');
    hullGradient.addColorStop(0.3, '#1a1a1a');
    hullGradient.addColorStop(0.7, '#0e0e0e');
    hullGradient.addColorStop(1, '#000000');
    ctx.fillStyle = hullGradient;
    
    // Sharp, angular hull shape with aggressive points
    ctx.beginPath();
    // Front spike
    ctx.moveTo(0, -70);
    
    // Left aggressive wing structure
    ctx.lineTo(-25, -55);
    ctx.lineTo(-45, -50);
    ctx.lineTo(-65, -60); // Sharp outer point
    ctx.lineTo(-70, -40);
    ctx.lineTo(-90, -20); // Wing tip
    ctx.lineTo(-75, -10);
    ctx.lineTo(-85, 20);
    ctx.lineTo(-65, 30);
    ctx.lineTo(-70, 50);
    
    // Rear section
    ctx.lineTo(-40, 60);
    ctx.lineTo(-20, 65);
    ctx.lineTo(0, 55);
    ctx.lineTo(20, 65);
    ctx.lineTo(40, 60);
    
    // Right aggressive wing structure (mirrored)
    ctx.lineTo(70, 50);
    ctx.lineTo(65, 30);
    ctx.lineTo(85, 20);
    ctx.lineTo(75, -10);
    ctx.lineTo(90, -20); // Wing tip
    ctx.lineTo(70, -40);
    ctx.lineTo(65, -60); // Sharp outer point
    ctx.lineTo(45, -50);
    ctx.lineTo(25, -55);
    
    ctx.closePath();
    ctx.fill();
    
    // Turn off shadow for internal details
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    
    // HULL ARMOR PLATES - metallic with red highlights
    const armorGradient = ctx.createLinearGradient(-80, 0, 80, 0);
    armorGradient.addColorStop(0, '#3d0000');
    armorGradient.addColorStop(0.3, '#610000');
    armorGradient.addColorStop(0.5, '#8a0000');
    armorGradient.addColorStop(0.7, '#610000');
    armorGradient.addColorStop(1, '#3d0000');
    
    ctx.strokeStyle = armorGradient;
    ctx.lineWidth = 2.5;
    ctx.stroke();
    
    // ENERGY SHIELDS - crimson defensive barrier
    ctx.globalAlpha = 0.15 * secondaryPulse;
    const shieldGradient = ctx.createRadialGradient(0, 0, 50, 0, 0, 95);
    shieldGradient.addColorStop(0, 'transparent');
    shieldGradient.addColorStop(0.7, 'rgba(255, 30, 30, 0.4)');
    shieldGradient.addColorStop(0.9, 'rgba(255, 0, 0, 0.2)');
    shieldGradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = shieldGradient;
    ctx.beginPath();
    ctx.arc(0, 0, 95, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    
    // REACTOR CORE - pulsating dark matter energy source
    const coreSize = 20;
    ctx.shadowColor = '#ff0000';
    ctx.shadowBlur = 25 * primaryPulse;
    
    // Core gradient - dark red to bright red
    const coreGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, coreSize);
    coreGradient.addColorStop(0, `rgba(255, 255, 255, ${primaryPulse})`);  
    coreGradient.addColorStop(0.3, `rgba(255, 200, 200, ${primaryPulse * 0.9})`);
    coreGradient.addColorStop(0.6, `rgba(255, 100, 50, ${primaryPulse * 0.8})`);
    coreGradient.addColorStop(0.8, `rgba(200, 0, 0, ${primaryPulse * 0.7})`);
    coreGradient.addColorStop(1, `rgba(120, 0, 0, ${primaryPulse * 0.6})`);
    
    ctx.fillStyle = coreGradient;
    ctx.beginPath();
    ctx.arc(0, 0, coreSize, 0, Math.PI * 2);
    ctx.fill();
    
    // Energy containment rings
    ctx.lineWidth = 2;
    ctx.strokeStyle = `rgba(255, 100, 50, ${primaryPulse * 0.8})`;
    
    // Inner containment ring
    ctx.beginPath();
    ctx.arc(0, 0, coreSize + 5, 0, Math.PI * 2);
    ctx.stroke();
    
    // Outer containment ring
    ctx.strokeStyle = `rgba(255, 50, 0, ${primaryPulse * 0.6})`;
    ctx.beginPath();
    ctx.arc(0, 0, coreSize + 15, 0, Math.PI * 2);
    ctx.stroke();
    
    // Reset shadow
    ctx.shadowBlur = 0;
    
    // POWER CONDUITS - connecting core to weapons
    ctx.strokeStyle = `rgba(255, 30, 0, ${0.3 + primaryPulse * 0.3})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    // Connect to all weapon systems
    // Main forward cannons
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -40);
    ctx.lineTo(-25, -50);
    ctx.moveTo(0, -40);
    ctx.lineTo(25, -50);
    
    // Side weapons
    ctx.moveTo(0, 0);
    ctx.lineTo(-60, -30);
    ctx.moveTo(0, 0);
    ctx.lineTo(-75, 0);
    ctx.moveTo(0, 0);
    ctx.lineTo(-60, 30);
    
    ctx.moveTo(0, 0);
    ctx.lineTo(60, -30);
    ctx.moveTo(0, 0);
    ctx.lineTo(75, 0);
    ctx.moveTo(0, 0);
    ctx.lineTo(60, 30);
    
    ctx.stroke();
    
    // COMMAND BRIDGE - reinforced with red tint
    const bridgeGradient = ctx.createLinearGradient(0, -45, 0, -25);
    bridgeGradient.addColorStop(0, '#000000');
    bridgeGradient.addColorStop(0.5, '#1a0000');
    bridgeGradient.addColorStop(1, '#400000');
    
    ctx.fillStyle = bridgeGradient;
    ctx.beginPath();
    ctx.ellipse(0, -35, 15, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Bridge shield - protective energy barrier
    ctx.fillStyle = `rgba(255, 0, 0, ${0.2 + secondaryPulse * 0.1})`;
    ctx.shadowColor = 'rgba(255, 0, 0, 0.8)';
    ctx.shadowBlur = 10 * secondaryPulse;
    ctx.beginPath();
    ctx.ellipse(0, -35, 18, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // Bridge windows - sinister red glow
    ctx.fillStyle = `rgba(255, 50, 0, ${0.7 + secondaryPulse * 0.3})`;
    ctx.shadowColor = '#ff3000';
    ctx.shadowBlur = 4;
    ctx.beginPath();
    
    // Command windows pattern
    for (let i = -4; i <= 4; i++) {
      const windowX = i * 3;
      const windowY = -38 + Math.abs(i) * 0.5;
      const windowSize = i % 2 === 0 ? 1.6 : 1.2;
      ctx.moveTo(windowX, windowY);
      ctx.arc(windowX, windowY, windowSize, 0, Math.PI * 2);
    }
    ctx.fill();
    ctx.shadowBlur = 0;
    
    // DEVASTATING WEAPON SYSTEMS
    
    // Function to draw a deadly weapon turret
    const drawWeaponTurret = (x, y, size, rotation, color) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      
      // Turret base - heavy armor plating
      ctx.fillStyle = '#1a1a1a';
      ctx.beginPath();
      ctx.arc(0, 0, size, 0, Math.PI * 2);
      ctx.fill();
      
      // Energy core - power source
      ctx.shadowColor = color;
      ctx.shadowBlur = 8 * weaponPulse;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.5, 0, Math.PI * 2);
      ctx.fill();
      
      // Super-weapon barrels
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#000000';
      
      const barrelCount = size > 8 ? 3 : 2;
      const barrelWidth = size * 0.3;
      const barrelLength = size * 1.8;
      const barrelGap = size * 0.2;
      
      // Multi-barrel arrangements
      if (barrelCount === 3) {
        // Center barrel
        ctx.fillRect(-barrelWidth/2, -barrelLength, barrelWidth, barrelLength);
        // Side barrels
        ctx.fillRect(-barrelWidth/2 - barrelWidth - barrelGap, -barrelLength * 0.85, barrelWidth, barrelLength * 0.85);
        ctx.fillRect(barrelWidth/2 + barrelGap, -barrelLength * 0.85, barrelWidth, barrelLength * 0.85);
      } else {
        // Dual barrels
        ctx.fillRect(-barrelWidth - barrelGap/2, -barrelLength, barrelWidth, barrelLength);
        ctx.fillRect(barrelGap/2, -barrelLength, barrelWidth, barrelLength);
      }
      
      // Weapon charging effect
      ctx.shadowColor = color;
      ctx.shadowBlur = 10 * weaponPulse;
      ctx.fillStyle = color;
      
      if (barrelCount === 3) {
        // Center barrel glow
        ctx.beginPath();
        ctx.arc(0, -barrelLength, barrelWidth * 0.6, 0, Math.PI * 2);
        ctx.fill();
        // Side barrel glows
        ctx.beginPath();
        ctx.arc(-barrelWidth - barrelGap - barrelWidth/2, -barrelLength * 0.85, barrelWidth * 0.5, 0, Math.PI * 2);
        ctx.arc(barrelWidth/2 + barrelGap + barrelWidth/2, -barrelLength * 0.85, barrelWidth * 0.5, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Dual barrel glows
        ctx.beginPath();
        ctx.arc(-barrelWidth - barrelGap/2 + barrelWidth/2, -barrelLength, barrelWidth * 0.5, 0, Math.PI * 2);
        ctx.arc(barrelGap/2 + barrelWidth/2, -barrelLength, barrelWidth * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.restore();
    };
    
    // Primary forward cannons - devastating firepower
    drawWeaponTurret(-25, -50, 11, Math.PI / 10, `rgba(255, 20, 20, ${weaponPulse})`);
    drawWeaponTurret(25, -50, 11, -Math.PI / 10, `rgba(255, 20, 20, ${weaponPulse})`);
    
    // Side-mounted heavy batteries
    drawWeaponTurret(-60, -30, 10, Math.PI / 3, `rgba(255, 80, 0, ${weaponPulse})`);
    drawWeaponTurret(60, -30, 10, -Math.PI / 3, `rgba(255, 80, 0, ${weaponPulse})`);
    
    // Broadside cannons
    drawWeaponTurret(-75, 0, 12, Math.PI / 2, `rgba(255, 30, 0, ${weaponPulse})`);
    drawWeaponTurret(75, 0, 12, -Math.PI / 2, `rgba(255, 30, 0, ${weaponPulse})`);
    
    // Rear defensive cannons
    drawWeaponTurret(-60, 30, 9, Math.PI * 2/3, `rgba(255, 60, 0, ${weaponPulse})`);
    drawWeaponTurret(60, 30, 9, -Math.PI * 2/3, `rgba(255, 60, 0, ${weaponPulse})`);
    
    // TARGETING SENSORS - enhanced threat detection
    ctx.fillStyle = `rgba(255, 0, 0, ${0.7 + secondaryPulse * 0.3})`;
    ctx.shadowColor = '#ff0000';
    ctx.shadowBlur = 6;
    
    // Forward targeting array
    ctx.beginPath();
    ctx.arc(-10, -58, 3, 0, Math.PI * 2);
    ctx.arc(0, -65, 4, 0, Math.PI * 2);
    ctx.arc(10, -58, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Wing targeting systems
    ctx.beginPath();
    ctx.arc(-80, -25, 3, 0, Math.PI * 2);
    ctx.arc(80, -25, 3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.shadowBlur = 0;
    
    // ARMOR PLATING DETAILS - reinforced sections
    ctx.strokeStyle = '#4a0000';
    ctx.lineWidth = 1.5;
    
    // Main hull reinforcement lines
    ctx.beginPath();
    // Horizontal armor plates
    ctx.moveTo(-65, -35);
    ctx.lineTo(65, -35);
    ctx.moveTo(-75, -10);
    ctx.lineTo(75, -10);
    ctx.moveTo(-75, 15);
    ctx.lineTo(75, 15);
    ctx.moveTo(-50, 40);
    ctx.lineTo(50, 40);
    
    // Vertical reinforcement ribs
    ctx.moveTo(0, -65);
    ctx.lineTo(0, 50);
    ctx.moveTo(-45, -40);
    ctx.lineTo(-45, 40);
    ctx.moveTo(45, -40);
    ctx.lineTo(45, 40);
    ctx.stroke();
    
    // Technical details - armor paneling
    ctx.strokeStyle = '#300000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    
    // Create armored plate sections
    // Hull front sections
    for (let i = -40; i < 40; i += 20) {
      for (let j = -60; j < 40; j += 15) {
        if (Math.abs(i) + Math.abs(j) < 85) {
          // Draw armor panels in a scarred pattern
          ctx.moveTo(i, j);
          ctx.lineTo(i + 12, j - 2);
          ctx.lineTo(i + 14, j + 10);
          ctx.lineTo(i + 2, j + 12);
          ctx.closePath();
        }
      }
    }
    ctx.stroke();
    
    // ENGINE SYSTEMS - dark matter propulsion
    if (boss.thrusterEffect > 0.1) {
      const thrusterIntensity = boss.thrusterEffect;
      const enginePulse = Math.sin(time * 0.01) * 0.3 + 0.7;
      
      // Main engine glow - hellish red
      const mainEngineGradient = ctx.createLinearGradient(0, 50, 0, 90);
      mainEngineGradient.addColorStop(0, `rgba(255, 220, 180, ${thrusterIntensity})`);
      mainEngineGradient.addColorStop(0.3, `rgba(255, 100, 50, ${thrusterIntensity * 0.8})`);
      mainEngineGradient.addColorStop(0.7, `rgba(200, 0, 0, ${thrusterIntensity * 0.6})`);
      mainEngineGradient.addColorStop(1, `rgba(100, 0, 0, ${thrusterIntensity * 0.3})`);
      
      ctx.shadowColor = '#ff3000';
      ctx.shadowBlur = 20 * enginePulse;
      ctx.fillStyle = mainEngineGradient;
      
      // Main engine exhaust - large central thrust
      ctx.beginPath();
      ctx.moveTo(-20, 50);
      ctx.lineTo(-30, 90);
      ctx.lineTo(0, 85);
      ctx.lineTo(30, 90);
      ctx.lineTo(20, 50);
      ctx.closePath();
      ctx.fill();
      
      // Secondary engines - side thrusters
      const secondaryGradient = ctx.createLinearGradient(-50, 40, -50, 80);
      secondaryGradient.addColorStop(0, `rgba(255, 200, 100, ${thrusterIntensity * 0.9})`);
      secondaryGradient.addColorStop(0.5, `rgba(255, 80, 0, ${thrusterIntensity * 0.7})`);
      secondaryGradient.addColorStop(1, `rgba(180, 0, 0, ${thrusterIntensity * 0.4})`);
      
      ctx.fillStyle = secondaryGradient;
      
      // Left secondary engine
      ctx.beginPath();
      ctx.moveTo(-50, 45);
      ctx.lineTo(-60, 75);
      ctx.lineTo(-40, 75);
      ctx.closePath();
      ctx.fill();
      
      // Right secondary engine
      ctx.beginPath();
      ctx.moveTo(50, 45);
      ctx.lineTo(60, 75);
      ctx.lineTo(40, 75);
      ctx.closePath();
      ctx.fill();
      
      // Auxiliary maneuvering thrusters
      ctx.fillStyle = `rgba(255, 100, 50, ${thrusterIntensity * 0.8})`;
      
      // Left auxiliary thrusters
      ctx.beginPath();
      ctx.moveTo(-85, 0);
      ctx.lineTo(-95, 15);
      ctx.lineTo(-80, 15);
      ctx.closePath();
      ctx.fill();
      
      // Right auxiliary thrusters
      ctx.beginPath();
      ctx.moveTo(85, 0);
      ctx.lineTo(95, 15);
      ctx.lineTo(80, 15);
      ctx.closePath();
      ctx.fill();
      
      // Engine particles - burning debris
      ctx.shadowBlur = 0;
      ctx.fillStyle = `rgba(255, 180, 50, ${thrusterIntensity * 0.9})`;
      
      for (let i = 0; i < 7; i++) {
        const particleSize = Math.random() * 3 + 1.5;
        const xOffset = Math.random() * 40 - 20;
        const yOffset = 85 + Math.random() * 10;
        
        ctx.beginPath();
        ctx.arc(xOffset, yOffset, particleSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Don't restore context yet - we need to draw the health bar after
    
    // ENHANCED HEALTH BAR SYSTEM - with threat indicators
    const healthBarWidth = 150;
    const healthPercentage = boss.currentHealth / boss.health;
    
    // Health bar background
    ctx.fillStyle = '#000000';
    ctx.fillRect(boss.x - healthBarWidth/2 - 2, boss.y - 90 - 2, healthBarWidth + 4, 14);
    
    // Health bar base
    ctx.fillStyle = '#1a0000';
    ctx.fillRect(boss.x - healthBarWidth/2, boss.y - 90, healthBarWidth, 10);
    
    // Health bar gradient - blood to fire
    const bossHealthGradient = ctx.createLinearGradient(boss.x - healthBarWidth/2, 0, boss.x + healthBarWidth/2, 0);
    bossHealthGradient.addColorStop(0, '#ff0000');
    bossHealthGradient.addColorStop(0.4, '#ff4000');
    bossHealthGradient.addColorStop(0.7, '#ff8000');
    bossHealthGradient.addColorStop(1, '#ffcc00');
    ctx.fillStyle = bossHealthGradient;
    ctx.fillRect(boss.x - healthBarWidth/2, boss.y - 90, healthPercentage * healthBarWidth, 10);
    
    // Health segments
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 1; i < 5; i++) {
      const x = boss.x - healthBarWidth/2 + (healthBarWidth * i / 5);
      ctx.moveTo(x, boss.y - 90);
      ctx.lineTo(x, boss.y - 80);
    }
    ctx.stroke();
    
    // Threat indicators - pulsing warning lights
    const warnPulse = Math.sin(time * 0.01) * 0.5 + 0.5;
    const indicatorSize = 6;
    ctx.fillStyle = `rgba(255, 50, 0, ${0.5 + warnPulse * 0.5})`;
    ctx.shadowColor = '#ff0000';
    ctx.shadowBlur = 10 * warnPulse;
    
    // Warning indicators on both sides
    ctx.beginPath();
    ctx.moveTo(boss.x - healthBarWidth/2 - indicatorSize - 4, boss.y - 90);
    ctx.lineTo(boss.x - healthBarWidth/2 - indicatorSize - 4 - indicatorSize, boss.y - 85);
    ctx.lineTo(boss.x - healthBarWidth/2 - indicatorSize - 4, boss.y - 80);
    ctx.closePath();
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(boss.x + healthBarWidth/2 + indicatorSize + 4, boss.y - 90);
    ctx.lineTo(boss.x + healthBarWidth/2 + indicatorSize + 4 + indicatorSize, boss.y - 85);
    ctx.lineTo(boss.x + healthBarWidth/2 + indicatorSize + 4, boss.y - 80);
    ctx.closePath();
    ctx.fill();
    
    // Boss name with intimidating typography
    ctx.shadowColor = '#ff2000';
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(boss.name.toUpperCase(), boss.x, boss.y - 105);
    
    // Threat classification
    ctx.font = '14px Arial';
    ctx.fillStyle = '#ff3000';
    ctx.shadowBlur = 10;
    ctx.fillText(`THREAT CLASS: OMEGA-${boss.level}`, boss.x, boss.y - 70);
    
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    
    // Now restore context
    ctx.restore();
  };

  const drawEnhancedProjectile = (ctx: CanvasRenderingContext2D, projectile: any) => {
    // Ensure trail exists before drawing
    if (projectile.trail && projectile.trail.length > 0) {
      projectile.trail.forEach((point, index) => {
        if (point && point.alpha > 0) {
          ctx.globalAlpha = point.alpha * 0.6;
          ctx.fillStyle = projectile.color;
          const size = (3 - (index / projectile.trail.length) * 2);
          ctx.beginPath();
          ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    }
    
    // Main projectile with glow
    ctx.globalAlpha = 1;
    ctx.shadowColor = projectile.color;
    ctx.shadowBlur = projectile.glowSize;
    ctx.fillStyle = projectile.color;
    ctx.beginPath();
    ctx.arc(projectile.x, projectile.y, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Core highlight
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(projectile.x, projectile.y, 2, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawEnhancedPowerUp = (ctx: CanvasRenderingContext2D, powerUpItem: any) => {
    const powerUp = powerUpItem.powerUp;
    const y = powerUpItem.y + powerUpItem.floatOffset;
    const pulseSize = 25 + Math.sin(powerUpItem.pulsePhase * 2) * 5;
    
    // Outer glow ring
    ctx.shadowColor = powerUp.color;
    ctx.shadowBlur = 20;
    ctx.strokeStyle = powerUp.color + '80';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(powerUpItem.x, y, pulseSize, 0, Math.PI * 2);
    ctx.stroke();
    
    // Inner energy ring
    ctx.shadowBlur = 10;
    ctx.strokeStyle = powerUp.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(powerUpItem.x, y, pulseSize - 8, 0, Math.PI * 2);
    ctx.stroke();
    
    // Core background
    ctx.shadowBlur = 0;
    const coreGradient = ctx.createRadialGradient(powerUpItem.x, y, 0, powerUpItem.x, y, 15);
    coreGradient.addColorStop(0, powerUp.color + 'AA');
    coreGradient.addColorStop(1, powerUp.color + '40');
    ctx.fillStyle = coreGradient;
    ctx.beginPath();
    ctx.arc(powerUpItem.x, y, 15, 0, Math.PI * 2);
    ctx.fill();
    
    // Icon with enhanced styling
    ctx.shadowColor = powerUp.color;
    ctx.shadowBlur = 5;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(powerUp.icon, powerUpItem.x, y + 10);
    
    // Rarity indicator particles
    if (powerUp.rarity !== 'common') {
      for (let i = 0; i < 3; i++) {
        const angle = (Date.now() * 0.005 + i * Math.PI * 2 / 3);
        const sparkX = powerUpItem.x + Math.cos(angle) * 35;
        const sparkY = y + Math.sin(angle) * 35;
        
        ctx.fillStyle = powerUp.color;
        ctx.beginPath();
        ctx.arc(sparkX, sparkY, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    ctx.shadowBlur = 0;
  };

  const drawEnhancedParticle = (ctx: CanvasRenderingContext2D, particle: any) => {
    ctx.globalAlpha = particle.life;
    
    if (particle.type === 'explosion') {
      ctx.shadowColor = particle.color;
      ctx.shadowBlur = particle.size;
    }
    
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  };

  const drawEnhancedUI = (ctx: CanvasRenderingContext2D, gameState: GameState, canvas: HTMLCanvasElement) => {
    const player = gameState.player;
    
    // Enhanced HUD background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, 10, 300, 140);
    ctx.strokeStyle = '#00ffaa';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, 300, 140);
    
    // Health bar with glow
    ctx.shadowColor = '#00ff00';
    ctx.shadowBlur = 5;
    ctx.fillStyle = '#333333';
    ctx.fillRect(25, 25, 250, 25);
    
    const healthGradient = ctx.createLinearGradient(25, 0, 275, 0);
    healthGradient.addColorStop(0, '#ff0000');
    healthGradient.addColorStop(0.5, '#ffaa00');
    healthGradient.addColorStop(1, '#00ff00');
    ctx.fillStyle = healthGradient;
    ctx.fillRect(25, 25, (player.health / player.maxHealth) * 250, 25);
    
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`HULL: ${player.health}/${player.maxHealth}`, 150, 42);
    
    // Shield bar (if active)
    if (player.shield > 0) {
      ctx.shadowColor = '#4ecdc4';
      ctx.shadowBlur = 5;
      ctx.fillStyle = '#333333';
      ctx.fillRect(25, 55, 250, 20);
      ctx.fillStyle = '#4ecdc4';
      ctx.fillRect(25, 55, (player.shield / 100) * 250, 20);
      ctx.shadowBlur = 0;
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px Arial';
      ctx.fillText(`SHIELD: ${player.shield}`, 150, 68);
    }
    
    // Energy bar
    const energyY = player.shield > 0 ? 80 : 60;
    ctx.shadowColor = '#0088ff';
    ctx.shadowBlur = 5;
    ctx.fillStyle = '#333333';
    ctx.fillRect(25, energyY, 250, 20);
    ctx.fillStyle = '#0088ff';
    ctx.fillRect(25, energyY, (player.energy / player.maxEnergy) * 250, 20);
    ctx.shadowBlur = 0;
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px Arial';
    ctx.fillText(`ENERGY: ${Math.floor(player.energy)}/${player.maxEnergy}`, 150, energyY + 13);
    
    // Score and level with enhanced styling
    ctx.fillStyle = '#00ffaa';
    ctx.font = 'bold 22px Arial';
    ctx.textAlign = 'left';
    const scoreY = energyY + 35;
    ctx.fillText(`SCORE: ${player.score.toLocaleString()}`, 25, scoreY);
    ctx.fillText(`RANK: ${player.level}`, 25, scoreY + 25);
    
    // Current weapon info
    const weapon = player.weapons[player.currentWeapon];
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px Arial';
    ctx.fillText(`WEAPON: ${weapon.name.toUpperCase()}`, 25, scoreY + 50);
    
    // Active power-ups panel
    if (gameState.activePowerUps.length > 0) {
      const panelX = canvas.width - 320;
      const panelY = 20;
      const panelHeight = Math.max(100, gameState.activePowerUps.length * 30 + 50);
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(panelX, panelY, 300, panelHeight);
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 2;
      ctx.strokeRect(panelX, panelY, 300, panelHeight);
      
      ctx.fillStyle = '#ffd700';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('ACTIVE POWER-UPS', panelX + 150, panelY + 25);
      
      gameState.activePowerUps.forEach((powerUp, index) => {
        const y = panelY + 50 + (index * 30);
        const timeLeft = Math.ceil((powerUp.remainingTime || 0) / 1000);
        
        ctx.fillStyle = powerUp.color;
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`${powerUp.icon} ${powerUp.name.toUpperCase()}`, panelX + 15, y);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(`${timeLeft}s`, panelX + 280, y);
      });
    }
    
    // Enhanced controls
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '14px Arial';
    ctx.textAlign = 'right';
    ctx.fillText('WASD/ARROWS: NAVIGATE', canvas.width - 25, canvas.height - 80);
    ctx.fillText('SPACE: FIRE WEAPONS', canvas.width - 25, canvas.height - 60);
    ctx.fillText('Q: SWITCH WEAPON', canvas.width - 25, canvas.height - 40);
    ctx.fillText('COLLECT POWER-UPS FOR TACTICAL ADVANTAGE', canvas.width - 25, canvas.height - 20);
    
    ctx.textAlign = 'left';
    ctx.shadowBlur = 0;
  };

  const drawGameOverOverlay = (ctx: CanvasRenderingContext2D, gameState: GameState, canvas: HTMLCanvasElement) => {
    // Dark overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Game Over title
    ctx.shadowColor = '#ff0000';
    ctx.shadowBlur = 20;
    ctx.fillStyle = '#ff0000';
    ctx.font = 'bold 64px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 200);
    
    // Stats panel background
    const panelWidth = 600;
    const panelHeight = 400;
    const panelX = (canvas.width - panelWidth) / 2;
    const panelY = canvas.height / 2 - 150;
    
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
    ctx.strokeStyle = '#00ffaa';
    ctx.lineWidth = 3;
    ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);
    
    // Stats title
    ctx.fillStyle = '#00ffaa';
    ctx.font = 'bold 32px Arial';
    ctx.fillText('MISSION REPORT', canvas.width / 2, panelY + 50);
    
    // Calculate game duration
    const gameDuration = Math.floor((Date.now() - gameState.gameStats.gameStartTime) / 1000);
    const minutes = Math.floor(gameDuration / 60);
    const seconds = gameDuration % 60;
    
    // Stats display
    const stats = [
      `🎯 FINAL SCORE: ${gameState.player.score.toLocaleString()}`,
      `🏅 RANK ACHIEVED: ${gameState.player.level}`,
      `💀 ENEMIES ELIMINATED: ${gameState.gameStats.enemiesKilled}`,
      `🐉 BOSSES DEFEATED: ${gameState.gameStats.bossesDefeated}`,
      `🎁 POWER-UPS COLLECTED: ${gameState.gameStats.powerUpsCollected}`,
      `🔫 SHOTS FIRED: ${gameState.gameStats.shotsFired}`,
      `💥 DAMAGE DEALT: ${gameState.gameStats.damageDealt.toLocaleString()}`,
      `⏱️ MISSION TIME: ${minutes}m ${seconds}s`,
      `🔫 WEAPONS ACQUIRED: ${gameState.player.weapons.length}`
    ];
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'left';
    
    stats.forEach((stat, index) => {
      const y = panelY + 100 + (index * 30);
      const x = panelX + 40;
      
      // Add colored icons
      if (stat.includes('SCORE')) ctx.fillStyle = '#ffd700';
      else if (stat.includes('RANK')) ctx.fillStyle = '#ff6b6b';
      else if (stat.includes('ENEMIES')) ctx.fillStyle = '#ff4444';
      else if (stat.includes('BOSSES')) ctx.fillStyle = '#ff00ff';
      else if (stat.includes('POWER-UPS')) ctx.fillStyle = '#4ecdc4';
      else ctx.fillStyle = '#ffffff';
      
      ctx.fillText(stat, x, y);
    });
    
    // Restart instructions
    ctx.fillStyle = '#ffaa00';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🚀 PRESS [R] TO RESTART MISSION 🚀', canvas.width / 2, panelY + panelHeight + 60);
    
    // Performance rating
    let rating = 'CADET';
    let ratingColor = '#888888';
    
    if (gameState.player.score > 5000) {
      rating = 'LEGEND';
      ratingColor = '#ffd700';
    } else if (gameState.player.score > 3000) {
      rating = 'ACE PILOT';
      ratingColor = '#ff6b6b';
    } else if (gameState.player.score > 1500) {
      rating = 'VETERAN';
      ratingColor = '#4ecdc4';
    } else if (gameState.player.score > 500) {
      rating = 'PILOT';
      ratingColor = '#00ffaa';
    }
    
    ctx.fillStyle = ratingColor;
    ctx.font = 'bold 28px Arial';
    ctx.fillText(`PILOT RATING: ${rating}`, canvas.width / 2, panelY + panelHeight + 100);
  };

  return (
    <div className="w-full h-screen overflow-hidden relative">
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
        style={{ 
          background: 'radial-gradient(ellipse at center, #0a0a2e 0%, #16213e 50%, #0f0f23 100%)',
          cursor: 'crosshair'
        }}
      />
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-center">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg px-6 py-3 border border-cyan-500/30">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            🚀 STARSHIP COMMANDER 🚀
          </h1>
          <p className="text-cyan-300 text-sm mt-1">
            Elite pilot engaging in deep space warfare
          </p>
        </div>
      </div>
    </div>
  );
});

GameEngine.displayName = 'GameEngine';
