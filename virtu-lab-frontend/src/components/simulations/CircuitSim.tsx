import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useLabStore } from '../../store/useLabStore';

// ─── Wire Path (rectangular loop) ────────────────────────────────────
// Battery (-3,0) → top-left (-3,1.5) → Resistor (0,1.5) → top-right (3,1.5) → LED (3,0) → bottom-right (3,-1.5) → bottom-left (-3,-1.5) → Battery (-3,0)

const WIRE_POINTS = [
  new THREE.Vector3(-3, 0, 0),
  new THREE.Vector3(-3, 1.5, 0),
  new THREE.Vector3(0, 1.5, 0),
  new THREE.Vector3(3, 1.5, 0),
  new THREE.Vector3(3, 0, 0),
  new THREE.Vector3(3, -1.5, 0),
  new THREE.Vector3(-3, -1.5, 0),
  new THREE.Vector3(-3, 0, 0),
];

function getPathLength(points: THREE.Vector3[]): number {
  let len = 0;
  for (let i = 1; i < points.length; i++) {
    len += points[i].distanceTo(points[i - 1]);
  }
  return len;
}

function getPointOnPath(points: THREE.Vector3[], t: number): THREE.Vector3 {
  const totalLen = getPathLength(points);
  let target = ((t % 1) + 1) % 1; // normalize to 0–1
  let walked = 0;

  for (let i = 1; i < points.length; i++) {
    const segLen = points[i].distanceTo(points[i - 1]);
    const segFrac = segLen / totalLen;

    if (walked + segFrac >= target) {
      const localT = (target - walked) / segFrac;
      return new THREE.Vector3().lerpVectors(points[i - 1], points[i], localT);
    }
    walked += segFrac;
  }
  return points[points.length - 1].clone();
}

// ─── Wire Mesh ───────────────────────────────────────────────────────

const WirePath: React.FC = () => {
  const curve = useMemo(() => {
