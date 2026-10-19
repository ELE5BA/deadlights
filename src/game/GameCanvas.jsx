import { useEffect, useRef } from 'react';
import { GameEngine } from './GameEngine.js';

export default function GameCanvas({ onEngine, onStateChange, onRunEnd, reducedEffects }) {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const callbacksRef = useRef({ onStateChange, onRunEnd });
  useEffect(() => { callbacksRef.current = { onStateChange, onRunEnd }; }, [onStateChange, onRunEnd]);
  useEffect(() => {
    const engine = new GameEngine({ canvas: canvasRef.current, onStateChange: (state) => callbacksRef.current.onStateChange?.(state), onRunEnd: (summary) => callbacksRef.current.onRunEnd?.(summary) });
    engineRef.current = engine;
    onEngine(engine);
    return () => engine.dispose();
  }, [onEngine]);
  useEffect(() => { engineRef.current?.setReducedEffects(reducedEffects); }, [reducedEffects]);
  return <canvas className="game-canvas" ref={canvasRef} aria-label="DEADLIGHTS 3D game scene" />;
}
