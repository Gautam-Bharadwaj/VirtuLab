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
