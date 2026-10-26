import * as THREE from 'three';
import { createScene } from './createScene.js';
import { PlayerCharacter } from './entities/PlayerCharacter.js';
import { PursuerEntity } from './entities/PursuerEntity.js';
import {
  createBlockerCrate,
  createShadowWave,
  createSwayingSpecter,
  createDoubleBlockadeSingle,
  createRiftShard,
  createAmberOrb,
  createCardFragment,
  createShieldPowerup,
  createHeartPowerup,
} from './entities/SpawnVisuals.js';
import { GAME_CONFIG, GAME_STAGES } from '../../shared/gameConfig.js';
import { ENTITY_KEYS, EVENT_TYPES } from '../../shared/eventNames.js';
import { calculateScore } from '../../shared/scoreRules.js';
import {
  playLaneSwitchSfx,
  playJumpSfx,
  playShardPickupSfx,
  playRareOrbSfx,
  playCardFragmentSfx,
  playCollisionHitSfx,
  playStageClearSfx,
  playJumpscareSfx,
  playVictoryCelebrationSfx,
  playShieldPickupSfx,
  playShieldBreakSfx,
  playHeartPickupSfx,
  startBackgroundMusic,
  stopBackgroundMusic,
  updateWindAudio,
  stopWindAudio,
} from './soundEffects.js';

export const POKEMON_CARD_ROSTER = [
  {
    id: '001',
    artKey: 'mossbyte',
    name: 'Bulba-Moss',
    type: 'Grass / Poison',
    color: '#10b981',
    accentColor: '#34d399',
    symbol: 'GRS',
    hp: 120,
    attacks: [
      { name: 'Razor Vine Burst', damage: '40+', desc: 'Strikes with razor-sharp thorned vines. Deals 20 more damage if this Pokémon has full Vitality.' },
      { name: 'Solar Bloom Cataclysm', damage: '100', desc: 'Gathers stored photosynthetic energy in its bulb, unleashing a radiant beam that purifies dark carnival mist.' },
    ],
    rarity: 'Holo Rare',
    illustrator: 'GRIMDEX ARCHIVES',
    lore: 'A cybernetic bulb Pokémon fused with ancient carnival moss. The flower blooming on its back absorbs spectral energy and radiates a soothing emerald aura.',
  },
  {
    id: '002',
    artKey: 'lantern-hare',
    name: 'Pika-Lantern',
    type: 'Electric / Light',
    color: '#f59e0b',
    accentColor: '#fbbf24',
    symbol: 'FIR',
    hp: 130,
    attacks: [
      { name: 'Spark Beacon', damage: '45', desc: 'Discharges crackling high-voltage sparks from its cheek pouches, illuminating hidden track hazards.' },
      { name: 'Volt Overdrive Tackle', damage: '110', desc: 'Cloaks itself in blinding golden electricity and charges headlong through enemy barricades.' },
    ],
    rarity: 'Ultra Rare',
    illustrator: 'GRIMDEX ARCHIVES',
    lore: 'An energetic electric mouse leaping across ticket booths in a protective yellow slicker. Its lightning tail lantern guides lost runners through the dark.',
  },
  {
    id: '003',
    artKey: 'static-moth',
    name: 'Zap-Venomoth',
    type: 'Electric / Flying',
    color: '#38bdf8',
    accentColor: '#67e8f9',
    symbol: 'ELC',
    hp: 140,
    attacks: [
      { name: 'Electro Web Snare', damage: '50', desc: 'Spins a crackling mesh of blue lightning across the rails, paralyzing incoming shadows.' },
      { name: 'Thunder Vortex Hurricane', damage: '120', desc: 'Beats its charged storm wings to summon a deafening hurricane that scatters nearby spectral hazards.' },
    ],
    rarity: 'Secret Rare',
    illustrator: 'GRIMDEX ARCHIVES',
    lore: 'An electrified storm moth whose vibrating wings generate thousands of volts. It glides fearlessly along high-tension circus wires.',
  },
  {
    id: '004',
    artKey: 'velvet-wisp',
    name: 'Gengar-Wisp',
    type: 'Ghost / Poison',
    color: '#c084fc',
    accentColor: '#d8b4fe',
    symbol: 'PSI',
    hp: 140,
    attacks: [
      { name: 'Shadow Pulse Barrage', damage: '60', desc: 'Hurls an orb of concentrated ectoplasm from the ethereal plane into the physical track.' },
      { name: 'Nightmare Dream Eater', damage: '115', desc: 'Feeds upon the sinister fairground illusions spun by Pennywise, siphoning life back into the runner.' },
    ],
    rarity: 'Holo Rare',
    illustrator: 'GRIMDEX ARCHIVES',
    lore: 'A shadowy phantom trickster lurking behind the haunted Ferris wheel. Its iconic wide grin gleams with eldritch purple flames.',
  },
  {
    id: '005',
    artKey: 'clockwork-crow',
    name: 'Corvi-Gear',
    type: 'Steel / Flying',
    color: '#94a3b8',
    accentColor: '#cbd5e1',
    symbol: 'STL',
    hp: 150,
    attacks: [
      { name: 'Razor Wing Flurry', damage: '65', desc: 'Sweeps tempered steel feather blades forward, deflecting oncoming projectile hazards.' },
      { name: 'Clockwork Cog Overclock', damage: '130', desc: 'Rotates interlocking brass saw gears inside its chest cavity to shred reinforced obsidian blockades.' },
    ],
    rarity: 'Ultra Rare',
    illustrator: 'GRIMDEX ARCHIVES',
    lore: 'An imposing raven warrior forged from clockwork brass gears and gunmetal steel armor. It perches atop the carousel roof, ever vigilant.',
  },
  {
    id: '006',
    artKey: 'grinfin',
    name: 'Gyarados-Fin',
    type: 'Water / Dark',
    color: '#06b6d4',
    accentColor: '#22d3ee',
    symbol: 'WAT',
    hp: 160,
    attacks: [
      { name: 'Tidal Flume Surge', damage: '75', desc: 'Swings an armored serpentine tail to wash away track debris in a torrential neon deluge.' },
      { name: 'Apex Dragon Deluge', damage: '150', desc: 'Opens its three-crested fanged maw and roars with untamed aquatic fury, shattering Pennywise’s barrier.' },
    ],
    rarity: 'Apex Legendary',
    illustrator: 'GRIMDEX ARCHIVES',
    lore: 'A colossal sea dragon surging through the flooded subterranean flumes of Derry. Its ancient roar reverberates across dimensions.',
  },
  {
    id: '007',
    artKey: 'moonjaw',
    name: 'Tyran-Jaw',
    type: 'Rock / Dark',
    color: '#eab308',
    accentColor: '#fde047',
    symbol: 'RCK',
    hp: 170,
    attacks: [
      { name: 'Obsidian Jaw Crunch', damage: '85', desc: 'Clamps down with crushing prehistoric jaw force, fracturing the strongest carnival obstacles.' },
      { name: 'Lunar Hyper Beam', damage: '160', desc: 'Harnesses moonlight to fire an apocalyptic cosmic beam that obliterates reality along the center lane.' },
    ],
    rarity: 'Cosmic Secret',
    illustrator: 'GRIMDEX ARCHIVES',
    lore: 'A prehistoric apex juggernaut encased in black diamond carapace. It awakens only when the lunar eclipse bathes the fairground in silver.',
  },
  {
    id: '008',
    artKey: 'the-tethered',
    name: 'Penny-Mime EX',
    type: 'Psychic / Void',
    color: '#ef4444',
    accentColor: '#f97316',
    symbol: 'MYTH',
    hp: 200,
    attacks: [
      { name: 'Grimlight Hypnosis', damage: '100', desc: 'Summons three spinning glowing red balloons from beyond the stars, paralyzing all who behold them.' },
      { name: 'Grimlight Ray', damage: '150', desc: 'Focuses blinding apocalyptic cosmic rays from beyond the stars, cutting through reality along the center lane.' },
      { name: 'Grimlight Tsunami', damage: '170', desc: 'Traps the entire dimensional rift in a twisted deluge of grim mirrors until shattered by all six Codex seals.' },
    ],
    rarity: 'Apex Mythic',
    illustrator: 'GRIMDEX ARCHIVES',
    lore: 'The primordial shape-shifting cosmic jester inhabiting the abyss beneath Derry. Wields floating Poké-Balloons to lure runners into the eternal Grimlight.',
  },
];

export function getCardPickupInfo(stageCardsCollected, stageIndex = 0) {
  const card = POKEMON_CARD_ROSTER[stageIndex % POKEMON_CARD_ROSTER.length];
  const required = GAME_CONFIG.cardsRequiredPerStage || 5;
  const isFullCard = stageCardsCollected >= required;
  return {
    cardId: card.id,
    cardName: card.name,
    cardType: card.type,
    cardColor: card.color,
    cardSymbol: card.symbol,
    progress: stageCardsCollected,
    totalRequired: required,
    isFullCard,
    timestamp: Date.now(),
  };
}

export function evaluatePowerupSpawnNeed(state = {}, randomFn = Math.random) {
  const {
    health = 5,
    maxHealth = 5,
    shieldRemainingMs = 0,
    isHeartOnTrack = false,
    isShieldOnTrack = false,
    heartCooldownMs = 0,
    shieldCooldownMs = 0,
    survivalProbPct = 100,
    recentDamageMs = 99999,
  } = state;

  // Rule 1: Soul Heart (soul_heart) ONLY Spawns When Player Has Lost Health
  const canSpawnHeart = health < maxHealth && !isHeartOnTrack && heartCooldownMs <= 0;
  let heartProb = 0;
  if (canSpawnHeart) {
    if (health <= 2) {
      heartProb = 0.42;
    } else if (maxHealth - health === 2) {
      heartProb = 0.26;
    } else {
      heartProb = 0.16;
    }
  }

  // Rule 2: Aegis Shield (aegis_shield) ONLY Spawns When Player Needs Protection
  const userNeedsShield = (health < maxHealth) || (survivalProbPct < 68) || (recentDamageMs < 15000);
  const canSpawnShield = shieldRemainingMs <= 0 && !isShieldOnTrack && shieldCooldownMs <= 0 && userNeedsShield;
  let shieldProb = 0;
  if (canSpawnShield) {
    if (health <= 2) {
      shieldProb = 0.34;
    } else {
      shieldProb = 0.22;
    }
  }

  if (canSpawnHeart && randomFn() < heartProb) {
    return 'soul_heart';
  }

  if (canSpawnShield && randomFn() < shieldProb) {
    return 'aegis_shield';
  }

  return null;
}

const laneKey = ['left', 'center', 'right'];

export class GameEngine {
  constructor({ canvas, onStateChange, onRunEnd, onFrameTick, runnerId = 'pika-georgie' }) {
    this.canvas = canvas;
    this.onStateChange = onStateChange;
    this.onRunEnd = onRunEnd;
    this.onFrameTick = onFrameTick;
    this.runnerId = runnerId;

    this.world = createScene(canvas);
    this.clock = new THREE.Clock(false);

    // Player & Pursuer Voxel Rigs
    this.playerEntity = new PlayerCharacter(runnerId);
    this.world.scene.add(this.playerEntity.root);

    this.pursuerEntity = new PursuerEntity();
    this.world.scene.add(this.pursuerEntity.root);

    this.laneIndex = 1;
    this.targetX = GAME_CONFIG.laneCenters[1];
    this.currentX = GAME_CONFIG.laneCenters[1];
    this.cameraTiltZ = 0;
    this.lastHudSyncMs = 0;
    this.objects = [];
    this.pickupAnimations = [];
    this.upcomingCardLane = null;
    this.running = false;
    this.paused = false;

    // Powerup need cooldowns & telemetry
    this.heartCooldownMs = 0;
    this.shieldCooldownMs = 0;
    this.recentDamageMs = 99999;

    // 100% Functioning Deterministic Telemetry Engine
    this.laneTimeMs = [0, 0, 0];
    this.activeThreats = [];
    this.evasionLatencies = [];
    this.attackStats = {
      blocker_crate: { spawns: 0, hits: 0, dodges: 0 },
      shadow_wave: { spawns: 0, hits: 0, dodges: 0 },
      swaying_specter: { spawns: 0, hits: 0, dodges: 0 },
      double_blockade: { spawns: 0, hits: 0, dodges: 0 },
    };
    this.powerupStats = {
      shieldsCollected: 0,
      shieldsBroken: 0,
      heartsCollected: 0,
      heartHpRestored: 0,
      heartBonusScore: 0,
    };
    this.fatalProjectile = null;

    this.frame = this.frame.bind(this);
    this.resize = this.resize.bind(this);
    this.keydown = this.keydown.bind(this);

    window.addEventListener('resize', this.resize);
    window.addEventListener('keydown', this.keydown);
  }

  setRunnerType(runnerId) {
    this.runnerId = runnerId;
    this.playerEntity?.setRunnerType?.(runnerId);
  }

  emit(eventType, entityKey, amount = 0, laneIndex = null) {
    if (this.events.length < GAME_CONFIG.eventCap) {
      this.events.push({
        eventType,
        entityType: 'gameplay',
        entityKey,
        elapsedMs: Math.floor(this.elapsedMs),
        laneIndex,
        amount,
      });
    }
  }

  /**
   * Immediate HUD update dispatch - called ONLY on discrete events
   * (lane change, jump, damage hit, pickup, stage clear, pause, loss).
   */
  updateHudImmediate(extra = {}) {
    this.lastHudSyncMs = this.elapsedMs || 0;
    this.updateHud(extra);
  }

  createWarningRing(lane, color) {
    const ringGeo = new THREE.RingGeometry(0.55, 0.75, 24);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    const spawnZ = -GAME_CONFIG.spawnDistance;
    ringMesh.position.set(GAME_CONFIG.laneCenters[lane], 0.04, spawnZ);
    this.world.scene.add(ringMesh);
    return ringMesh;
  }

  disposeWarningRing(object) {
    if (object && object.warningRing) {
      this.world.scene.remove(object.warningRing);
      object.warningRing.geometry?.dispose();
      object.warningRing.material?.dispose();
      object.warningRing = null;
    }
  }

  getTelemetryState() {
    const totalLaneMs = (this.laneTimeMs?.[0] || 0) + (this.laneTimeMs?.[1] || 0) + (this.laneTimeMs?.[2] || 0);
    let laneOccupancyPct;
    if (totalLaneMs > 0) {
      laneOccupancyPct = (this.laneTimeMs || [0, 0, 0]).map((t) => Math.round((t / totalLaneMs) * 100));
      const sumPct = laneOccupancyPct[0] + laneOccupancyPct[1] + laneOccupancyPct[2];
      if (sumPct !== 100) {
        laneOccupancyPct[1] += 100 - sumPct;
      }
    } else {
      laneOccupancyPct = [0, 100, 0];
    }

    const currentSpeed = Math.max(1, this.currentSpeed || 11.0);
    const spawnDist = Math.abs(this.pursuerEntity ? this.pursuerEntity.root.position.z : -19);
    let meanReactionMs;
    if (this.evasionLatencies && this.evasionLatencies.length > 0) {
      meanReactionMs = Math.round(this.evasionLatencies.reduce((a, b) => a + b, 0) / this.evasionLatencies.length);
    } else {
      meanReactionMs = Math.round((spawnDist / (2 * currentSpeed)) * 1000);
    }

    let totalSpawns = 0;
    let totalHits = 0;
    const attackStatsCopy = {};
    if (this.attackStats) {
      Object.entries(this.attackStats).forEach(([k, v]) => {
        totalSpawns += v.spawns;
        totalHits += v.hits;
        const dodges = Math.max(0, v.spawns - v.hits);
        const dodgePct = v.spawns > 0 ? Math.round((dodges / v.spawns) * 100) : 100;
        attackStatsCopy[k] = { ...v, dodges, dodgePct };
      });
    }
    const dodgeEfficiencyPct = Math.round((Math.max(0, totalSpawns - totalHits) / Math.max(1, totalSpawns)) * 100);

    // Closed-Form Poisson Survival Probability P_survive
    const stageSecs = (this.stageElapsedMs || 0) / 1000;
    const tRem = Math.max(0, 60 - stageSecs);
    const spawnInterval = Math.max(0.2, this.currentSpawnInterval || 0.8);
    const currentStage = GAME_STAGES[this.currentStageIndex] || GAME_STAGES[0];
    const hazardChance = currentStage.hazardChance || 0.75;
    const nRem = (tRem / spawnInterval) * hazardChance;
    const stageNum = this.currentStageIndex + 1;
    const pHit = ((totalHits + 5 * (0.06 + 0.02 * stageNum)) / (totalSpawns + 5)) * Math.sqrt(currentSpeed / 11.0);
    const lambda = nRem * pHit;

    let pSurviveSum = 0;
    const h = Math.max(0, this.health);
    if (h <= 0) {
      pSurviveSum = 0;
    } else if (tRem <= 0) {
      pSurviveSum = 0.99;
    } else {
      for (let k = 0; k < h; k++) {
        let term = Math.exp(-lambda);
        for (let j = 1; j <= k; j++) {
          term *= lambda / j;
        }
        pSurviveSum += term;
      }
    }
    const survivalProbPct = h <= 0 ? 0 : Math.min(99, Math.max(1, Math.round(pSurviveSum * 100)));

    return {
      laneOccupancyPct,
      meanReactionMs,
      dodgeEfficiencyPct,
      survivalProbPct,
      attackStats: attackStatsCopy,
      totalSpawns,
      totalHits,
      fatalProjectile: this.fatalProjectile || null,
      powerupStats: {
        shieldsCollected: this.powerupStats?.shieldsCollected || 0,
        shieldsBroken: this.powerupStats?.shieldsBroken || 0,
        heartsCollected: this.powerupStats?.heartsCollected || 0,
        heartHpRestored: this.powerupStats?.heartHpRestored || 0,
        heartBonusScore: this.powerupStats?.heartBonusScore || 0,
      },
    };
  }

  /**
   * Primary HUD state builder dispatched to React onStateChange.
   */
  updateHud(extra = {}) {
    const currentStage = GAME_STAGES[this.currentStageIndex] || GAME_STAGES[0];
    const score = calculateScore({
      survivalSeconds: (this.elapsedMs || 0) / 1000,
      normalShardPickups: this.normalShards || 0,
      rareBonusPickups: this.rarePickups || 0,
      milestonesReached: this.milestones ? this.milestones.size : 0,
      stagesCleared: this.stagesCleared || 0,
      fragmentsCollected: this.fragmentsCollected || 0,
    }) + (this.bonusScore || 0);

    this.onStateChange?.({
      health: this.health,
      maxHealth: GAME_CONFIG.maxHealth,
      shards: (this.normalShards || 0) + ((this.rarePickups || 0) * 3) + ((this.stagesCleared || 0) * (GAME_CONFIG.rewards.stageClearShards ?? 15)),
      elapsedSeconds: (this.elapsedMs || 0) / 1000,
      stageNumber: this.currentStageIndex + 1,
      totalStages: GAME_STAGES.length,
      stageName: currentStage.name,
      stageSubtitle: currentStage.subtitle,
      stageElapsedSeconds: (this.stageElapsedMs || 0) / 1000,
      stageDurationSeconds: currentStage.durationSeconds,
      stagesCleared: this.stagesCleared || 0,
      stageCardsCollected: this.stageCardsCollected ?? 0,
      cardsRequiredPerStage: GAME_CONFIG.cardsRequiredPerStage ?? 5,
      fragmentsCollected: this.fragmentsCollected || 0,
      score,
      lane: this.laneIndex,
      jumping: this.jumpElapsedMs > 0,
      paused: this.paused,
      shieldRemainingMs: this.shieldRemainingMs || 0,
      devGodMode: Boolean(this.devGodMode),
      devAutoPilot: Boolean(this.devAutoPilot),
      devTimeScale: this.devTimeScale || 1.0,
      telemetry: this.getTelemetryState(),
      ...extra,
    });
  }

  start() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }

    // Force-clear any leftover meshes from prior run
    if (this.objects) {
      for (const obj of this.objects) {
        this.disposeWarningRing(obj);
        if (obj?.mesh) {
          this.world.scene.remove(obj.mesh);
        }
      }
      this.objects = [];
    }
    if (this.pickupAnimations) {
      for (const anim of this.pickupAnimations) {
        if (anim?.mesh) {
          this.world.scene.remove(anim.mesh);
        }
      }
      this.pickupAnimations = [];
    }

    this.isVictorySequenceActive = false;
    this.isLossSequenceActive = false;
    this.playerEntity?.setVictory(false);
    this.playerEntity?.setShieldActive(false);
    if (this.playerEntity?.root) {
      this.playerEntity.root.rotation.set(0, 0, 0);
    }
    this.pursuerEntity?.resetJumpscare?.();

    Object.assign(this, {
      running: true,
      paused: false,
      isLossSequenceActive: false,
      lossElapsedMs: 0,
      lossReason: null,
      elapsedMs: 0,
      stageElapsedMs: 0,
      lastHudSyncMs: 0,
      currentStageIndex: 0,
      stagesCleared: 0,
      fragmentsCollected: 0,
      stageCardsCollected: 0,
      scheduledCardIndex: 0,
      cardSpawnSafeGuardMs: 0,
      spawnElapsedMs: 0,
      jumpElapsedMs: 0,
      invulnerableMs: 0,
      health: GAME_CONFIG.startingHealth,
      normalShards: 0,
      rarePickups: 0,
      shieldRemainingMs: 0,
      heartCooldownMs: 0,
      shieldCooldownMs: 0,
      recentDamageMs: 99999,
      bonusScore: 0,
      devGodMode: this.devGodMode || false,
      devAutoPilot: this.devAutoPilot || false,
      devTimeScale: this.devTimeScale || 1.0,
      milestones: new Set(),
      events: [],
      distanceM: 0,
      cameraTiltZ: 0,
      upcomingCardLane: null,
      laneTimeMs: [0, 0, 0],
      activeThreats: [],
      evasionLatencies: [],
      attackStats: {
        blocker_crate: { spawns: 0, hits: 0, dodges: 0 },
        shadow_wave: { spawns: 0, hits: 0, dodges: 0 },
        swaying_specter: { spawns: 0, hits: 0, dodges: 0 },
        double_blockade: { spawns: 0, hits: 0, dodges: 0 },
      },
      powerupStats: {
        shieldsCollected: 0,
        shieldsBroken: 0,
        heartsCollected: 0,
        heartHpRestored: 0,
        heartBonusScore: 0,
      },
      fatalProjectile: null,
    });
    this.world.camera.fov = 53;
    this.world.camera.position.set(0, 5.2, 8.5);
    this.world.camera.lookAt(0, 1.2, -6);
    this.world.camera.updateProjectionMatrix();

    this.laneIndex = 1;
    this.targetX = GAME_CONFIG.laneCenters[1];
    this.currentX = GAME_CONFIG.laneCenters[1];
    if (this.playerEntity?.root) {
      this.playerEntity.root.visible = true;
    }
    this.playerEntity.root.position.set(this.currentX, 0, 0);

    this.world.applyAtmosphere(null, 1);
    this.updateHudImmediate();
    this.clock.start();
    startBackgroundMusic(1);
    this.frame();
  }

  triggerLossSequence(endReason) {
    if (this.isLossSequenceActive || !this.running) return;
    this.isLossSequenceActive = true;
    this.lossReason = endReason;
    this.lossElapsedMs = 0;
    this.lossDurationMs = 1350;

    // Immediately remove all track objects and pickup animations so giant cards don't block the camera lens
    if (this.objects) {
      for (const obj of this.objects) {
        this.disposeWarningRing(obj);
        if (obj?.mesh) {
          this.world.scene.remove(obj.mesh);
        }
      }
      this.objects = [];
    }
    if (this.pickupAnimations) {
      for (const anim of this.pickupAnimations) {
        if (anim?.mesh) {
          this.world.scene.remove(anim.mesh);
        }
      }
      this.pickupAnimations = [];
    }

    // Stop background music and wind audio during jumpscare
    stopBackgroundMusic();
    stopWindAudio();

    // Trigger action-reactive Web Audio jumpscare SFX
    playJumpscareSfx();

    // Hide player model so Pennywise's flight and unhinged bite are unobstructed
    if (this.playerEntity?.root) {
      this.playerEntity.root.visible = false;
    }

    // Trigger Pennywise flying towards the camera with unhinged jaw & Deadlights
    this.pursuerEntity?.triggerJumpscare?.();

    // Signal UI for sound cue and horror vignette
    this.updateHudImmediate({ jumpscareActive: true, lossReason: endReason });
  }

  keydown(event) {
    if (!this.running || this.paused || event.repeat) return;
    if (['ArrowLeft', 'a', 'A'].includes(event.key)) this.moveLane(-1);
    if (['ArrowRight', 'd', 'D'].includes(event.key)) this.moveLane(1);
    if ([' ', 'ArrowUp'].includes(event.key)) {
      event.preventDefault();
      this.jump();
    }
    if (['Escape', 'p', 'P'].includes(event.key)) this.pause();
  }

  moveLane(direction) {
    const prevLane = this.laneIndex;
    const next = Math.max(0, Math.min(2, this.laneIndex + direction));
    if (next !== this.laneIndex) {
      this.laneIndex = next;
      this.targetX = GAME_CONFIG.laneCenters[next];
      playLaneSwitchSfx(next);
      this.emit(EVENT_TYPES.LANE_CHANGE, laneKey[next], 0, next);

      // Track evasion reaction latencies for threats in previous lane
      if (this.activeThreats) {
        this.activeThreats.forEach((threat) => {
          if (!threat.dodged && threat.lane === prevLane) {
            threat.dodged = true;
            const latencyMs = Math.max(80, Math.round(this.elapsedMs - threat.spawnAtMs));
            this.evasionLatencies.push(latencyMs);
            if (this.attackStats && this.attackStats[threat.key]) {
              this.attackStats[threat.key].dodges += 1;
            }
          }
        });
      }

      this.updateHudImmediate();
    }
  }

  jump() {
    if (this.jumpElapsedMs === 0) {
      this.jumpElapsedMs = 1;
      playJumpSfx();
      this.emit(EVENT_TYPES.JUMP, ENTITY_KEYS.PLAYER_JUMP);

      // Track evasion reaction latencies for jumpable low skimmers in current lane
      if (this.activeThreats) {
        this.activeThreats.forEach((threat) => {
          if (!threat.dodged && threat.key === ENTITY_KEYS.SHADOW_WAVE && threat.lane === this.laneIndex) {
            threat.dodged = true;
            const latencyMs = Math.max(80, Math.round(this.elapsedMs - threat.spawnAtMs));
            this.evasionLatencies.push(latencyMs);
            if (this.attackStats && this.attackStats[threat.key]) {
              this.attackStats[threat.key].dodges += 1;
            }
          }
        });
      }

      this.updateHudImmediate();
    }
  }

  spawnScheduledCard(cardIndex, targetLane = null) {
    const spawnZ = -GAME_CONFIG.spawnDistance;
    let lane = targetLane;
    if (lane === null || lane === undefined) {
      const occupiedLanes = new Set(
        this.objects
          .filter((obj) => obj.isHazard && !obj.consumed && Math.abs(obj.mesh.position.z - spawnZ) < 14.0)
          .map((obj) => obj.lane)
      );
      const freeLanes = [0, 1, 2].filter((l) => !occupiedLanes.has(l));
      lane = freeLanes.length > 0 ? freeLanes[Math.floor(Math.random() * freeLanes.length)] : 1;
    }

    const mesh = createCardFragment();
    mesh.position.set(GAME_CONFIG.laneCenters[lane], 1.15, spawnZ);
    this.world.scene.add(mesh);

    // 2.4s buffer so the card has clean runway towards the player without hazards thrown directly behind it
    this.cardSpawnSafeGuardMs = 2400;

    this.objects.push({
      mesh,
      lane,
      isHazard: false,
      isWave: false,
      isSway: false,
      isRare: false,
      isFragment: true,
      isCard: true,
      cardIndex: cardIndex + 1,
      entityKey: ENTITY_KEYS.CARD_FRAGMENT,
      consumed: false,
    });
  }

  spawn() {
    const stage = GAME_STAGES[this.currentStageIndex] || GAME_STAGES[0];
    const stageNum = this.currentStageIndex + 1;
    const allowedHazards = stage.hazardTypes || ['blocker_crate', 'shadow_wave'];
    const spawnZ = -GAME_CONFIG.spawnDistance;

    const speed = (stage.speed && stage.speed.base) || 15;
    const throwDurationMs = Math.min(250, Math.max(130, Math.round((7.5 / speed) * 1000)));

    const isPredictiveCardWindow = this.upcomingCardLane !== null;

    const hazardChance = stage.hazardChance ?? 0.65;
    const isHazard = Math.random() < hazardChance;

    if (isHazard) {
      // If card spawn safeguard grace window is active, skip spawning hazard on this tick
      if (this.cardSpawnSafeGuardMs > 0) {
        return;
      }

      // Check if any uncollected card is currently active anywhere on the track
      const activeCards = this.objects.filter(
        (obj) => (obj.isCard || obj.isFragment) && !obj.consumed && obj.mesh.position.z < 2.0
      );
      const isCardActiveOnTrack = activeCards.length > 0;

      // Check if any card is within an extended 18.0 Z-unit buffer of spawn position
      const cardNearby = this.objects.some(
        (obj) => (obj.isCard || obj.isFragment) && !obj.consumed && Math.abs(obj.mesh.position.z - spawnZ) < 18.0
      );

      // Collect all lanes currently occupied by active/nearby cards or reserved for upcoming card
      const cardLanesOccupied = new Set();
      activeCards.forEach((c) => cardLanesOccupied.add(c.lane));
      if (isPredictiveCardWindow) {
        cardLanesOccupied.add(this.upcomingCardLane);
      }

      // If a card is active and nearby, skip hazard spawn to guarantee fair runway
      if (isCardActiveOnTrack && cardNearby) {
        return;
      }

      // Scaled progressive hazard chances (+0.3x arcade challenge)
      const doubleChance = 0.11 + Math.max(0, this.currentStageIndex - 2) * 0.035; // 0.11 in S3, 0.145 in S4, 0.18 in S5, 0.215 in S6
      const swayChance = 0.17 + Math.max(0, this.currentStageIndex - 1) * 0.035; // 0.17 in S2, 0.205 in S3, etc.
      const waveChance = 0.30 + this.currentStageIndex * 0.025;

      // If a card is active on track, nearby, or in predictive card window:
      // STRICTLY FORBID double_blockade and swaying_specter!
      const canDoDouble = !isCardActiveOnTrack && !isPredictiveCardWindow && !cardNearby && allowedHazards.includes('double_blockade') && Math.random() < doubleChance;
      const canDoSway = !isCardActiveOnTrack && !isPredictiveCardWindow && !cardNearby && allowedHazards.includes('swaying_specter') && Math.random() < swayChance;
      const canDoWave = allowedHazards.includes('shadow_wave') && Math.random() < waveChance;

      if (canDoDouble) {
        const openLane = Math.floor(Math.random() * 3);
        const blockedLanes = [0, 1, 2].filter((l) => l !== openLane);

        this.pursuerEntity?.triggerThrowAnimation?.('double_blockade', openLane);
        const handPos = this.pursuerEntity?.getHandWorldPosition?.('both') || { x: 0, y: 5.4, z: spawnZ };

        blockedLanes.forEach((lane) => {
          const mesh = createDoubleBlockadeSingle(lane, openLane, stageNum);
          mesh.position.set(handPos.x, handPos.y, handPos.z);
          mesh.scale.set(0.35, 0.35, 0.35);
          this.world.scene.add(mesh);

          const warningRing = this.createWarningRing(lane, 0xef4444);

          this.objects.push({
            mesh,
            warningRing,
            lane,
            targetLaneX: GAME_CONFIG.laneCenters[lane],
            landingY: 0.72,
            isHazard: true,
            isWave: false,
            isSway: false,
            entityKey: ENTITY_KEYS.DOUBLE_BLOCKADE,
            consumed: false,
            isThrownProjectile: true,
            throwElapsedMs: 0,
            throwDurationMs,
            startX: handPos.x,
            startY: handPos.y,
            startZ: handPos.z,
          });

          this.activeThreats.push({ spawnAtMs: this.elapsedMs, lane, key: ENTITY_KEYS.DOUBLE_BLOCKADE, dodged: false });
          if (this.attackStats) this.attackStats.double_blockade.spawns += 1;
        });
        this.emit(EVENT_TYPES.OBSTACLE_SPAWN, ENTITY_KEYS.DOUBLE_BLOCKADE, 0, openLane);
        return;
      }

      // Choose a lane that excludes any active/nearby card's lane and the reserved upcoming card lane
      const availableLanes = [0, 1, 2].filter((l) => !cardLanesOccupied.has(l));
      if (availableLanes.length === 0) return;
      const lane = availableLanes[Math.floor(Math.random() * availableLanes.length)];

      if (canDoSway) {
        this.pursuerEntity?.triggerThrowAnimation?.('swaying_specter', lane);
        const hand = this.pursuerEntity?.lastThrowHand || 'right';
        const handPos = this.pursuerEntity?.getHandWorldPosition?.(hand) || { x: GAME_CONFIG.laneCenters[lane], y: 5.4, z: spawnZ };

        const mesh = createSwayingSpecter(stageNum);
        mesh.position.set(handPos.x, handPos.y, handPos.z);
        mesh.scale.set(0.35, 0.35, 0.35);
        this.world.scene.add(mesh);

        const warningRing = this.createWarningRing(lane, 0xa855f7);

        this.objects.push({
          mesh,
          warningRing,
          lane,
          baseX: GAME_CONFIG.laneCenters[lane],
          targetLaneX: GAME_CONFIG.laneCenters[lane],
          landingY: 1.25,
          swayTime: Math.random() * 10,
          isHazard: true,
          isWave: false,
          isSway: true,
          entityKey: ENTITY_KEYS.SWAYING_SPECTER,
          consumed: false,
          isThrownProjectile: true,
          throwElapsedMs: 0,
          throwDurationMs,
          startX: handPos.x,
          startY: handPos.y,
          startZ: handPos.z,
        });

        this.activeThreats.push({ spawnAtMs: this.elapsedMs, lane, key: ENTITY_KEYS.SWAYING_SPECTER, dodged: false });
        if (this.attackStats) this.attackStats.swaying_specter.spawns += 1;
        this.emit(EVENT_TYPES.OBSTACLE_SPAWN, ENTITY_KEYS.SWAYING_SPECTER, 0, lane);
        return;
      }

      const isWave = canDoWave;
      const entityKey = isWave ? ENTITY_KEYS.SHADOW_WAVE : ENTITY_KEYS.BLOCKER_CRATE;
      this.pursuerEntity?.triggerThrowAnimation?.(entityKey, lane);
      const hand = this.pursuerEntity?.lastThrowHand || 'right';
      const handPos = this.pursuerEntity?.getHandWorldPosition?.(hand) || { x: GAME_CONFIG.laneCenters[lane], y: 5.4, z: spawnZ };

      const mesh = isWave ? createShadowWave(stageNum) : createBlockerCrate(stageNum);
      const landingY = isWave ? 0.22 : 0.72;
      mesh.position.set(handPos.x, handPos.y, handPos.z);
      mesh.scale.set(0.35, 0.35, 0.35);
      this.world.scene.add(mesh);

      const warningRing = this.createWarningRing(lane, isWave ? 0x06b6d4 : 0xef4444);

      this.objects.push({
        mesh,
        warningRing,
        lane,
        baseX: GAME_CONFIG.laneCenters[lane],
        targetLaneX: GAME_CONFIG.laneCenters[lane],
        landingY,
        isHazard: true,
        isWave,
        isSway: false,
        entityKey,
        consumed: false,
        isThrownProjectile: true,
        throwElapsedMs: 0,
        throwDurationMs,
        startX: handPos.x,
        startY: handPos.y,
        startZ: handPos.z,
      });

      this.activeThreats.push({ spawnAtMs: this.elapsedMs, lane, key: entityKey, dodged: false });
      if (this.attackStats) this.attackStats[entityKey].spawns += 1;
      this.emit(EVENT_TYPES.OBSTACLE_SPAWN, entityKey, 0, lane);

      // In Stages 3 to 6, when spawning a single-lane blocker_crate (and no card is active/nearby),
      // allow a (25% + stageIndex * 6%) chance to simultaneously spawn a jumpable shadow_wave in an adjacent safe lane
      if (!isWave && !isCardActiveOnTrack && !cardNearby && !isPredictiveCardWindow && this.currentStageIndex >= 2 && allowedHazards.includes('shadow_wave')) {
        const comboChance = 0.25 + this.currentStageIndex * 0.06;
        if (Math.random() < comboChance) {
          const adjCandidates = lane === 1 ? [0, 2] : [1];
          const validAdj = adjCandidates.filter((l) => !cardLanesOccupied.has(l));
          if (validAdj.length > 0) {
            const adjLane = validAdj[Math.floor(Math.random() * validAdj.length)];
            const otherHand = hand === 'right' ? 'left' : 'right';
            const comboHandPos = this.pursuerEntity?.getHandWorldPosition?.(otherHand) || { x: GAME_CONFIG.laneCenters[adjLane], y: 5.4, z: spawnZ };

            const waveMesh = createShadowWave(stageNum);
            waveMesh.position.set(comboHandPos.x, comboHandPos.y, comboHandPos.z);
            waveMesh.scale.set(0.35, 0.35, 0.35);
            this.world.scene.add(waveMesh);

            const comboRing = this.createWarningRing(adjLane, 0x06b6d4);

            this.objects.push({
              mesh: waveMesh,
              warningRing: comboRing,
              lane: adjLane,
              baseX: GAME_CONFIG.laneCenters[adjLane],
              targetLaneX: GAME_CONFIG.laneCenters[adjLane],
              landingY: 0.22,
              isHazard: true,
              isWave: true,
              isSway: false,
              entityKey: ENTITY_KEYS.SHADOW_WAVE,
              consumed: false,
              isThrownProjectile: true,
              throwElapsedMs: 0,
              throwDurationMs,
              startX: comboHandPos.x,
              startY: comboHandPos.y,
              startZ: comboHandPos.z,
            });

            this.activeThreats.push({ spawnAtMs: this.elapsedMs, lane: adjLane, key: ENTITY_KEYS.SHADOW_WAVE, dodged: false });
            if (this.attackStats) this.attackStats.shadow_wave.spawns += 1;
            this.emit(EVENT_TYPES.OBSTACLE_SPAWN, ENTITY_KEYS.SHADOW_WAVE, 0, adjLane);
          }
        }
      }
    } else {
      // Pickups: Aegis Shield (14%), Soul Heart (12% hurt / 5% full), Amber Orb, or Rift Shard
      const occupiedAtZ = new Set(
        this.objects
          .filter((obj) => !obj.consumed && Math.abs(obj.mesh.position.z - spawnZ) < 4.5)
          .map((obj) => obj.lane)
      );
      if (isPredictiveCardWindow) {
        occupiedAtZ.add(this.upcomingCardLane);
      }

      const availableShardLanes = [0, 1, 2].filter((l) => !occupiedAtZ.has(l));
      if (availableShardLanes.length === 0) {
        // Skip spawning pickup if all 3 lanes are occupied at that exact Z
        return;
      }

      const lane = availableShardLanes[Math.floor(Math.random() * availableShardLanes.length)];
      const maxHp = GAME_CONFIG.maxHealth || 5;

      // Prevent redundant powerup spam: don't spawn duplicate heart/shield if one is already on track
      const isShieldOnTrack = this.objects.some((obj) => obj.isShield && !obj.consumed);
      const isHeartOnTrack = this.objects.some((obj) => obj.isHeart && !obj.consumed);

      const telemetry = this.getTelemetryState ? this.getTelemetryState() : {};
      const survivalProbPct = telemetry.survivalProbPct ?? 100;

      const powerupNeeded = evaluatePowerupSpawnNeed({
        health: this.health,
        maxHealth: maxHp,
        shieldRemainingMs: this.shieldRemainingMs || 0,
        isHeartOnTrack,
        isShieldOnTrack,
        heartCooldownMs: this.heartCooldownMs || 0,
        shieldCooldownMs: this.shieldCooldownMs || 0,
        survivalProbPct,
        recentDamageMs: this.recentDamageMs ?? 99999,
      });

      let isShield = false;
      let isHeart = false;
      let isRare = false;
      let mesh;
      let entityKey;

      if (powerupNeeded === 'soul_heart') {
        isHeart = true;
        mesh = createHeartPowerup();
        entityKey = 'soul_heart';
      } else if (powerupNeeded === 'aegis_shield') {
        isShield = true;
        mesh = createShieldPowerup();
        entityKey = 'aegis_shield';
      } else {
        isRare = Math.random() < 0.28;
        mesh = isRare ? createAmberOrb() : createRiftShard();
        entityKey = isRare ? ENTITY_KEYS.AMBER_ORB : ENTITY_KEYS.RIFT_SHARD;
      }

      mesh.position.set(GAME_CONFIG.laneCenters[lane], 1.05, spawnZ);
      this.world.scene.add(mesh);

      this.objects.push({
        mesh,
        lane,
        isHazard: false,
        isWave: false,
        isSway: false,
        isRare,
        isShield,
        isHeart,
        isFragment: false,
        isCard: false,
        entityKey,
        consumed: false,
      });
    }
  }

  updateObjects(deltaMs, speed) {
    const dt = deltaMs / 1000;

    // 1. Update active 3D pickup animations (Ascend & Golden Burst)
    if (this.pickupAnimations && this.pickupAnimations.length > 0) {
      this.pickupAnimations = this.pickupAnimations.filter((anim) => {
        anim.elapsedMs += deltaMs;
        const progress = Math.min(1, anim.elapsedMs / anim.maxMs);
        anim.mesh.position.y = anim.startY + (3.6 - anim.startY) * progress;
        anim.mesh.position.x += (this.currentX - anim.mesh.position.x) * Math.min(1, deltaMs / 70);
        anim.mesh.rotation.y += dt * 18;

        let scale = 1;
        if (progress < 0.35) {
          scale = 1 + (progress / 0.35) * 0.45; // pulses to 1.45x
        } else {
          scale = 1.45 * (1 - (progress - 0.35) / 0.65); // shrinks to 0.05
          scale = Math.max(0.05, scale);
        }
        anim.mesh.scale.set(scale, scale, scale);

        if (anim.elapsedMs >= anim.maxMs) {
          this.world.scene.remove(anim.mesh);
          return false;
        }
        return true;
      });
    }

    // Rule 3: Despawn Unneeded Hearts Immediately if player is at full health
    const maxHp = GAME_CONFIG.maxHealth || 5;
    if (this.health >= maxHp) {
      for (const obj of this.objects) {
        if (obj.isHeart && !obj.consumed) {
          obj.consumed = true;
          this.disposeWarningRing(obj);
          if (obj.mesh) {
            this.world.scene.remove(obj.mesh);
          }
        }
      }
    }

    // 2. Update track objects
    for (const object of this.objects) {
      const prevZ = object.mesh.position.z;
      object.mesh.position.z += speed * dt;

      // Ballistic Lob Trajectory for Thrown Projectiles
      if (object.isThrownProjectile) {
        if (object.throwElapsedMs < object.throwDurationMs) {
          object.throwElapsedMs += deltaMs;
          const u = Math.min(1, object.throwElapsedMs / object.throwDurationMs);
          object.mesh.position.x = THREE.MathUtils.lerp(object.startX, object.targetLaneX, u);
          object.mesh.position.y = THREE.MathUtils.lerp(object.startY, object.landingY, u) + Math.sin(u * Math.PI) * 1.65;
          const s = 0.35 + 0.65 * u;
          object.mesh.scale.set(s, s, s);
        } else {
          object.mesh.position.y = object.landingY;
          if (!object.isSway) {
            object.mesh.position.x = object.targetLaneX;
            object.mesh.rotation.set(0, 0, 0);
          }
          object.mesh.scale.set(1, 1, 1);
        }
      }

      if (object.warningRing) {
        // Warning rings strictly indicate approaching threats - dispose immediately once reaching/passing player
        if (object.mesh.position.z > 0.5) {
          this.disposeWarningRing(object);
        } else {
          object.warningRing.position.set(object.mesh.position.x, 0.04, object.mesh.position.z);
        }
      }

      if (object.isSway) {
        object.swayTime += deltaMs * (0.0020 + this.currentStageIndex * 0.0005);
        const maxOffset = 1.05 + this.currentStageIndex * 0.16;
        const offset = Math.sin(object.swayTime) * maxOffset;
        if (!object.isThrownProjectile || object.throwElapsedMs >= object.throwDurationMs) {
          object.mesh.position.x = Math.max(-3.5, Math.min(3.5, object.baseX + offset));
          object.mesh.rotation.z = Math.cos(object.swayTime) * 0.20;
        }

        let closestLane = 1;
        let minDiff = 999;
        GAME_CONFIG.laneCenters.forEach((center, idx) => {
          const diff = Math.abs(object.mesh.position.x - center);
          if (diff < minDiff) {
            minDiff = diff;
            closestLane = idx;
          }
        });
        object.lane = closestLane;
      }

      if (!object.isHazard) {
        object.mesh.rotation.y += deltaMs * 0.006;

        if (object.mesh.userData.beaconRing) {
          object.mesh.userData.beaconRing.rotation.z += deltaMs * 0.005;
        }
        if (object.mesh.userData.haloRing) {
          object.mesh.userData.haloRing.rotation.z += deltaMs * 0.008;
        }
        if (object.mesh.userData.outerRing) {
          object.mesh.userData.outerRing.rotation.z -= deltaMs * 0.009;
        }
        if (object.mesh.userData.innerRing) {
          object.mesh.userData.innerRing.rotation.x += deltaMs * 0.007;
        }
        if (object.mesh.userData.sparkles) {
          object.mesh.userData.sparkles.forEach((sp) => {
            sp.offset += deltaMs * 0.005;
            sp.mesh.position.set(Math.cos(sp.offset) * 0.55, Math.sin(sp.offset * 2) * 0.35, Math.sin(sp.offset) * 0.55);
          });
        }
      }

      // Swept Z-Interval Collision Detection (Anti-Tunneling)
      const hitZ = prevZ <= 0.95 && object.mesh.position.z >= -0.95;
      // Combined Physical X-Hitbox & Lane Check (+0.3x Arcade Precision)
      const hitX = Math.abs(object.mesh.position.x - this.currentX) < 0.90 ||
        (object.lane === this.laneIndex && Math.abs(this.currentX - GAME_CONFIG.laneCenters[this.laneIndex]) < 0.62);

      if (!object.consumed && hitZ && hitX) {
        const playerY = this.playerEntity?.root?.position?.y || 0;
        const clearedWave = object.isWave && playerY >= 0.28;

        if (object.isHazard && !clearedWave && this.invulnerableMs <= 0) {
          object.consumed = true;
          this.disposeWarningRing(object);

          if (this.devGodMode) {
            this.invulnerableMs = 450;
            this.updateHudImmediate({ hit: false });
          } else if (this.shieldRemainingMs > 0) {
            // Shield absorbs impact: 0 Hearts lost
            if (!this.powerupStats) {
              this.powerupStats = { shieldsCollected: 0, shieldsBroken: 0, heartsCollected: 0, heartHpRestored: 0, heartBonusScore: 0 };
            }
            this.powerupStats.shieldsBroken = (this.powerupStats.shieldsBroken || 0) + 1;
            this.shieldRemainingMs = 0;
            this.playerEntity?.setShieldActive?.(false);
            this.playerEntity?.triggerShieldBreakEffect?.();
            this.shieldCooldownMs = 10000;
            playShieldBreakSfx();
            this.invulnerableMs = 900;
            this.updateHudImmediate({ shieldBroken: true });
          } else {
            if (this.attackStats && this.attackStats[object.entityKey]) {
              this.attackStats[object.entityKey].hits += 1;
            }
            this.health -= 1;
            this.recentDamageMs = 0;
            if (this.health <= 0) {
              this.fatalProjectile = object.entityKey;
            }
            this.invulnerableMs = 1200;
            playCollisionHitSfx();
            this.emit(EVENT_TYPES.COLLISION, object.entityKey, 0, object.lane);
            this.updateHudImmediate({ hit: true });
            if (this.health <= 0) {
              this.triggerLossSequence('hit_points_zero');
              return;
            }
          }
        }

        if (!object.isHazard) {
          object.consumed = true;
          if (object.isFragment || object.isCard) {
            object.inPickupAnim = true;
            this.stageCardsCollected = (this.stageCardsCollected ?? 0) + 1;
            this.fragmentsCollected += 1;
            const isFullCard = this.stageCardsCollected >= (GAME_CONFIG.cardsRequiredPerStage || 5);
            playCardFragmentSfx(isFullCard);
            this.emit(EVENT_TYPES.FRAGMENT_PICKUP, ENTITY_KEYS.CARD_FRAGMENT, 1, object.lane);
            const cardPickup = getCardPickupInfo(this.stageCardsCollected, this.currentStageIndex);

            // 3D Card Ascend & Golden Burst animation
            this.pickupAnimations.push({
              mesh: object.mesh,
              elapsedMs: 0,
              maxMs: 450,
              startX: object.mesh.position.x,
              startY: object.mesh.position.y || 1.15,
            });

            this.updateHudImmediate({
              fragmentGot: true,
              cardPickup,
              stageCardsCollected: this.stageCardsCollected,
            });
          } else if (object.isShield) {
            if (!this.powerupStats) {
              this.powerupStats = { shieldsCollected: 0, shieldsBroken: 0, heartsCollected: 0, heartHpRestored: 0, heartBonusScore: 0 };
            }
            this.powerupStats.shieldsCollected = (this.powerupStats.shieldsCollected || 0) + 1;
            this.shieldRemainingMs = 10000;
            playShieldPickupSfx();
            this.playerEntity?.setShieldActive?.(true);
            this.playerEntity?.triggerShieldActivateEffect?.();
            this.updateHudImmediate({ shieldGot: true });
          } else if (object.isHeart) {
            if (!this.powerupStats) {
              this.powerupStats = { shieldsCollected: 0, shieldsBroken: 0, heartsCollected: 0, heartHpRestored: 0, heartBonusScore: 0 };
            }
            this.powerupStats.heartsCollected = (this.powerupStats.heartsCollected || 0) + 1;
            const maxHpVal = GAME_CONFIG.maxHealth || 5;
            if (this.health < maxHpVal) {
              this.health = Math.min(maxHpVal, this.health + 1);
              this.powerupStats.heartHpRestored = (this.powerupStats.heartHpRestored || 0) + 1;
            } else {
              this.bonusScore = (this.bonusScore || 0) + 150;
              this.powerupStats.heartBonusScore = (this.powerupStats.heartBonusScore || 0) + 150;
            }
            this.heartCooldownMs = 9000;
            this.playerEntity?.triggerHeartHealEffect?.();
            playHeartPickupSfx();
            this.updateHudImmediate({ heartGot: true });
          } else if (object.isRare) {
            this.rarePickups += 1;
            playRareOrbSfx();
            this.emit(EVENT_TYPES.RARE_PICKUP, ENTITY_KEYS.AMBER_ORB, 3, object.lane);
            this.updateHudImmediate();
          } else {
            this.normalShards += 1;
            playShardPickupSfx();
            this.emit(EVENT_TYPES.SHARD_PICKUP, ENTITY_KEYS.RIFT_SHARD, 1, object.lane);
            this.updateHudImmediate();
          }
        }
      }

      // Zero-miss enforcement: If a card floats past the player (z > 2.0) uncollected, run fails immediately!
      if ((object.isFragment || object.isCard) && !object.consumed && object.mesh.position.z > 2.0) {
        object.consumed = true;
        this.emit(EVENT_TYPES.CARD_MISSED, ENTITY_KEYS.CARD_FRAGMENT, 0, object.lane);
        if (!this.devGodMode) {
          this.triggerLossSequence('card_missed');
          return;
        }
      }
    }

    // Zero-GC Removal: Remove mesh from scene when behind camera (> 12.5) or non-animating consumed
    this.objects = this.objects.filter((object) => {
      if (object.consumed) {
        this.disposeWarningRing(object);
        if (!object.inPickupAnim && object.mesh) {
          this.world.scene.remove(object.mesh);
        }
        return false;
      }
      if (object.mesh.position.z > 12.5) {
        this.disposeWarningRing(object);
        this.world.scene.remove(object.mesh);
        return false;
      }
      return true;
    });
  }

  advanceStage() {
    const completedStageNum = this.currentStageIndex + 1;
    playStageClearSfx();
    const stageKey = ENTITY_KEYS[`STAGE_${completedStageNum}`];
    this.emit(EVENT_TYPES.STAGE_CLEAR, stageKey, 1);
    this.stagesCleared += 1;

    const completedCard = {
      ...POKEMON_CARD_ROSTER[this.currentStageIndex % POKEMON_CARD_ROSTER.length],
      stageNumber: completedStageNum,
      cardsCollected: this.stageCardsCollected,
      totalRequired: GAME_CONFIG.cardsRequiredPerStage || 5,
    };

    // Reset per-stage card counters and predictive lane reservation
    this.stageCardsCollected = 0;
    this.scheduledCardIndex = 0;
    this.upcomingCardLane = null;

    // Purge all track objects and pickup animations so zero items from previous stage remain
    if (this.objects) {
      for (const obj of this.objects) {
        this.disposeWarningRing(obj);
        if (obj?.mesh) {
          this.world.scene.remove(obj.mesh);
        }
      }
      this.objects = [];
    }
    if (this.pickupAnimations) {
      for (const anim of this.pickupAnimations) {
        if (anim?.mesh) {
          this.world.scene.remove(anim.mesh);
        }
      }
      this.pickupAnimations = [];
    }

    if (this.currentStageIndex < GAME_STAGES.length - 1) {
      this.currentStageIndex += 1;
      this.stageElapsedMs = 0;

      this.world.applyAtmosphere(null, this.currentStageIndex + 1);

      this.updateHudImmediate({
        stageCompletedCard: completedCard,
      });
    } else {
      // Stage 6 complete: directly launch Pennywise's Demise & Hexedex Seal Cutscene!
      this.triggerVictorySequence();
    }
  }

  triggerVictorySequence() {
    this.running = true;
    this.paused = false;
    this.isLossSequenceActive = false;
    this.isVictorySequenceActive = true;
    this.victoryElapsedMs = 0;
    this.victoryDurationMs = 5200;
    this.clock.getDelta();

    // Smoothly center the player in middle lane at Z = 1.5
    this.targetX = 0;
    this.currentX = 0;
    if (this.playerEntity?.root) {
      this.playerEntity.root.position.set(0, 0, 1.5);
      this.playerEntity.root.rotation.set(0, 0, 0);
    }

    stopBackgroundMusic();
    stopWindAudio();
    playVictoryCelebrationSfx();

    // Clear all remaining track hazards and pickup meshes
    if (this.objects) {
      for (const obj of this.objects) {
        this.disposeWarningRing(obj);
        if (obj?.mesh) {
          this.world.scene.remove(obj.mesh);
        }
      }
      this.objects = [];
    }
    if (this.pickupAnimations) {
      for (const anim of this.pickupAnimations) {
        if (anim?.mesh) {
          this.world.scene.remove(anim.mesh);
        }
      }
      this.pickupAnimations = [];
    }

    this.pursuerEntity?.triggerDefeatCollapse();
    this.playerEntity?.setVictory(true);

    this.updateHudImmediate({
      victorySequenceActive: true,
      paused: false,
    });
  }

  frame() {
    if (!this.running) return;
    const rawDelta = this.clock.getDelta() * 1000;
    const scale = this.devTimeScale || 1.0;
    const deltaMs = Math.min(rawDelta * scale, 50 * scale);
    const dt = deltaMs / 1000;

    // Grand Victory Sequence (5.2s 4-phase defeat cutscene & celebration)
    if (this.isVictorySequenceActive) {
      this.victoryElapsedMs += deltaMs;

      this.pursuerEntity?.updateDefeat(deltaMs);
      this.playerEntity?.updateVictory(deltaMs);

      // Keep 60FPS speech bubble tracking active during cutscene
      const pursuerSpeechPos = this.pursuerEntity?.getSpeechBubbleScreenCoords(this.world.camera);
      this.onFrameTick?.({
        stageProgressRatio: 1,
        speed: 0,
        pursuerSpeechPos,
        victoryElapsedMs: this.victoryElapsedMs,
      });

      // Dynamic Camera Choreography:
      // Phase 1 - 3 (0.0s to 4.0s): Frame celebrating runner in lower foreground and Pennywise in center-midground
      // camera damping toward (0, 3.8, 7.2) looking at (0, 1.8, -4.5) with impact shakes
      // Phase 4 (4.0s to 5.2s): Smoothly transition to hero angle (0, 2.8, 5.2) looking at (0, 1.3, 1.5)
      const tSec = this.victoryElapsedMs / 1000;

      let targetCamX = 0;
      let targetCamY = 3.8;
      let targetCamZ = 7.2;
      let lookX = 0;
      let lookY = 1.8;
      let lookZ = -4.5;
      let camDamp = Math.min(1, dt * 2.8);

      if (tSec >= 4.0) {
        targetCamX = 0;
        targetCamY = 2.8;
        targetCamZ = 5.2;
        lookX = 0;
        lookY = 1.3;
        lookZ = 1.5;
        camDamp = Math.min(1, dt * 3.6);
      }

      // Calculate camera shake on balloon pops and abyssal drag
      let shakeAmp = 0;
      const impacts = [0.35, 0.75, 1.15, 2.8];
      for (const impact of impacts) {
        const diff = tSec - impact;
        if (diff >= 0 && diff < 0.22) {
          shakeAmp = Math.max(shakeAmp, (1 - diff / 0.22) * (impact === 2.8 ? 0.32 : 0.18));
        }
      }
      const shakeX = (Math.random() - 0.5) * shakeAmp;
      const shakeY = (Math.random() - 0.5) * shakeAmp;

      this.world.camera.position.x += (targetCamX + shakeX - this.world.camera.position.x) * camDamp;
      this.world.camera.position.y += (targetCamY + shakeY - this.world.camera.position.y) * camDamp;
      this.world.camera.position.z += (targetCamZ - this.world.camera.position.z) * camDamp;
      this.world.camera.lookAt(lookX, lookY, lookZ);

      this.world.renderer.render(this.world.scene, this.world.camera);

      if (this.victoryElapsedMs >= this.victoryDurationMs) {
        this.isVictorySequenceActive = false;
        this.finish('all_stages_cleared');
        return;
      }

      this.animationFrame = requestAnimationFrame(this.frame);
      return;
    }

    // Pennywise jumpscare cinematic loss sequence
    if (this.isLossSequenceActive) {
      this.lossElapsedMs += deltaMs;

      this.pursuerEntity?.update(deltaMs, 0, this.currentX);

      const progress = Math.min(1, this.lossElapsedMs / this.lossDurationMs);
      const shakeAmp = 0.05 + Math.pow(progress, 2.4) * 0.32;
      this.world.camera.position.x = (Math.random() - 0.5) * shakeAmp;
      this.world.camera.position.y = 5.2 + (Math.random() - 0.5) * shakeAmp;
      this.world.camera.position.z = 8.5 + (Math.random() - 0.5) * (shakeAmp * 0.4);
      this.world.camera.lookAt(0, 1.2, -6);

      this.world.renderer.render(this.world.scene, this.world.camera);

      if (this.lossElapsedMs >= this.lossDurationMs) {
        this.world.camera.position.set(0, 5.2, 8.5);
        this.world.camera.lookAt(0, 1.2, -6);
        this.finish(this.lossReason || 'hit_points_zero');
        return;
      }

      this.animationFrame = requestAnimationFrame(this.frame);
      return;
    }

    if (!this.paused) {
      this.elapsedMs += deltaMs;
      this.stageElapsedMs += deltaMs;
      if (this.laneTimeMs && this.laneTimeMs[this.laneIndex] !== undefined) {
        this.laneTimeMs[this.laneIndex] += deltaMs;
      }

      const currentStage = GAME_STAGES[this.currentStageIndex] || GAME_STAGES[0];
      const stageProgress = this.stageElapsedMs / 1000;
      const stageDuration = currentStage.durationSeconds || 60;

      const speed = Math.min(
        currentStage.speed.maximum,
        currentStage.speed.base + currentStage.speed.perSecond * stageProgress
      );

      this.distanceM += speed * dt;
      this.spawnElapsedMs += deltaMs;
      this.invulnerableMs -= deltaMs;
      if (this.cardSpawnSafeGuardMs > 0) {
        this.cardSpawnSafeGuardMs -= deltaMs;
      }
      if (this.shieldRemainingMs > 0) {
        this.shieldRemainingMs = Math.max(0, this.shieldRemainingMs - deltaMs);
        if (this.shieldRemainingMs === 0) {
          this.playerEntity?.setShieldActive?.(false);
        }
      }
      if (this.heartCooldownMs > 0) {
        this.heartCooldownMs = Math.max(0, this.heartCooldownMs - deltaMs);
      }
      if (this.shieldCooldownMs > 0) {
        this.shieldCooldownMs = Math.max(0, this.shieldCooldownMs - deltaMs);
      }
      this.recentDamageMs = (this.recentDamageMs ?? 99999) + deltaMs;
      if (this.devAutoPilot && !this.isLossSequenceActive && !this.isVictorySequenceActive) {
        this.updateDevAutoPilot(deltaMs);
      }

      // 1. True Optic Flow: Infinite scrolling trackside chunks (140-unit loop)
      if (this.world.scrollingProps) {
        for (const chunk of this.world.scrollingProps) {
          chunk.position.z += speed * dt;
          if (chunk.position.z > 18) {
            chunk.position.z -= 140;
          }
        }
      }

      // Ground fog drift ribbon scrolling
      if (this.world.groundFogTex) {
        this.world.groundFogTex.offset.y -= speed * dt * 0.16;
      }

      // Road cobblestone texture scrolling - matched 1:1 with road geometry
      if (this.world.cobbleTex) {
        this.world.cobbleTex.offset.y -= speed * dt * 0.16;
      }

      // High-velocity 3D streak lines (speed lines) around track corridor
      if (this.world.speedLines) {
        const lineSpeed = speed * 1.35;
        const speedRatio = Math.min(1, Math.max(0, (speed - 15) / (38 - 15)));
        for (const line of this.world.speedLines.children) {
          line.position.z += lineSpeed * dt;
          if (line.position.z > 14) {
            line.position.z = -85 - Math.random() * 20;
            const side = Math.random() > 0.5 ? 1 : -1;
            line.position.x = side * (4.2 + Math.random() * 4.0);
            line.position.y = 0.6 + Math.random() * 4.4;
          }
          line.scale.z = 1.0 + speedRatio * 2.2;
        }
        if (this.world.speedLineMat) {
          this.world.speedLineMat.opacity = Math.max(0, (speedRatio - 0.12) * 0.75);
        }
      }

      // Dynamic low-pass wind rush audio loop
      updateWindAudio(speed);

      // Distant landmarks subtle animation
      if (this.world.ferrisWheelGroup) {
        this.world.ferrisWheelGroup.rotation.z += deltaMs * 0.00035;
      }
      if (this.world.carouselGroup) {
        this.world.carouselGroup.rotation.y += deltaMs * 0.00045;
      }
      if (this.world.coasterTrain) {
        this.world.coasterTrain.position.y = Math.sin(this.elapsedMs * 0.005) * 0.35;
        this.world.coasterTrain.position.x = Math.cos(this.elapsedMs * 0.005) * 0.25;
      }

      // Particles drift
      if (this.world.particles) {
        const positions = this.world.particles.geometry.attributes.position.array;
        for (let i = 2; i < positions.length; i += 3) {
          positions[i] += speed * dt * 0.45;
          if (positions[i] > 6) {
            positions[i] = -85;
          }
        }
        this.world.particles.geometry.attributes.position.needsUpdate = true;
      }

      // Player lane interpolation (Crisp responsive switching)
      const prevX = this.currentX;
      this.currentX += (this.targetX - this.currentX) * Math.min(1, deltaMs / 95);
      this.playerEntity.root.position.x = this.currentX;

      if (this.world.playerRimLight) {
        this.world.playerRimLight.position.x = this.currentX;
      }

      // Jump animation
      let jumpFraction = 0;
      if (this.jumpElapsedMs > 0) {
        this.jumpElapsedMs += deltaMs;
        jumpFraction = Math.min(1, this.jumpElapsedMs / GAME_CONFIG.jumpDurationMs);
        this.playerEntity.root.position.y = Math.sin(jumpFraction * Math.PI) * 1.48;
        if (jumpFraction >= 1) {
          this.jumpElapsedMs = 0;
          this.playerEntity.root.position.y = 0;
        }
      }

      // Update Player Rig
      this.playerEntity.update(deltaMs, {
        isRunning: true,
        isJumping: this.jumpElapsedMs > 0,
        jumpProgress: jumpFraction,
        laneDeltaX: this.currentX - prevX,
        invulnerableMs: this.invulnerableMs,
      });

      // Update Pursuer Villain Entity with live obstacles & overhead scenery arches for dynamic dodging and spins
      this.pursuerEntity.update(deltaMs, this.health, this.currentX, this.objects, this.world.scrollingProps, speed);

      // Spring-Damper Camera Follow, Dutch Banking, Dynamic FOV Speed Ramp & Micro-Rumble
      const { camera } = this.world;
      camera.position.x = THREE.MathUtils.damp(camera.position.x, this.currentX * 0.32, 6.5, dt);
      this.cameraTiltZ = THREE.MathUtils.damp(this.cameraTiltZ || 0, (this.currentX - this.targetX) * 0.022, 8.0, dt);

      camera.lookAt(this.currentX * 0.15, 1.35, -7);
      camera.rotation.z += this.cameraTiltZ;

      const speedRatio = Math.min(1, Math.max(0, (speed - 15) / (38 - 15)));
      const targetFov = 54 + speedRatio * 16.0;
      if (Math.abs(camera.fov - targetFov) > 0.05) {
        camera.fov = THREE.MathUtils.damp(camera.fov, targetFov, 4.0, dt);
        camera.updateProjectionMatrix();
      }

      // High-speed camera micro-rumble
      if (speedRatio > 0.35) {
        const rumbleAmp = (speedRatio - 0.35) * 0.035;
        camera.position.y = 5.2 - speedRatio * 0.15 + (Math.random() - 0.5) * rumbleAmp;
        camera.position.x += (Math.random() - 0.5) * rumbleAmp * 0.8;
      } else {
        camera.position.y = THREE.MathUtils.damp(camera.position.y, 5.2, 5.0, dt);
      }

      // Milestones
      const totalSeconds = this.elapsedMs / 1000;
      for (const milestone of [
        [15, ENTITY_KEYS.MILESTONE_15],
        [30, ENTITY_KEYS.MILESTONE_30],
        [45, ENTITY_KEYS.MILESTONE_45],
      ]) {
        if (totalSeconds >= milestone[0] && !this.milestones.has(milestone[1])) {
          this.milestones.add(milestone[1]);
          this.emit(EVENT_TYPES.MILESTONE, milestone[1], 1);
        }
      }

      // Scheduled card spawning with Predictive Lane Reservation (1.6s window)
      const stageSeconds = this.stageElapsedMs / 1000;
      const schedule = GAME_CONFIG.cardSpawnSchedule || [8, 20, 32, 44, 54];
      const nextCardSec = schedule[this.scheduledCardIndex];

      if (nextCardSec !== undefined && (nextCardSec - stageSeconds) <= 1.6 && (nextCardSec - stageSeconds) >= -0.35) {
        if (this.upcomingCardLane === null) {
          const spawnZ = -GAME_CONFIG.spawnDistance;
          const hazardLanesNearSpawn = new Set(
            this.objects
              .filter((obj) => obj.isHazard && !obj.consumed && Math.abs(obj.mesh.position.z - spawnZ) < 14.0)
              .map((obj) => obj.lane)
          );
          const freeLanes = [0, 1, 2].filter((l) => !hazardLanesNearSpawn.has(l));
          this.upcomingCardLane = freeLanes.length > 0 ? freeLanes[Math.floor(Math.random() * freeLanes.length)] : Math.floor(Math.random() * 3);
        }
      }

      if (
        this.scheduledCardIndex < schedule.length &&
        stageSeconds >= schedule[this.scheduledCardIndex]
      ) {
        const laneToUse = this.upcomingCardLane !== null ? this.upcomingCardLane : undefined;
        this.spawnScheduledCard(this.scheduledCardIndex, laneToUse);
        this.upcomingCardLane = null;
        this.scheduledCardIndex += 1;
      }

      // Stage progression (60 seconds per level - requires all 5 cards)
      if (this.stageElapsedMs >= stageDuration * 1000) {
        if (this.stageCardsCollected < (GAME_CONFIG.cardsRequiredPerStage || 5)) {
          this.emit(EVENT_TYPES.CARD_MISSED, ENTITY_KEYS.CARD_FRAGMENT, 0, this.laneIndex);
          if (!this.devGodMode) {
            this.triggerLossSequence('card_missed');
            return;
          }
        }
        this.advanceStage();
        this.world.renderer.render(this.world.scene, this.world.camera);
        if (this.running) {
          this.animationFrame = requestAnimationFrame(this.frame);
        }
        return;
      }

      // Obstacle & Shard spawning
      const intervalMs = Math.max(
        currentStage.spawnInterval.minimum,
        currentStage.spawnInterval.base - currentStage.spawnInterval.perSecond * stageProgress
      ) * 1000;

      if (this.spawnElapsedMs >= intervalMs) {
        this.spawnElapsedMs = 0;
        this.spawn();
      }

      this.updateObjects(deltaMs, speed);
      if (!this.running) return;

      // 60FPS Direct DOM callback for smooth progress bar transform & 3D speech bubble tracking
      const stageProgressRatio = Math.min(1, this.stageElapsedMs / (stageDuration * 1000));
      const pursuerSpeechPos = this.pursuerEntity?.getSpeechBubbleScreenCoords(this.world.camera);
      this.onFrameTick?.({
        stageProgressRatio,
        speed,
        stageElapsedSeconds: this.stageElapsedMs / 1000,
        stageDurationSeconds: stageDuration,
        pursuerSpeechPos,
      });

      // Throttled Telemetry Sync: Dispatch to React at 8.3Hz (~120ms) instead of 60Hz thrashing
      if (this.elapsedMs - this.lastHudSyncMs >= 120) {
        this.lastHudSyncMs = this.elapsedMs;
        this.updateHud();
      }

      this.world.renderer.render(this.world.scene, this.world.camera);
    }

    this.animationFrame = requestAnimationFrame(this.frame);
  }

  finish(endReason = 'player_exit') {
    if (!this.running) return;
    this.running = false;
    cancelAnimationFrame(this.animationFrame);
    stopBackgroundMusic();
    stopWindAudio();
    this.onRunEnd?.({
      durationMs: Math.round(Math.min(this.elapsedMs, GAME_CONFIG.roundCapSeconds * 1000)),
      distanceM: Math.round(this.distanceM * 100) / 100,
      endReason,
      events: [...this.events],
      telemetry: this.getTelemetryState(),
    });
  }

  pause() {
    if (this.running) {
      this.paused = true;
      stopBackgroundMusic();
      stopWindAudio();
      this.updateHudImmediate();
    }
  }

  resume() {
    if (this.running) {
      this.paused = false;
      this.clock.getDelta();
      startBackgroundMusic(this.currentStageIndex + 1);
      this.updateHudImmediate();
    }
  }

  setReducedEffects(enabled) {
    this.world.setLowEffectsMode(enabled);
    this.resize();
  }

  resize() {
    const { renderer, camera } = this.world;
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  // ==========================================
  // SECRET DEV TOOLS & ADMIN CONSOLE METHODS
  // ==========================================

  setDevGodMode(enabled) {
    this.devGodMode = Boolean(enabled);
    this.updateHudImmediate();
  }

  setDevAutoPilot(enabled) {
    this.devAutoPilot = Boolean(enabled);
    this.updateHudImmediate();
  }

  setDevTimeScale(scale) {
    this.devTimeScale = Math.max(0.1, Math.min(5.0, Number(scale) || 1.0));
    this.updateHudImmediate();
  }

  devWarpToStage(stageNum) {
    const stageIdx = Math.max(0, Math.min(GAME_STAGES.length - 1, (stageNum || 1) - 1));
    this.currentStageIndex = stageIdx;
    this.stageElapsedMs = 0;
    this.stageCardsCollected = 0;
    this.scheduledCardIndex = 0;
    this.upcomingCardLane = null;

    // Clear objects on track
    if (this.objects) {
      for (const obj of this.objects) {
        this.disposeWarningRing(obj);
        if (obj?.mesh) this.world.scene.remove(obj.mesh);
      }
      this.objects = [];
    }

    this.world.applyAtmosphere(null, stageIdx + 1);
    startBackgroundMusic(stageIdx + 1);
    this.updateHudImmediate({ stageIndex: stageIdx });
  }

  devGrantCardFragment() {
    this.stageCardsCollected = (this.stageCardsCollected ?? 0) + 1;
    this.fragmentsCollected = (this.fragmentsCollected ?? 0) + 1;
    const isFullCard = this.stageCardsCollected >= (GAME_CONFIG.cardsRequiredPerStage || 5);
    playCardFragmentSfx(isFullCard);
    this.emit(EVENT_TYPES.FRAGMENT_PICKUP, ENTITY_KEYS.CARD_FRAGMENT, 1, this.laneIndex);
    const cardPickup = getCardPickupInfo(this.stageCardsCollected, this.currentStageIndex);
    this.updateHudImmediate({
      fragmentGot: true,
      cardPickup,
      stageCardsCollected: this.stageCardsCollected,
    });
  }

  devCompleteCurrentStage() {
    this.stageCardsCollected = GAME_CONFIG.cardsRequiredPerStage || 5;
    this.advanceStage();
  }

  devToggleShield() {
    if (this.shieldRemainingMs > 0) {
      this.shieldRemainingMs = 0;
      this.playerEntity?.setShieldActive?.(false);
    } else {
      this.shieldRemainingMs = 15000;
      if (!this.powerupStats) {
        this.powerupStats = { shieldsCollected: 0, shieldsBroken: 0, heartsCollected: 0, heartHpRestored: 0, heartBonusScore: 0 };
      }
      this.powerupStats.shieldsCollected = (this.powerupStats.shieldsCollected || 0) + 1;
      playShieldPickupSfx();
      this.playerEntity?.setShieldActive?.(true);
    }
    this.updateHudImmediate();
  }

  devFullHeal() {
    this.health = GAME_CONFIG.maxHealth || 5;
    if (!this.powerupStats) {
      this.powerupStats = { shieldsCollected: 0, shieldsBroken: 0, heartsCollected: 0, heartHpRestored: 0, heartBonusScore: 0 };
    }
    this.powerupStats.heartsCollected = (this.powerupStats.heartsCollected || 0) + 1;
    this.powerupStats.heartHpRestored = (this.powerupStats.heartHpRestored || 0) + 1;
    playHeartPickupSfx();
    this.updateHudImmediate();
  }

  devAddShards(amount = 50) {
    this.normalShards = (this.normalShards || 0) + amount;
    playShardPickupSfx();
    this.updateHudImmediate();
  }

  devTriggerVictory() {
    // Fill all 6 stages cleared and emit events so results screen has all 6 cards complete
    while (this.stagesCleared < GAME_CONFIG.stageCount) {
      this.stagesCleared += 1;
      const stageKey = ENTITY_KEYS[`STAGE_${this.stagesCleared}`];
      this.emit(EVENT_TYPES.STAGE_CLEAR, stageKey, 1);
    }
    this.currentStageIndex = GAME_CONFIG.stageCount - 1;
    this.stageCardsCollected = GAME_CONFIG.cardsRequiredPerStage || 5;
    this.fragmentsCollected = Math.max(this.fragmentsCollected || 0, 30);
    this.triggerVictorySequence();
  }

  devTriggerJumpscareLoss() {
    this.triggerLossSequence('hit_points_zero');
  }

  updateDevAutoPilot(deltaMs) {
    this.devAutoPilotCooldownMs = (this.devAutoPilotCooldownMs || 0) - deltaMs;
    if (this.devAutoPilotCooldownMs > 0) return;

    // 1. Check for immediate jumpable low skimmers in current lane
    const imminentJumpHazard = this.objects.find(
      (obj) => obj.isHazard && obj.isWave && !obj.consumed &&
        obj.mesh.position.z >= -7.0 && obj.mesh.position.z <= 0.5 &&
        (obj.lane === this.laneIndex || Math.abs(obj.mesh.position.x - this.currentX) < 1.0)
    );
    if (imminentJumpHazard && this.jumpElapsedMs === 0) {
      this.jump();
      this.devAutoPilotCooldownMs = 180;
      return;
    }

    // 2. Check for imminent non-jumpable hazards in current lane
    const imminentHazard = this.objects.find(
      (obj) => obj.isHazard && !obj.consumed &&
        (!obj.isWave || this.jumpElapsedMs > 0) &&
        obj.mesh.position.z >= -10.0 && obj.mesh.position.z <= 1.0 &&
        (obj.lane === this.laneIndex || Math.abs(obj.mesh.position.x - this.currentX) < 1.1)
    );

    if (imminentHazard) {
      // Calculate threat scores for each lane
      const laneThreatScores = [0, 0, 0];
      for (const obj of this.objects) {
        if (obj.isHazard && !obj.consumed && obj.mesh.position.z >= -12.0 && obj.mesh.position.z <= 2.0) {
          const zWeight = 15.0 - Math.abs(obj.mesh.position.z);
          laneThreatScores[obj.lane] = (laneThreatScores[obj.lane] || 0) + zWeight;
        }
      }

      let safestLane = this.laneIndex;
      let minThreat = laneThreatScores[this.laneIndex];
      [0, 1, 2].forEach((l) => {
        if (laneThreatScores[l] < minThreat) {
          minThreat = laneThreatScores[l];
          safestLane = l;
        }
      });

      if (safestLane !== this.laneIndex) {
        this.moveLane(safestLane > this.laneIndex ? 1 : -1);
        this.devAutoPilotCooldownMs = 120;
        return;
      }
    }

    // 3. Otherwise seek upcoming card fragment or power-up
    const desirableTarget = this.objects.find(
      (obj) => !obj.consumed && (obj.isCard || obj.isFragment || obj.isShield || obj.isHeart) &&
        obj.mesh.position.z >= -22.0 && obj.mesh.position.z < -0.5
    );

    if (desirableTarget && desirableTarget.lane !== this.laneIndex) {
      const isTargetLaneBlocked = this.objects.some(
        (obj) => obj.isHazard && !obj.consumed && obj.lane === desirableTarget.lane &&
          obj.mesh.position.z >= -7.0 && obj.mesh.position.z <= 1.5
      );
      if (!isTargetLaneBlocked) {
        this.moveLane(desirableTarget.lane > this.laneIndex ? 1 : -1);
        this.devAutoPilotCooldownMs = 150;
      }
    }
  }

  dispose() {
    this.running = false;
    cancelAnimationFrame(this.animationFrame);
    stopBackgroundMusic();
    stopWindAudio();
    window.removeEventListener('resize', this.resize);
    window.removeEventListener('keydown', this.keydown);

    this.playerEntity?.dispose();
    this.pursuerEntity?.dispose();

    // Clean up scene objects
    this.objects.forEach((obj) => {
      this.disposeWarningRing(obj);
      const mesh = obj.mesh;
      this.world.scene.remove(mesh);
      mesh.traverse((child) => {
        if (child.geometry && !child.geometry.userData?.shared) {
          child.geometry.dispose();
        }
        if (child.material) {
          const mats = Array.isArray(child.material) ? child.material : [child.material];
          mats.forEach((m) => {
            if (!m.userData?.shared) m.dispose();
          });
        }
      });
    });

    this.world.cobbleTex?.dispose();
    this.world.groundFogTex?.dispose();
    this.world.renderer?.dispose();
  }
}
