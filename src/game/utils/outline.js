import * as THREE from 'three';

// Deep Occult Ink (#120b1d) - rich purple-black comic outline color
export const OCCULT_INK_HEX = 0x120b1d;

// Cached line and hull materials to avoid redundant WebGL allocations
const lineMaterialCache = new Map();
const hullMaterialCache = new Map();

function getLineMaterial(color = OCCULT_INK_HEX, opacity = 0.68) {
  const key = `${color}_${opacity}`;
  if (!lineMaterialCache.has(key)) {
    const mat = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity,
      depthTest: true,
    });
    mat.userData = { shared: true };
    lineMaterialCache.set(key, mat);
  }
  return lineMaterialCache.get(key);
}

function getHullMaterial(color = OCCULT_INK_HEX, opacity = 0.85) {
  const key = `${color}_${opacity}`;
  if (!hullMaterialCache.has(key)) {
    const mat = new THREE.MeshBasicMaterial({
      color,
      side: THREE.BackSide,
      transparent: true,
      opacity,
    });
    mat.userData = { shared: true };
    hullMaterialCache.set(key, mat);
  }
  return hullMaterialCache.get(key);
}

/**
 * Adds crisp comic-book occult ink edge lines to boxy/voxel geometries.
 * Uses a 28° crease threshold angle so coplanar faces never draw internal wireframe lines.
 */
export function addBoxOutline(mesh, color = OCCULT_INK_HEX) {
  if (!mesh || !mesh.geometry) return mesh;
  const edges = new THREE.EdgesGeometry(mesh.geometry, 28);
  edges.userData = { shared: true };
  const line = new THREE.LineSegments(edges, getLineMaterial(color, 0.68));
  line.userData = { shared: true };
  mesh.add(line);
  return mesh;
}

/**
 * Adds inverted-hull cartoon silhouette contour to organic/curved geometries (balloons, heads, spikes).
 */
export function addHullOutline(mesh, scale = 1.06, color = OCCULT_INK_HEX) {
  if (!mesh || !mesh.geometry) return mesh;
  const outlineMesh = new THREE.Mesh(mesh.geometry, getHullMaterial(color, 0.85));
  outlineMesh.scale.set(scale, scale, scale);
  outlineMesh.userData = { shared: true };
  mesh.add(outlineMesh);
  return outlineMesh;
}

/**
 * Convenience helper to create a Box Mesh with automatic cartoon edge outline.
 */
export function createCartoonBox(geometry, material, withOutline = true) {
  const mesh = new THREE.Mesh(geometry, material);
  if (withOutline) {
    addBoxOutline(mesh);
  }
  return mesh;
}
