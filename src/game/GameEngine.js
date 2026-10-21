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
  startBackgroundMusic,
  stopBackgroundMusic,
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
    illustrator: 'HEXEDEX ARCHIVES',
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
    illustrator: 'HEXEDEX ARCHIVES',
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
    illustrator: 'HEXEDEX ARCHIVES',
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
    illustrator: 'HEXEDEX ARCHIVES',
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
    illustrator: 'HEXEDEX ARCHIVES',
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
    illustrator: 'HEXEDEX ARCHIVES',
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
    illustrator: 'HEXEDEX ARCHIVES',
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
      { name: 'Deadlights Hypnosis', damage: '100', desc: 'Summons three spinning glowing red balloons from beyond the stars, paralyzing all who behold them.' },
      { name: 'Infinite Funhouse Collapse', damage: '170', desc: 'Traps the entire dimensional rift in a twisted hall of mirrors until shattered by all six Pokédex seals.' },
    ],
    rarity: 'Apex Mythic',
    illustrator: 'HEXEDEX ARCHIVES',
    lore: 'The primordial shape-shifting cosmic jester inhabiting the abyss beneath Derry. Wields floating Poké-Balloons to lure runners into the eternal Deadlights.',
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
    });

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
      milestones: new Set(),
      events: [],
      distanceM: 0,
      cameraTiltZ: 0,
      upcomingCardLane: null,
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

    // Stop background music during jumpscare
    stopBackgroundMusic();

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
    const next = Math.max(0, Math.min(2, this.laneIndex + direction));
    if (next !== this.laneIndex) {
      this.laneIndex = next;
      this.targetX = GAME_CONFIG.laneCenters[next];
      playLaneSwitchSfx(next);
      this.emit(EVENT_TYPES.LANE_CHANGE, laneKey[next], 0, next);
      this.updateHudImmediate();
    }
  }

  jump() {
    if (this.jumpElapsedMs === 0) {
      this.jumpElapsedMs = 1;
      playJumpSfx();
      this.emit(EVENT_TYPES.JUMP, ENTITY_KEYS.PLAYER_JUMP);
      this.updateHudImmediate();
    }
  }

  spawnScheduledCard(cardIndex, targetLane = null) {
    const spawnZ = -GAME_CONFIG.spawnDistance;
    let lane = targetLane;
    if (lane === null || lane === undefined) {
      const occupiedLanes = new Set(
        this.objects
          .filter((obj) => obj.isHazard && !obj.consumed && Math.abs(obj.mesh.position.z - spawnZ) < 6.0)
          .map((obj) => obj.lane)
      );
      const freeLanes = [0, 1, 2].filter((l) => !occupiedLanes.has(l));
      lane = freeLanes.length > 0 ? freeLanes[Math.floor(Math.random() * freeLanes.length)] : 1;
    }

    const mesh = createCardFragment();
    mesh.position.set(GAME_CONFIG.laneCenters[lane], 1.15, spawnZ);
    this.world.scene.add(mesh);

    this.cardSpawnSafeGuardMs = 900;

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

    const isPredictiveCardWindow = this.upcomingCardLane !== null;

    const hazardChance = stage.hazardChance ?? 0.65;
    const isHazard = Math.random() < hazardChance;

    if (isHazard) {
      // If card spawn safeguard grace window is active, skip spawning hazard on this tick
      if (this.cardSpawnSafeGuardMs > 0) {
        return;
      }

      // Check if any uncollected card is within 9.5 Z-units
      const cardNearby = this.objects.some(
        (obj) => (obj.isCard || obj.isFragment) && !obj.consumed && Math.abs(obj.mesh.position.z - spawnZ) < 9.5
      );

      const cardLanesOccupied = new Set(
        this.objects
          .filter((obj) => (obj.isCard || obj.isFragment) && !obj.consumed && Math.abs(obj.mesh.position.z - spawnZ) < 9.5)
          .map((obj) => obj.lane)
      );
      if (isPredictiveCardWindow) {
        cardLanesOccupied.add(this.upcomingCardLane);
      }

      // If a card is nearby or in predictive card window, forbid double_blockade and swaying_specter
      const canDoDouble = !isPredictiveCardWindow && !cardNearby && allowedHazards.includes('double_blockade') && Math.random() < 0.28;
      const canDoSway = !isPredictiveCardWindow && !cardNearby && allowedHazards.includes('swaying_specter') && Math.random() < 0.35;
      const canDoWave = allowedHazards.includes('shadow_wave') && Math.random() < 0.40;

      if (canDoDouble) {
        const openLane = Math.floor(Math.random() * 3);
        const blockedLanes = [0, 1, 2].filter((l) => l !== openLane);

        blockedLanes.forEach((lane) => {
          const mesh = createDoubleBlockadeSingle(lane, openLane, stageNum);
          mesh.position.set(GAME_CONFIG.laneCenters[lane], 0, spawnZ);
          this.world.scene.add(mesh);
          this.objects.push({
            mesh,
            lane,
            isHazard: true,
            isWave: false,
            isSway: false,
            entityKey: ENTITY_KEYS.DOUBLE_BLOCKADE,
            consumed: false,
          });
        });
        this.emit(EVENT_TYPES.OBSTACLE_SPAWN, ENTITY_KEYS.DOUBLE_BLOCKADE, 0, openLane);
        return;
      }

      // Choose a lane that excludes any nearby card's lane and the reserved upcoming card lane
      const availableLanes = [0, 1, 2].filter((l) => !cardLanesOccupied.has(l));
      if (availableLanes.length === 0) return;
      const lane = availableLanes[Math.floor(Math.random() * availableLanes.length)];

      if (canDoSway) {
        const mesh = createSwayingSpecter(stageNum);
        mesh.position.set(GAME_CONFIG.laneCenters[lane], 1.25, spawnZ);
        this.world.scene.add(mesh);
        this.objects.push({
          mesh,
          lane,
          baseX: GAME_CONFIG.laneCenters[lane],
          swayTime: Math.random() * 10,
          isHazard: true,
          isWave: false,
          isSway: true,
          entityKey: ENTITY_KEYS.SWAYING_SPECTER,
          consumed: false,
        });
        this.emit(EVENT_TYPES.OBSTACLE_SPAWN, ENTITY_KEYS.SWAYING_SPECTER, 0, lane);
        return;
      }

      const isWave = canDoWave;
      const mesh = isWave ? createShadowWave(stageNum) : createBlockerCrate(stageNum);
      mesh.position.set(GAME_CONFIG.laneCenters[lane], isWave ? 0.05 : 0.72, spawnZ);
      this.world.scene.add(mesh);

      const entityKey = isWave ? ENTITY_KEYS.SHADOW_WAVE : ENTITY_KEYS.BLOCKER_CRATE;
      this.objects.push({
        mesh,
        lane,
        isHazard: true,
        isWave,
        isSway: false,
        entityKey,
        consumed: false,
      });
      this.emit(EVENT_TYPES.OBSTACLE_SPAWN, entityKey, 0, lane);

      // In Stages 3 to 6, when spawning a single-lane blocker_crate (and no card is nearby),
      // allow a (25% + stageIndex * 6%) chance to simultaneously spawn a jumpable shadow_wave in an adjacent safe lane
      if (!isWave && !cardNearby && !isPredictiveCardWindow && this.currentStageIndex >= 2 && allowedHazards.includes('shadow_wave')) {
        const comboChance = 0.25 + this.currentStageIndex * 0.06;
        if (Math.random() < comboChance) {
          const adjCandidates = lane === 1 ? [0, 2] : [1];
          const validAdj = adjCandidates.filter((l) => !cardLanesOccupied.has(l));
          if (validAdj.length > 0) {
            const adjLane = validAdj[Math.floor(Math.random() * validAdj.length)];
            const waveMesh = createShadowWave(stageNum);
            waveMesh.position.set(GAME_CONFIG.laneCenters[adjLane], 0.05, spawnZ);
            this.world.scene.add(waveMesh);
            this.objects.push({
              mesh: waveMesh,
              lane: adjLane,
              isHazard: true,
              isWave: true,
              isSway: false,
              entityKey: ENTITY_KEYS.SHADOW_WAVE,
              consumed: false,
            });
            this.emit(EVENT_TYPES.OBSTACLE_SPAWN, ENTITY_KEYS.SHADOW_WAVE, 0, adjLane);
          }
        }
      }
    } else {
      // Shards / Amber Orbs
      // Check for any existing object within Math.abs(obj.mesh.position.z - spawnZ) < 4.5
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
        // Skip spawning shard if all 3 lanes are occupied at that exact Z
        return;
      }

      const lane = availableShardLanes[Math.floor(Math.random() * availableShardLanes.length)];
      const isRare = Math.random() < 0.28;

      const mesh = isRare ? createAmberOrb() : createRiftShard();
      const entityKey = isRare ? ENTITY_KEYS.AMBER_ORB : ENTITY_KEYS.RIFT_SHARD;

      mesh.position.set(GAME_CONFIG.laneCenters[lane], 1.05, spawnZ);
      this.world.scene.add(mesh);

      this.objects.push({
        mesh,
        lane,
        isHazard: false,
        isWave: false,
        isSway: false,
        isRare,
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

    // 2. Update track objects
    for (const object of this.objects) {
      object.mesh.position.z += speed * dt;

      if (object.isSway) {
        object.swayTime += deltaMs * (0.0032 + this.currentStageIndex * 0.0008);
        const offset = Math.sin(object.swayTime) * 1.85;
        object.mesh.position.x = Math.max(-3.5, Math.min(3.5, object.baseX + offset));
        object.mesh.rotation.z = Math.cos(object.swayTime) * 0.25;

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

        if (object.mesh.userData.haloRing) {
          object.mesh.userData.haloRing.rotation.z += deltaMs * 0.008;
        }
        if (object.mesh.userData.outerRing) {
          object.mesh.userData.outerRing.rotation.z -= deltaMs * 0.009;
        }
        if (object.mesh.userData.sparkles) {
          object.mesh.userData.sparkles.forEach((sp) => {
            sp.offset += deltaMs * 0.005;
            sp.mesh.position.set(Math.cos(sp.offset) * 0.55, Math.sin(sp.offset * 2) * 0.35, Math.sin(sp.offset) * 0.55);
          });
        }
      }

      const close = object.mesh.position.z > -1.15 && object.mesh.position.z < 1.15;
      if (!object.consumed && close && object.lane === this.laneIndex) {
        if (object.isHazard && this.invulnerableMs <= 0 && (!object.isWave || this.jumpElapsedMs === 0)) {
          object.consumed = true;
          this.health -= 1;
          this.invulnerableMs = 900;
          playCollisionHitSfx();
          this.emit(EVENT_TYPES.COLLISION, object.entityKey, 0, object.lane);
          this.updateHudImmediate({ hit: true });
          if (this.health <= 0) {
            this.triggerLossSequence('hit_points_zero');
            return;
          }
        }

        if (!object.isHazard) {
          object.consumed = true;
          if (object.isFragment || object.isCard) {
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
        this.emit(EVENT_TYPES.CARD_MISSED, ENTITY_KEYS.CARD_FRAGMENT, 1, object.lane);
        this.triggerLossSequence('card_missed');
        return;
      }
    }

    // Zero-GC Removal: Remove mesh from scene when behind camera (> 12.5) or non-card consumed
    this.objects = this.objects.filter((object) => {
      if (object.consumed) {
        if (!object.isFragment && !object.isCard) {
          this.world.scene.remove(object.mesh);
        }
        return false;
      }
      if (object.mesh.position.z > 12.5) {
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

    // Persistent health: NO checkpoint heal! Health carries over exactly.

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
    playVictoryCelebrationSfx();

    // Clear all remaining track hazards and pickup meshes
    if (this.objects) {
      for (const obj of this.objects) {
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
    const deltaMs = Math.min(this.clock.getDelta() * 1000, 50);
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
        this.world.groundFogTex.offset.y -= speed * dt * 0.055;
      }

      // Road cobblestone texture scrolling
      if (this.world.cobbleTex) {
        this.world.cobbleTex.offset.y -= speed * dt * 0.055;
      }

      // Distant landmarks subtle animation
      if (this.world.ferrisWheelGroup) {
        this.world.ferrisWheelGroup.rotation.z += deltaMs * 0.00035;
      }
      if (this.world.carouselGroup) {
        this.world.carouselGroup.rotation.y += deltaMs * 0.00045;
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

      // Player lane interpolation
      const prevX = this.currentX;
      this.currentX += (this.targetX - this.currentX) * Math.min(1, deltaMs / 130);
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

      // Update Pursuer Villain Entity
      this.pursuerEntity.update(deltaMs, this.health, this.currentX);

      // Spring-Damper Camera Follow, Dutch Banking & FOV Speed Ramp
      const { camera } = this.world;
      camera.position.x = THREE.MathUtils.damp(camera.position.x, this.currentX * 0.32, 6.5, dt);
      this.cameraTiltZ = THREE.MathUtils.damp(this.cameraTiltZ || 0, (this.currentX - this.targetX) * 0.022, 8.0, dt);

      camera.lookAt(this.currentX * 0.15, 1.35, -7);
      camera.rotation.z += this.cameraTiltZ;

      const speedRatio = Math.min(1, Math.max(0, (speed - 12) / (32 - 12)));
      const targetFov = 53 + speedRatio * 8.0;
      if (Math.abs(camera.fov - targetFov) > 0.05) {
        camera.fov = THREE.MathUtils.damp(camera.fov, targetFov, 4.0, dt);
        camera.updateProjectionMatrix();
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

      if (nextCardSec !== undefined && (nextCardSec - stageSeconds) <= 1.25 && (nextCardSec - stageSeconds) >= -0.35) {
        if (this.upcomingCardLane === null) {
          this.upcomingCardLane = Math.floor(Math.random() * 3);
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
          this.emit(EVENT_TYPES.CARD_MISSED, ENTITY_KEYS.CARD_FRAGMENT, 1, this.laneIndex);
          this.triggerLossSequence('card_missed');
          return;
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
    this.onRunEnd?.({
      durationMs: Math.round(Math.min(this.elapsedMs, GAME_CONFIG.roundCapSeconds * 1000)),
      distanceM: Math.round(this.distanceM * 100) / 100,
      endReason,
      events: [...this.events],
    });
  }

  pause() {
    if (this.running) {
      this.paused = true;
      stopBackgroundMusic();
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

  dispose() {
    this.running = false;
    cancelAnimationFrame(this.animationFrame);
    stopBackgroundMusic();
    window.removeEventListener('resize', this.resize);
    window.removeEventListener('keydown', this.keydown);

    this.playerEntity?.dispose();
    this.pursuerEntity?.dispose();

    // Clean up scene objects
    this.objects.forEach(({ mesh }) => {
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
