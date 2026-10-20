/**
 * Cartoon Poké-Balloon Emblem
 * Glossy red-and-white Pokéball floating on a carnival balloon string
 * with glowing yellow Deadlights eyes and thick #120b1d comic ink outlines.
 */
export default function PokeBalloonEmblem() {
  return (
    <div className="poke-balloon-emblem-wrap">
      <svg
        className="poke-balloon-emblem"
        viewBox="0 0 72 84"
        width="68"
        height="78"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <clipPath id="topBallHalf">
            <rect x="0" y="0" width="72" height="34" />
          </clipPath>
          <radialGradient id="balloonGloss" cx="35%" cy="25%" r="65%">
            <stop stopColor="#ffffff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Balloon tether string */}
        <path
          d="M36 62 Q33 70 38 75 T36 83"
          stroke="#120b1d"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Balloon tie knot */}
        <polygon points="33,63 39,63 36,60" fill="#dc2626" stroke="#120b1d" strokeWidth="2.2" />

        {/* Main balloon sphere (white base with thick ink outline) */}
        <circle
          cx="36"
          cy="34"
          r="28"
          fill="#f8fafc"
          stroke="#120b1d"
          strokeWidth="3.5"
        />

        {/* Top red hemisphere */}
        <circle
          cx="36"
          cy="34"
          r="28"
          fill="#ef4444"
          clipPath="url(#topBallHalf)"
        />

        {/* Glossy balloon shine highlight */}
        <ellipse
          cx="26"
          cy="22"
          rx="10"
          ry="6"
          transform="rotate(-25 26 22)"
          fill="url(#balloonGloss)"
        />

        {/* Black dividing equator band */}
        <line x1="8" y1="34" x2="64" y2="34" stroke="#120b1d" strokeWidth="3.5" />

        {/* Center release button */}
        <circle cx="36" cy="34" r="8.5" fill="#f8fafc" stroke="#120b1d" strokeWidth="3.2" />
        <circle cx="36" cy="34" r="4.2" fill="#ffffff" stroke="#120b1d" strokeWidth="1.8" />

        {/* Glowing yellow predatory Deadlights eyes */}
        <ellipse cx="26" cy="27" rx="3.5" ry="2.2" fill="#facc15" stroke="#120b1d" strokeWidth="1.6" />
        <ellipse cx="46" cy="27" rx="3.5" ry="2.2" fill="#facc15" stroke="#120b1d" strokeWidth="1.6" />
        <circle cx="26" cy="27" r="1.1" fill="#090510" />
        <circle cx="46" cy="27" r="1.1" fill="#090510" />
      </svg>
    </div>
  );
}
