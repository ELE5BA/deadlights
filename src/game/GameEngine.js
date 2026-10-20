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
} from './soundEffects.js';

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
  constructor({ canvas, onStateChange, onRunEnd, onFrameTick }) {
    this.canvas = canvas;
    this.onStateChange = onStateChange;
    this.onRunEnd = onRunEnd;
    this.onFrameTick = onFrameTick;

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
    this.cameraTiltZ = 0;
    this.lastHudSyncMs = 0;
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
    if (this.running) return;
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
    });

    this.pursuerEntity?.resetJumpscare?.();
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
    this.frame();
  }

  triggerLossSequence(endReason) {
    if (this.isLossSequenceActive || !this.running) return;
    this.isLossSequenceActive = true;
    this.lossReason = endReason;
    this.lossElapsedMs = 0;
    this.lossDurationMs = 1350;

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

  getSafeLaneForScheduledCard(spawnZ) {
    // 1. Scan this.objects for any active hazard where Math.abs(obj.mesh.position.z - spawnZ) < 9.5
    const nearbyHazards = this.objects.filter(
      (obj) => obj.isHazard && !obj.consumed && Math.abs(obj.mesh.position.z - spawnZ) < 9.5
    );

    // If any hazard within ±6.5 Z-units is a double_blockade or swaying_specter, remove it immediately
    nearbyHazards.forEach((hazard) => {
      if (Math.abs(hazard.mesh.position.z - spawnZ) < 6.5) {
        if (hazard.entityKey === ENTITY_KEYS.DOUBLE_BLOCKADE || hazard.isSway) {
          hazard.consumed = true;
          this.world.scene.remove(hazard.mesh);
        }
      }
    });

    // Collect the lanes of any remaining single-lane hazards within ±9.5 Z-units
    const occupiedLanes = new Set();
    this.objects.forEach((obj) => {
      if (obj.isHazard && !obj.consumed && Math.abs(obj.mesh.position.z - spawnZ) < 9.5) {
        occupiedLanes.add(obj.lane);
      }
    });

    // Pick a lane for the card that is 100% free of hazards
    const freeLanes = [0, 1, 2].filter((l) => !occupiedLanes.has(l));
    let chosenLane;
    if (freeLanes.length > 0) {
      chosenLane = freeLanes[Math.floor(Math.random() * freeLanes.length)];
    } else {
      // If all 3 lanes have a hazard in that range, remove the hazard in the chosen card lane
      chosenLane = Math.floor(Math.random() * 3);
      this.objects.forEach((obj) => {
        if (obj.isHazard && !obj.consumed && obj.lane === chosenLane && Math.abs(obj.mesh.position.z - spawnZ) < 9.5) {
          obj.consumed = true;
          this.world.scene.remove(obj.mesh);
        }
      });
    }

    this.cardSpawnSafeGuardMs = 900;
    return chosenLane;
  }

  spawnScheduledCard(cardIndex) {
    const spawnZ = -GAME_CONFIG.spawnDistance;
    const lane = this.getSafeLaneForScheduledCard(spawnZ);
    const mesh = createCardFragment();
    mesh.position.set(GAME_CONFIG.laneCenters[lane], 1.15, spawnZ);
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

  spawn() {
    const stage = GAME_STAGES[this.currentStageIndex] || GAME_STAGES[0];
    const stageNum = this.currentStageIndex + 1;
    const allowedHazards = stage.hazardTypes || ['blocker_crate', 'shadow_wave'];
    const spawnZ = -GAME_CONFIG.spawnDistance;

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

      // If a card is nearby, forbid double_blockade and swaying_specter
      const canDoDouble = !cardNearby && allowedHazards.includes('double_blockade') && Math.random() < 0.28;
      const canDoSway = !cardNearby && allowedHazards.includes('swaying_specter') && Math.random() < 0.35;
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

      // Choose a lane that excludes any nearby card's lane
      let availableLanes = [0, 1, 2].filter((l) => !cardLanesOccupied.has(l));
      if (availableLanes.length === 0) availableLanes = [0, 1, 2];
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
      if (!isWave && !cardNearby && this.currentStageIndex >= 2 && allowedHazards.includes('shadow_wave')) {
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
      const lane = Math.floor(Math.random() * 3);
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

    // Zero-GC Removal: Simply remove mesh from scene without mid-frame GPU disposal!
    this.objects = this.objects.filter((object) => {
      if (object.mesh.position.z > 8 || object.consumed) {
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

      this.world.applyAtmosphere(null, this.currentStageIndex + 1);

      this.updateHudImmediate({
        stageClearedBanner: true,
        clearedStageNum: completedStageNum,
        nextStageNum: this.currentStageIndex + 1,
        nextStageName: nextStage.name,
        stageCompletedCard: completedCard,
      });
    } else {
      this.updateHudImmediate({
        stageCompletedCard: completedCard,
      });
      this.finish('all_stages_cleared');
    }
  }

  frame() {
    if (!this.running) return;
    const deltaMs = Math.min(this.clock.getDelta() * 1000, 50);
    const dt = deltaMs / 1000;

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

      // Scheduled card spawning (deterministic 5 cards per 60s stage)
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
      if (this.stageElapsedMs >= stageDuration * 1000) {
        if (this.stageCardsCollected < (GAME_CONFIG.cardsRequiredPerStage || 5)) {
          this.emit(EVENT_TYPES.CARD_MISSED, ENTITY_KEYS.CARD_FRAGMENT, 1, this.laneIndex);
          this.triggerLossSequence('card_missed');
          return;
        }
        this.advanceStage();
        if (!this.running) return;
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

      // 60FPS Direct DOM callback for smooth progress bar transform without React re-renders!
      const stageProgressRatio = Math.min(1, this.stageElapsedMs / (stageDuration * 1000));
      this.onFrameTick?.({
        stageProgressRatio,
        speed,
        stageElapsedSeconds: this.stageElapsedMs / 1000,
        stageDurationSeconds: stageDuration,
      });

      // Throttled Telemetry Sync: Dispatch to React at 8.3Hz (~120ms) instead of 60Hz thrashing
      if (this.elapsedMs - this.lastHudSyncMs >= 120) {
        this.lastHudSyncMs = this.elapsedMs;
        this.updateHud();
      }

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
      this.updateHudImmediate();
    }
  }

  resume() {
    if (this.running) {
      this.paused = false;
      this.clock.getDelta();
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
