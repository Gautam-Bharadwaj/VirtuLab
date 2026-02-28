import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useLabStore } from '../../store/useLabStore';

// ─── Animated Drops ──────────────────────────────────────────────────

const NUM_DROPS = 2;

const LiquidDrops: React.FC<{ active: boolean }> = ({ active }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const dropState = useRef(
    Array.from({ length: NUM_DROPS }, (_, i) => ({
      y: 1.5 - i * 0.8, // stagger start positions
      speed: 3 + Math.random(),
    }))
  );

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    for (let i = 0; i < NUM_DROPS; i++) {
      const drop = dropState.current[i];

      if (active) {
        drop.y -= drop.speed * delta;
        // Reset when drop reaches liquid surface
        if (drop.y < 0) {
          drop.y = 1.5;
          drop.speed = 3 + Math.random();
        }
      }

      dummy.position.set(0, drop.y, 0);
      dummy.scale.setScalar(active ? 1 : 0);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, NUM_DROPS]}>
      <sphereGeometry args={[0.06, 12, 12]} />
      <meshStandardMaterial color="#87ceeb" emissive="#87ceeb" emissiveIntensity={0.5} transparent opacity={0.8} />
    </instancedMesh>
  );
};

// ─── Burst Particles (OVERSHOOT) ─────────────────────────────────────

const NUM_PARTICLES = 20;

const BurstParticles: React.FC = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(
    () =>
      Array.from({ length: NUM_PARTICLES }, () => ({
        pos: new THREE.Vector3(0, 1, 0),
        vel: new THREE.Vector3(
          (Math.random() - 0.5) * 6,
          Math.random() * 5 + 2,
          (Math.random() - 0.5) * 6
        ),
        life: 0,
      })),
    []
  );

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    for (let i = 0; i < NUM_PARTICLES; i++) {
      const p = particles[i];
      p.life += delta;
      p.vel.y -= 9.8 * delta; // gravity
      p.pos.addScaledVector(p.vel, delta);

      // Reset particle when it falls below
      if (p.pos.y < -3) {
        p.pos.set(0, 1, 0);
        p.vel.set(
          (Math.random() - 0.5) * 6,
          Math.random() * 5 + 2,
          (Math.random() - 0.5) * 6
        );
        p.life = 0;
      }

      const fade = Math.max(0, 1 - p.life * 0.5);
      dummy.position.copy(p.pos);
      dummy.scale.setScalar(fade * 0.8);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, NUM_PARTICLES]}>
