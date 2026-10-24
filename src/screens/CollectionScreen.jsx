import { useEffect, useState } from 'react';
import { getCollection, unlockCreature, craftCreature } from '../services/apiClient.js';
import PokedexCardArt from '../components/PokedexCardArt.jsx';

const POKEMON_CARD_META = {
  mossbyte: {
    name: 'Bulba-Moss',
    displayName: 'Bulba-Moss',
    lore: 'A cybernetic bulb Pokémon fused with ancient carnival moss. The flower blooming on its back absorbs spectral energy and radiates a soothing emerald aura.',
    element: 'GRASS / POISON',
    elementTag: 'GRASS',
    stageOrigin: 'Stage 1: Twilight Mist',
    hp: 120,
    attacks: [
      { name: 'Razor Vine Burst', dmg: '40+', desc: 'Strikes with razor-sharp thorned vines. Deals 20 more damage if this Pokémon has full Vitality.' },
      { name: 'Solar Bloom Cataclysm', dmg: '100', desc: 'Gathers stored photosynthetic energy in its bulb, unleashing a radiant beam that purifies dark carnival mist.' },
    ],
    weakness: 'FIRE',
    retreatCost: 1,
  },
  'lantern-hare': {
    name: 'Pika-Lantern',
    displayName: 'Pika-Lantern',
    lore: 'An energetic electric mouse leaping across ticket booths in a protective yellow slicker. Its lightning tail lantern guides lost runners through the dark.',
    element: 'ELECTRIC / LIGHT',
    elementTag: 'LIGHT',
    stageOrigin: 'Stage 2: Amber Hollow',
    hp: 130,
    attacks: [
      { name: 'Spark Beacon', dmg: '45', desc: 'Discharges crackling high-voltage sparks from its cheek pouches, illuminating hidden track hazards.' },
      { name: 'Volt Overdrive Tackle', dmg: '110', desc: 'Cloaks itself in blinding golden electricity and charges headlong through enemy barricades.' },
    ],
    weakness: 'GROUND',
    retreatCost: 1,
  },
  'static-moth': {
    name: 'Zap-Venomoth',
    displayName: 'Zap-Venomoth',
    lore: 'An electrified storm moth whose vibrating wings generate thousands of volts. It glides fearlessly along high-tension circus wires.',
    element: 'ELECTRIC / FLYING',
    elementTag: 'STORM',
    stageOrigin: 'Stage 3: Crimson Mire',
    hp: 140,
    attacks: [
      { name: 'Electro Web Snare', dmg: '50', desc: 'Spins a crackling mesh of blue lightning across the rails, paralyzing incoming shadows.' },
      { name: 'Thunder Vortex Hurricane', dmg: '120', desc: 'Beats its charged storm wings to summon a deafening hurricane that scatters nearby spectral hazards.' },
    ],
    weakness: 'ROCK',
    retreatCost: 1,
  },
  'velvet-wisp': {
    name: 'Gengar-Wisp',
    displayName: 'Gengar-Wisp',
    lore: 'A shadowy phantom trickster lurking behind the haunted Ferris wheel. Its iconic wide grin gleams with eldritch purple flames.',
    element: 'GHOST / POISON',
    elementTag: 'GHOST',
    stageOrigin: 'Stage 4: Glitch Rift',
    hp: 140,
    attacks: [
      { name: 'Shadow Pulse Barrage', dmg: '60', desc: 'Hurls an orb of concentrated ectoplasm from the ethereal plane into the physical track.' },
      { name: 'Nightmare Dream Eater', dmg: '115', desc: 'Feeds upon the sinister fairground illusions spun by Pennywise, siphoning life back into the runner.' },
    ],
    weakness: 'DARK',
    retreatCost: 2,
  },
  'clockwork-crow': {
    name: 'Corvi-Gear',
    displayName: 'Corvi-Gear',
    lore: 'An imposing raven warrior forged from clockwork brass gears and gunmetal steel armor. It perches atop the carousel roof, ever vigilant.',
    element: 'STEEL / FLYING',
    elementTag: 'STEEL',
    stageOrigin: 'Stage 5: Abyssal Void',
    hp: 150,
    attacks: [
      { name: 'Razor Wing Flurry', dmg: '65', desc: 'Sweeps tempered steel feather blades forward, deflecting oncoming projectile hazards.' },
      { name: 'Clockwork Cog Overclock', dmg: '130', desc: 'Rotates interlocking brass saw gears inside its chest cavity to shred reinforced obsidian blockades.' },
    ],
    weakness: 'FIRE',
    retreatCost: 2,
  },
  grinfin: {
    name: 'Gyarados-Fin',
    displayName: 'Gyarados-Fin',
    lore: 'A colossal sea dragon surging through the flooded subterranean flumes of Derry. Its ancient roar reverberates across dimensions.',
    element: 'WATER / DARK',
    elementTag: 'WATER',
    stageOrigin: 'Stage 6: Grimlight Core',
    hp: 160,
    attacks: [
      { name: 'Tidal Flume Surge', dmg: '75', desc: 'Swings an armored serpentine tail to wash away track debris in a torrential neon deluge.' },
      { name: 'Apex Dragon Deluge', dmg: '150', desc: 'Opens its three-crested fanged maw and roars with untamed aquatic fury, shattering Pennywise’s barrier.' },
    ],
    weakness: 'LIGHTNING',
    retreatCost: 2,
  },
  moonjaw: {
    name: 'Tyran-Jaw',
    displayName: 'Tyran-Jaw',
    lore: 'A prehistoric apex juggernaut encased in black diamond carapace. It awakens only when the lunar eclipse bathes the fairground in silver.',
    element: 'ROCK / DARK',
    elementTag: 'ROCK',
    stageOrigin: 'Secret: Shard Vault',
    hp: 170,
    attacks: [
      { name: 'Obsidian Jaw Crunch', dmg: '85', desc: 'Clamps down with crushing prehistoric jaw force, fracturing the strongest carnival obstacles.' },
      { name: 'Lunar Hyper Beam', dmg: '160', desc: 'Harnesses moonlight to fire an apocalyptic cosmic beam that obliterates reality along the center lane.' },
    ],
    weakness: 'FIGHTING',
    retreatCost: 3,
  },
  'the-tethered': {
    name: 'Penny-Mime EX',
    displayName: 'Penny-Mime EX',
    lore: 'The primordial shape-shifting cosmic jester inhabiting the abyss beneath Derry. Wields floating Poké-Balloons to lure runners into the eternal Grimlight.',
    element: 'PSYCHIC / VOID',
    elementTag: 'MYTH',
    stageOrigin: 'Apex Entity',
    hp: 200,
    attacks: [
      { name: 'Grimlight Hypnosis', dmg: '100', desc: 'Summons three spinning glowing red balloons from beyond the stars, paralyzing all who behold them.' },
      { name: 'Grimlight Ray', dmg: '150', desc: 'Focuses blinding apocalyptic cosmic rays from beyond the stars, cutting through reality along the center lane.' },
      { name: 'Grimlight Tsunami', dmg: '170', desc: 'Traps the entire dimensional rift in a twisted deluge of grim mirrors until shattered by all six Codex seals.' },
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
      <section className="collection-panel cabinet-card">
        <header className="binder-header cabinet-modal-header">
          <div className="binder-title-block">
            <h2 className="cabinet-modal-title">{player.nickname.toUpperCase()}’S GRIMDEX BINDER</h2>
            <p className="cabinet-modal-sub">GRIMDEX · CURSED CARNIVAL CODEX</p>
            <div className="binder-counters cabinet-telemetry-well">
              <span className="balance-pill">
                <span className="stat-label">RIFT SHARDS: </span>
                <b className="stat-val">{data.wallet.shardsBalance}</b>
              </span>
              <span className="balance-pill">
                <span className="stat-label">ACQUIRED: </span>
                <b className="stat-val">{owned.size} / {data.catalog.length}</b>
              </span>
            </div>
          </div>
          <button className="primary-button binder-return-btn cabinet-btn-secondary" onClick={onBack}>
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
                        <h3 className="tcg-name">{meta.displayName || meta.name || creature.name}</h3>
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
                        creatureName={meta.displayName || creature.name}
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
                      <p className="tcg-flavor-text">"{meta.lore || creature.description}"</p>
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
