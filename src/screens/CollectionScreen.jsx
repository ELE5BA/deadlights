import { useEffect, useState } from 'react';
import { getCollection, unlockCreature, craftCreature } from '../services/apiClient.js';
import PokedexCardArt from '../components/PokedexCardArt.jsx';

const POKEMON_CARD_META = {
  mossbyte: {
    element: 'GRASS / ROCK',
    elementTag: 'GRASS',
    stageOrigin: 'Stage 1: Twilight Mist',
    hp: 70,
    attacks: [
      { name: 'Vine Sprout', dmg: '20', desc: 'Tangling moss binds pursuing shadows.' },
      { name: 'Luminescent Pulse', dmg: '45', desc: 'Emits a cyan burst to illuminate dark rifts.' },
    ],
    weakness: 'FIRE',
    retreatCost: 1,
  },
  'lantern-hare': {
    element: 'ELECTRIC / LIGHT',
    elementTag: 'LIGHT',
    stageOrigin: 'Stage 2: Amber Hollow',
    hp: 80,
    attacks: [
      { name: 'Lantern Glow', dmg: '30', desc: 'Blinds predators with warm golden light.' },
      { name: 'Shadow Hop', dmg: '50', desc: 'Leaps gracefully over low rift waves.' },
    ],
    weakness: 'DARK',
    retreatCost: 1,
  },
  'static-moth': {
    element: 'ELECTRIC / FLYING',
    elementTag: 'STORM',
    stageOrigin: 'Stage 3: Crimson Mire',
    hp: 80,
    attacks: [
      { name: 'Static Flutter', dmg: '35', desc: 'Sparks electric cyan currents across lanes.' },
      { name: 'Volt Surge', dmg: '65', desc: 'Unleashes high-voltage wing shockwaves.' },
    ],
    weakness: 'ROCK',
    retreatCost: 1,
  },
  'velvet-wisp': {
    element: 'PSYCHIC / GHOST',
    elementTag: 'ETHER',
    stageOrigin: 'Stage 4: Glitch Rift',
    hp: 90,
    attacks: [
      { name: 'Velvet Veil', dmg: '40', desc: 'Shrouds itself in draping phantom silks.' },
      { name: 'Magenta Rift', dmg: '75', desc: 'Opens a fissure in the spatial continuum.' },
    ],
    weakness: 'DARK',
    retreatCost: 2,
  },
  'clockwork-crow': {
    element: 'STEEL / FLYING',
    elementTag: 'STEEL',
    stageOrigin: 'Stage 5: Abyssal Void',
    hp: 100,
    attacks: [
      { name: 'Brass Talon', dmg: '45', desc: 'Strikes with razor-sharp brass feathers.' },
      { name: 'Chrono Disc', dmg: '85', desc: 'Rotates its eye disc to slow incoming hazards.' },
    ],
    weakness: 'FIRE',
    retreatCost: 2,
  },
  grinfin: {
    element: 'DARK / WATER',
    elementTag: 'ABYSS',
    stageOrigin: 'Stage 6: Deadlights Core',
    hp: 110,
    attacks: [
      { name: 'Crescent Smile', dmg: '50', desc: 'Unsettles adversaries with an eerie grin.' },
      { name: 'Nightmare Dive', dmg: '100', desc: 'Plunges into the deep void to ambush pursuers.' },
    ],
    weakness: 'LIGHTNING',
    retreatCost: 2,
  },
  moonjaw: {
    element: 'DRAGON / ROCK',
    elementTag: 'COSMIC',
    stageOrigin: 'Secret: Shard Vault',
    hp: 130,
    attacks: [
      { name: 'Meteor Crunch', dmg: '70', desc: 'Crushes solid obsidian barriers with its jaw.' },
      { name: 'Lunar Roar', dmg: '120', desc: 'Shatters space with a devastating cosmic cry.' },
    ],
    weakness: 'ICE',
    retreatCost: 3,
  },
  'the-tethered': {
    element: 'MYTHIC / VOID',
    elementTag: 'VOID',
    stageOrigin: 'Apex Entity',
    hp: 160,
    attacks: [
      { name: 'Deadlights Ray', dmg: '90', desc: 'The horrifying glowing lights from beyond the stars.' },
      { name: 'Infinite Funhouse', dmg: '150', desc: 'Traps opposing entities in an endless carnival maze.' },
    ],
    weakness: 'NONE',
    retreatCost: 3,
  },
};

export default function CollectionScreen({ player, onBack, onPlayerUpdate }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');

  const refresh = () =>
    getCollection(player.playerId)
      .then(setData)
      .catch(() => setError('Collection is unavailable. Please retry.'));

  useEffect(() => {
    refresh();
  }, [player.playerId]);

  async function unlockWithShards(creature) {
    setBusy(creature.id);
    setError('');
    try {
      const result = await unlockCreature(player.playerId, creature.id);
      setData(result);
      onPlayerUpdate((current) => ({ ...current, wallet: result.wallet }));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy('');
    }
  }

  async function craftWithFragmentsAction(creature) {
    setBusy(creature.id);
    setError('');
    try {
      const result = await craftCreature(player.playerId, creature.id);
      setData(result);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy('');
    }
  }

  // Interactive 3D Perspective Tilt for Collector Cards
  function handleCardMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    e.currentTarget.style.setProperty('--card-rx', `${-y * 20}deg`);
    e.currentTarget.style.setProperty('--card-ry', `${x * 20}deg`);
    e.currentTarget.style.setProperty('--glare-x', `${(x + 0.5) * 100}%`);
    e.currentTarget.style.setProperty('--glare-y', `${(y + 0.5) * 100}%`);
  }

  function handleCardMouseLeave(e) {
    e.currentTarget.style.setProperty('--card-rx', '0deg');
    e.currentTarget.style.setProperty('--card-ry', '0deg');
    e.currentTarget.style.setProperty('--glare-x', '50%');
    e.currentTarget.style.setProperty('--glare-y', '50%');
  }

  if (!data) {
    return (
      <main className="overlay-screen">
        <section className="setup-card">
          <p className="eyebrow">ARCHIVE REPOSITORIES</p>
          <h2>LOADING POKÉDEX BINDER…</h2>
          {error && <button className="text-button" onClick={refresh}>RETRY CONNECTION</button>}
        </section>
      </main>
    );
  }

  const owned = new Set(data.unlocked.map((item) => item.creatureId));
  const fragmentsMap = data.fragments || {};

  return (
    <main className="overlay-screen collection-screen">
      <section className="collection-panel">
        <header className="binder-header">
          <div className="binder-title-block">
            <p className="eyebrow">ARCHIVAL CODEX · THE LOST POKÉDEX</p>
            <h2>{player.nickname.toUpperCase()}’S CARD BINDER</h2>
            <div className="binder-counters">
              <span className="balance-pill">
                <span className="pill-dot" /> {data.wallet.shardsBalance} RIFT SHARDS
              </span>
              <span className="balance-pill">
                <span className="pill-dot" /> {owned.size} / {data.catalog.length} CARDS ACQUIRED
              </span>
            </div>
          </div>
          <button className="primary-button binder-return-btn" onClick={onBack}>
            RETURN TO TITLE
          </button>
        </header>

        {error && <p className="form-error">{error}</p>}

        <div className="pokemon-card-grid">
          {data.catalog.map((creature, index) => {
            const isOwned = owned.has(creature.id);
            const frags = fragmentsMap[creature.id] || 0;
            const canCraft = !isOwned && frags >= 3;
            const meta = POKEMON_CARD_META[creature.id] || {
              element: 'UNKNOWN',
              elementTag: 'VOID',
              stageOrigin: 'The Rift',
              hp: 60,
              attacks: [{ name: 'Spectral Strike', dmg: '30', desc: 'Rift energy attack.' }],
              weakness: 'NONE',
              retreatCost: 1,
            };

            return (
              <article
                className={`pokemon-tcg-card ${isOwned ? 'owned-card' : 'locked-card'}`}
                key={creature.id}
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
                style={{
                  '--card-theme-color': creature.colorHex,
                  '--card-accent': creature.colorHex,
                }}
              >
                <div className="card-foil-sheen" />

                <div className="card-outer-border">
                  <div className="card-inner-frame">
                    {/* Card Header */}
                    <div className="tcg-header">
                      <div className="tcg-title-block">
                        <span className="tcg-stage-tag">{meta.stageOrigin}</span>
                        <h3 className="tcg-name">{creature.name}</h3>
                      </div>
                      <div className="tcg-hp-block">
                        <span className="tcg-hp-label">HP</span>
                        <span className="tcg-hp-val">{meta.hp}</span>
                        <span className="tcg-type-badge">{meta.elementTag}</span>
                      </div>
                    </div>

                    {/* Procedural 48x48 Pixel Art Canvas Frame with Micro-Animations */}
                    <div className="tcg-art-box">
                      <PokedexCardArt
                        artKey={creature.artKey || creature.id}
                        isOwned={isOwned}
                        creatureName={creature.name}
                      />
                      <span className="tcg-meta-strip">
                        NO. 00{index + 1} · {meta.element} · {creature.rarity.toUpperCase()}
                      </span>
                    </div>

                    {/* Attacks / Abilities */}
                    <div className="tcg-moves-box">
                      {meta.attacks.map((atk, aIdx) => (
                        <div className="tcg-attack" key={aIdx}>
                          <div className="tcg-atk-header">
                            <span className="tcg-atk-cost">{meta.elementTag.slice(0, 3)}</span>
                            <span className="tcg-atk-name">{atk.name}</span>
                            <span className="tcg-atk-dmg">{atk.dmg}</span>
                          </div>
                          <p className="tcg-atk-desc">{atk.desc}</p>
                        </div>
                      ))}
                    </div>

                    {/* Lore Flavor Text */}
                    <div className="tcg-flavor-box">
                      <p className="tcg-flavor-text">"{creature.description}"</p>
                    </div>

                    {/* Card Footer */}
                    <div className="tcg-footer">
                      <span>WEAKNESS: {meta.weakness}</span>
                      <span>RETREAT: {'• '.repeat(meta.retreatCost).trim()}</span>
                      <span className="tcg-rarity-symbol">COLLECTION</span>
                    </div>

                    {/* Unlock / Crafting Action overlay */}
                    <div className="tcg-action-bar">
                      {isOwned ? (
                        <div className="tcg-unlocked-badge">
                          SECURED IN BINDER
                        </div>
                      ) : (
                        <div className="tcg-craft-controls">
                          <div className="tcg-fragment-gauge">
                            <span>FRAGMENTS: {frags} / 3</span>
                            <div className="frag-pip-row">
                              {[0, 1, 2].map((p) => (
                                <span key={p} className={`frag-pip ${p < frags ? 'filled' : 'empty'}`}>
                                  {p < frags ? '■' : '□'}
                                </span>
                              ))}
                            </div>
                          </div>

                          {canCraft ? (
                            <button
                              className="craft-button"
                              disabled={busy === creature.id}
                              onClick={() => craftWithFragmentsAction(creature)}
                            >
                              {busy === creature.id ? 'ASSEMBLING…' : 'ASSEMBLE CARD (3 FRAGMENTS)'}
                            </button>
                          ) : (
                            <button
                              className="shard-unlock-button"
                              disabled={busy === creature.id || data.wallet.shardsBalance < creature.shardCost}
                              onClick={() => unlockWithShards(creature)}
                            >
                              {busy === creature.id ? 'UNLOCKING…' : `PURCHASE · ${creature.shardCost} SHARDS`}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
