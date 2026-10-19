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

export const POKEMON_CARD_ROSTER = [
  {
    id: '001',
    artKey: 'mossbyte',
    name: 'Mossbyte',
    type: 'Grass / Glitch',
    color: '#10b981',
    accentColor: '#34d399',
    symbol: 'GRS',
    hp: 120,
    attacks: [
      { name: 'Spore Glitch', damage: '30', desc: 'Distorts the peripheral carnival vision with static spores.' },
      { name: 'Photosynthetic Surge', damage: '80', desc: 'Channels ambient fog luminescence into radiant kinetic energy.' },
    ],
    rarity: 'Holo Rare',
    illustrator: 'ELE5BA Studio',
    lore: 'Found clinging to weathered carnival tents, pulsing with residual digital signals.',
  },
  {
    id: '002',
    artKey: 'lantern-hare',
    name: 'Lantern Hare',
    type: 'Fire / Spirit',
    color: '#f59e0b',
    accentColor: '#fbbf24',
    symbol: 'FIR',
    hp: 130,
    attacks: [
      { name: 'Wisp Flick', damage: '40', desc: 'Fires twin ghost-sparks that illuminate hidden obstacles.' },
      { name: 'Amber Conflagration', damage: '90', desc: 'Burns away pursuer shadows with intense spectral heat.' },
    ],
    rarity: 'Ultra Rare',
    illustrator: 'ELE5BA Studio',
    lore: 'Leaps gracefully across abandoned ticket booths, guiding lost souls with its tail lantern.',
  },
  {
    id: '003',
    artKey: 'static-moth',
    name: 'Static Moth',
    type: 'Electric / Storm',
    color: '#38bdf8',
    accentColor: '#67e8f9',
    symbol: 'ELC',
    hp: 140,
    attacks: [
      { name: 'Arc Flutter', damage: '50', desc: 'Sends arcs of high-voltage static down the carnival rails.' },
      { name: 'Thunderstorm Tempest', damage: '110', desc: 'Unleashes a torrential discharge of concentrated rift lightning.' },
    ],
    rarity: 'Secret Rare',
    illustrator: 'ELE5BA Studio',
    lore: 'Attracted to high-voltage carnival generators and flashing arcade signs.',
  },
  {
    id: '004',
    artKey: 'velvet-wisp',
    name: 'Velvet Wisp',
    type: 'Psychic / Fog',
    color: '#c084fc',
    accentColor: '#d8b4fe',
    symbol: 'PSI',
    hp: 130,
    attacks: [
      { name: 'Hypnotic Gaze', damage: '40', desc: 'Mesmerizes pursuers into temporary sluggishness.' },
      { name: 'Dimensional Warp', damage: '100', desc: 'Bends carnival space to slip through impossible blockades.' },
    ],
    rarity: 'Holo Rare',
    illustrator: 'ELE5BA Studio',
    lore: 'Drifts silently among the Ferris wheel spokes, weaving illusions from carnival memories.',
  },
  {
    id: '005',
    artKey: 'clockwork-crow',
    name: 'Clockwork Crow',
    type: 'Steel / Dark',
    color: '#94a3b8',
    accentColor: '#cbd5e1',
    symbol: 'STL',
    hp: 150,
    attacks: [
      { name: 'Gear Peck', damage: '60', desc: 'Strips armor plating with precision brass cogs.' },
      { name: 'Midnight Clockwork', damage: '120', desc: 'Stops local temporal flow for a devastating phantom strike.' },
    ],
    rarity: 'Ultra Rare',
    illustrator: 'ELE5BA Studio',
    lore: 'Perched on the carousel roof, its internal gears ticking down the seconds until midnight.',
  },
  {
    id: '006',
    artKey: 'grinfin',
    name: 'Grinfin',
    type: 'Water / Abyssal',
    color: '#06b6d4',
    accentColor: '#22d3ee',
    symbol: 'WAT',
    hp: 160,
    attacks: [
      { name: 'Abyssal Chomp', damage: '70', desc: 'Snaps with bioluminescent jaws that glow in deep water.' },
      { name: 'Deadlights Tsunami', damage: '140', desc: 'Summons an overwhelming surge of haunted carnival waters.' },
    ],
    rarity: 'Apex Legendary',
    illustrator: 'ELE5BA Studio',
    lore: 'The apex phantom lurking beneath the submerged fairground channels.',
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
  constructor({ canvas, onStateChange, onRunEnd }) {
    this.canvas = canvas;
    this.onStateChange = onStateChange;
    this.onRunEnd = onRunEnd;

    this.world = createScene(canvas);
    this.clock = new THREE.Clock(false);

    // Player & Pursuer Voxel Rigs
    this.playerEntity = new PlayerCharacter();
    this.world.scene.add(this.playerEntity.root);

    this.pursuerEntity = new PursuerEntity();
    this.world.scene.add(this.pursuerEntity.root);

    this.laneIndex = 1;
    this.targetX = GAME_CONFIG.laneCenters[1];
    this.currentX = GAME_CONFIG.laneCenters[1];
    this.objects = [];
    this.running = false;
    this.paused = false;

    this.frame = this.frame.bind(this);
    this.resize = this.resize.bind(this);
    this.keydown = this.keydown.bind(this);

    window.addEventListener('resize', this.resize);
    window.addEventListener('keydown', this.keydown);
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

  updateHud(extra = {}) {
    const currentStage = GAME_STAGES[this.currentStageIndex] || GAME_STAGES[0];
    const score = calculateScore({
      survivalSeconds: this.elapsedMs / 1000,
      normalShardPickups: this.normalShards,
      rareBonusPickups: this.rarePickups,
      milestonesReached: this.milestones.size,
      stagesCleared: this.stagesCleared,
      fragmentsCollected: this.fragmentsCollected,
    });

    this.onStateChange?.({
      health: this.health,
      maxHealth: GAME_CONFIG.maxHealth,
      shards: this.normalShards + (this.rarePickups * 3) + (this.stagesCleared * (GAME_CONFIG.rewards.stageClearShards ?? 15)),
      elapsedSeconds: this.elapsedMs / 1000,
      stageNumber: this.currentStageIndex + 1,
      totalStages: GAME_STAGES.length,
      stageName: currentStage.name,
      stageSubtitle: currentStage.subtitle,
      stageElapsedSeconds: this.stageElapsedMs / 1000,
      stageDurationSeconds: currentStage.durationSeconds,
      stagesCleared: this.stagesCleared,
      stageCardsCollected: this.stageCardsCollected ?? 0,
      cardsRequiredPerStage: GAME_CONFIG.cardsRequiredPerStage ?? 5,
      fragmentsCollected: this.fragmentsCollected,
      score,
      lane: this.laneIndex,
      jumping: this.jumpElapsedMs > 0,
      paused: this.paused,
      ...extra,
    });
  }

  start() {
    if (this.running) return;
    Object.assign(this, {
      running: true,
      paused: false,
      isLossSequenceActive: false,
      lossElapsedMs: 0,
      lossReason: null,
      elapsedMs: 0,
      stageElapsedMs: 0,
      currentStageIndex: 0,
      stagesCleared: 0,
      fragmentsCollected: 0,
      stageCardsCollected: 0,
      scheduledCardIndex: 0,
      spawnElapsedMs: 0,
      jumpElapsedMs: 0,
      invulnerableMs: 0,
      health: GAME_CONFIG.startingHealth,
      normalShards: 0,
      rarePickups: 0,
      milestones: new Set(),
      events: [],
      distanceM: 0,
    });

    this.pursuerEntity?.resetJumpscare?.();
    this.world.camera.position.set(0, 5.2, 8.5);
    this.world.camera.lookAt(0, 1.2, -6);

    this.laneIndex = 1;
    this.targetX = GAME_CONFIG.laneCenters[1];
    this.currentX = GAME_CONFIG.laneCenters[1];
    if (this.playerEntity?.root) {
      this.playerEntity.root.visible = true;
    }
    this.playerEntity.root.position.set(this.currentX, 0, 0);

    this.world.applyAtmosphere(null, 1);
    this.updateHud();
    this.clock.start();
    this.frame();
  }

  triggerLossSequence(endReason) {
    if (this.isLossSequenceActive || !this.running) return;
    this.isLossSequenceActive = true;
    this.lossReason = endReason;
    this.lossElapsedMs = 0;
    this.lossDurationMs = 1350;

    // Hide player model so Pennywise's flight and attack are 100% visible and unobstructed
    if (this.playerEntity?.root) {
      this.playerEntity.root.visible = false;
    }

    // Trigger Pennywise flying towards the camera with unhinged jaw & Deadlights
    this.pursuerEntity?.triggerJumpscare?.();

    // Signal UI for sound cue and horror vignette
    this.updateHud({ jumpscareActive: true, lossReason: endReason });
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
      this.emit(EVENT_TYPES.LANE_CHANGE, laneKey[next], 0, next);
      this.updateHud();
    }
  }

  jump() {
    if (this.jumpElapsedMs === 0) {
      this.jumpElapsedMs = 1;
      this.emit(EVENT_TYPES.JUMP, ENTITY_KEYS.PLAYER_JUMP);
      this.updateHud();
    }
  }

  spawn() {
    const stage = GAME_STAGES[this.currentStageIndex] || GAME_STAGES[0];
    const allowedHazards = stage.hazardTypes || ['blocker_crate', 'shadow_wave'];

    const isHazard = Math.random() < 0.64;

    if (isHazard) {
      const canDoDouble = allowedHazards.includes('double_blockade') && Math.random() < 0.28;
      const canDoSway = allowedHazards.includes('swaying_specter') && Math.random() < 0.35;
      const canDoWave = allowedHazards.includes('shadow_wave') && Math.random() < 0.40;

      if (canDoDouble) {
        // Double Blockade: blocks 2 lanes, leaves 1 escape lane
        const openLane = Math.floor(Math.random() * 3);
        const blockedLanes = [0, 1, 2].filter((l) => l !== openLane);

        blockedLanes.forEach((lane) => {
          const mesh = createDoubleBlockadeSingle(lane, openLane);
          mesh.position.set(GAME_CONFIG.laneCenters[lane], 0, -GAME_CONFIG.spawnDistance);
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

      const lane = Math.floor(Math.random() * 3);
      if (canDoSway) {
        // Swaying Specter Lantern-Wraith
        const mesh = createSwayingSpecter();
        mesh.position.set(GAME_CONFIG.laneCenters[lane], 1.25, -GAME_CONFIG.spawnDistance);
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

      // Blocker Crate or Low Jumpable Shadow Wave
      const isWave = canDoWave;
      const mesh = isWave ? createShadowWave() : createBlockerCrate();
      mesh.position.set(GAME_CONFIG.laneCenters[lane], isWave ? 0.05 : 0.72, -GAME_CONFIG.spawnDistance);
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
    } else {
      // Pickups: Normal Shards or Amber Orbs (Cards spawn exclusively on deterministic 5-card schedule)
      const lane = Math.floor(Math.random() * 3);
      const isRare = Math.random() < 0.28;

      const mesh = isRare ? createAmberOrb() : createRiftShard();
      const entityKey = isRare ? ENTITY_KEYS.AMBER_ORB : ENTITY_KEYS.RIFT_SHARD;

      mesh.position.set(GAME_CONFIG.laneCenters[lane], 1.05, -GAME_CONFIG.spawnDistance);
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

  spawnScheduledCard(cardIndex) {
    const lane = Math.floor(Math.random() * 3);
    const mesh = createCardFragment();
    mesh.position.set(GAME_CONFIG.laneCenters[lane], 1.15, -GAME_CONFIG.spawnDistance);
    this.world.scene.add(mesh);

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

  updateObjects(deltaMs, speed) {
    const dt = deltaMs / 1000;

    for (const object of this.objects) {
      object.mesh.position.z += speed * dt;

      // Swaying Specter sinusoidal drift across lanes
      if (object.isSway) {
        object.swayTime += deltaMs * 0.003;
        const offset = Math.sin(object.swayTime) * 1.85;
        object.mesh.position.x = Math.max(-3.5, Math.min(3.5, object.baseX + offset));
        object.mesh.rotation.z = Math.cos(object.swayTime) * 0.25; // Bank into drift

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

      // Pickup animations
      if (!object.isHazard) {
        object.mesh.rotation.y += deltaMs * 0.006;

        // Custom prefab animations
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
          this.emit(EVENT_TYPES.COLLISION, object.entityKey, 0, object.lane);
          this.updateHud({ hit: true });
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
            this.emit(EVENT_TYPES.FRAGMENT_PICKUP, ENTITY_KEYS.CARD_FRAGMENT, 1, object.lane);
            const cardPickup = getCardPickupInfo(this.stageCardsCollected, this.currentStageIndex);
            this.updateHud({
              fragmentGot: true,
              cardPickup,
              stageCardsCollected: this.stageCardsCollected,
            });
          } else if (object.isRare) {
            this.rarePickups += 1;
            this.emit(EVENT_TYPES.RARE_PICKUP, ENTITY_KEYS.AMBER_ORB, 3, object.lane);
          } else {
            this.normalShards += 1;
            this.emit(EVENT_TYPES.SHARD_PICKUP, ENTITY_KEYS.RIFT_SHARD, 1, object.lane);
          }
          this.updateHud();
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

    this.objects = this.objects.filter((object) => {
      if (object.mesh.position.z > 8 || object.consumed) {
        this.world.scene.remove(object.mesh);
        object.mesh.traverse((child) => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            const mats = Array.isArray(child.material) ? child.material : [child.material];
            mats.forEach((m) => m.dispose());
          }
        });
        return false;
      }
      return true;
    });
  }

  advanceStage() {
    const completedStageNum = this.currentStageIndex + 1;
    const stageKey = ENTITY_KEYS[`STAGE_${completedStageNum}`];
    this.emit(EVENT_TYPES.STAGE_CLEAR, stageKey, 1);
    this.stagesCleared += 1;

    const completedCard = {
      ...POKEMON_CARD_ROSTER[this.currentStageIndex % POKEMON_CARD_ROSTER.length],
      stageNumber: completedStageNum,
      cardsCollected: this.stageCardsCollected,
      totalRequired: GAME_CONFIG.cardsRequiredPerStage || 5,
    };

    // Reset per-stage card counters
    this.stageCardsCollected = 0;
    this.scheduledCardIndex = 0;

    // Checkpoint heal
    if (this.health < (GAME_CONFIG.maxHealth ?? 3)) {
      this.health += 1;
    }

    if (this.currentStageIndex < GAME_STAGES.length - 1) {
      this.currentStageIndex += 1;
      this.stageElapsedMs = 0;
      const nextStage = GAME_STAGES[this.currentStageIndex];

      // Update 6-stage atmosphere
      this.world.applyAtmosphere(null, this.currentStageIndex + 1);

      this.updateHud({
        stageClearedBanner: true,
        clearedStageNum: completedStageNum,
        nextStageNum: this.currentStageIndex + 1,
        nextStageName: nextStage.name,
        stageCompletedCard: completedCard,
      });
    } else {
      this.updateHud({
        stageCompletedCard: completedCard,
      });
      this.finish('all_stages_cleared');
    }
  }

  frame() {
    if (!this.running) return;
    const deltaMs = Math.min(this.clock.getDelta() * 1000, 50);

    // Pennywise jumpscare cinematic loss sequence
    if (this.isLossSequenceActive) {
      this.lossElapsedMs += deltaMs;

      // Update Pennywise flying towards the camera with unhinged jaw & Deadlights
      this.pursuerEntity?.update(deltaMs, 0, this.currentX);

      // Camera shudder and tremor intensifying as Pennywise draws near
      const progress = Math.min(1, this.lossElapsedMs / this.lossDurationMs);
      const shakeAmp = 0.05 + Math.pow(progress, 2.4) * 0.32;
      this.world.camera.position.x = (Math.random() - 0.5) * shakeAmp;
      this.world.camera.position.y = 5.2 + (Math.random() - 0.5) * shakeAmp;
      this.world.camera.position.z = 8.5 + (Math.random() - 0.5) * (shakeAmp * 0.4);
      this.world.camera.lookAt(0, 1.2, -6);

      // Render the frame to screen so the jumpscare flight is visible
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

      const speed = Math.min(
        currentStage.speed.maximum,
        currentStage.speed.base + currentStage.speed.perSecond * stageProgress
      );

      this.distanceM += speed * (deltaMs / 1000);
      this.spawnElapsedMs += deltaMs;
      this.invulnerableMs -= deltaMs;

      // Road cobblestone texture scrolling
      if (this.world.cobbleTex) {
        this.world.cobbleTex.offset.y -= speed * (deltaMs / 1000) * 0.055;
      }

      // Ferris Wheel rotation
      if (this.world.ferrisWheelGroup) {
        this.world.ferrisWheelGroup.rotation.z += deltaMs * 0.00035;
      }

      // Carousel rotation
      if (this.world.carouselGroup) {
        this.world.carouselGroup.rotation.y += deltaMs * 0.00045;
      }

      // Particles drift
      if (this.world.particles) {
        const positions = this.world.particles.geometry.attributes.position.array;
        for (let i = 2; i < positions.length; i += 3) {
          positions[i] += speed * (deltaMs / 1000) * 0.45;
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

      // Sync dedicated player rim light to follow player X position
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

      // Scheduled card spawning (exactly 5 cards per 60-second stage)
      const stageSeconds = this.stageElapsedMs / 1000;
      const schedule = GAME_CONFIG.cardSpawnSchedule || [8, 20, 32, 44, 54];
      if (
        this.scheduledCardIndex < schedule.length &&
        stageSeconds >= schedule[this.scheduledCardIndex]
      ) {
        this.spawnScheduledCard(this.scheduledCardIndex);
        this.scheduledCardIndex += 1;
      }

      // Stage progression (60 seconds per level - requires all 5 cards)
      if (this.stageElapsedMs >= currentStage.durationSeconds * 1000) {
        if (this.stageCardsCollected < (GAME_CONFIG.cardsRequiredPerStage || 5)) {
          this.emit(EVENT_TYPES.CARD_MISSED, ENTITY_KEYS.CARD_FRAGMENT, 1, this.laneIndex);
          this.triggerLossSequence('card_missed');
          return;
        }
        this.advanceStage();
        if (!this.running) return;
      }

      // Spawning interval
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

      this.updateHud();

      if (this.elapsedMs >= GAME_CONFIG.roundCapSeconds * 1000) {
        this.triggerLossSequence('time_limit');
        return;
      }

      this.world.renderer.render(this.world.scene, this.world.camera);
    }

    this.animationFrame = requestAnimationFrame(this.frame);
  }

  finish(endReason = 'player_exit') {
    if (!this.running) return;
    this.running = false;
    cancelAnimationFrame(this.animationFrame);
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
      this.updateHud();
    }
  }

  resume() {
    if (this.running) {
      this.paused = false;
      this.clock.getDelta();
      this.updateHud();
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
    window.removeEventListener('resize', this.resize);
    window.removeEventListener('keydown', this.keydown);

    this.playerEntity?.dispose();
    this.pursuerEntity?.dispose();

    this.objects.forEach(({ mesh }) => {
      this.world.scene.remove(mesh);
      mesh.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          const mats = Array.isArray(child.material) ? child.material : [child.material];
          mats.forEach((m) => m.dispose());
        }
      });
    });

    this.world.cobbleTex?.dispose();
    this.world.renderer?.dispose();
  }
}
