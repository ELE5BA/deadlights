import * as THREE from 'three';

// Shared cartoon black outline material for high performance
const blackLineMaterial = new THREE.LineBasicMaterial({
  color: 0x000000,
  linewidth: 2,
  depthTest: true,
});

const blackHullMaterial = new THREE.MeshBasicMaterial({
  color: 0x000000,
  side: THREE.BackSide,
});

/**
 * Adds crisp comic-book black edge lines to boxy/voxel geometries.
 */
export function addBoxOutline(mesh, color = 0x000000) {
  if (!mesh || !mesh.geometry) return mesh;
  const edges = new THREE.EdgesGeometry(mesh.geometry);
  const line = new THREE.LineSegments(
    edges,
    color === 0x000000 ? blackLineMaterial : new THREE.LineBasicMaterial({ color, linewidth: 2 })
  );
  mesh.add(line);
  return mesh;
}

/**
 * Adds inverted-hull cartoon silhouette contour to organic/curved geometries (balloons, heads, spikes).
 */
export function addHullOutline(mesh, scale = 1.06, color = 0x000000) {
  if (!mesh || !mesh.geometry) return mesh;
  const outlineMat = color === 0x000000 ? blackHullMaterial : new THREE.MeshBasicMaterial({ color, side: THREE.BackSide });
  const outlineMesh = new THREE.Mesh(mesh.geometry, outlineMat);
  outlineMesh.scale.set(scale, scale, scale);
  mesh.add(outlineMesh);
  return outlineMesh;
}

/**
 * Convenience helper to create a Box Mesh with automatic cartoon black edge outline.
 */
export function createCartoonBox(geometry, material, withOutline = true) {
  const mesh = new THREE.Mesh(geometry, material);
  if (withOutline) {
    addBoxOutline(mesh);
  }
  return mesh;
}
