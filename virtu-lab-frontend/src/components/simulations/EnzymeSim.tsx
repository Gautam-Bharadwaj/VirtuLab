import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useLabStore } from '../../store/useLabStore';

// ─── Orbiting Substrates ─────────────────────────────────────────────

const NUM_SUBSTRATES = 6;

const Substrates: React.FC<{ speed: number; frozen: boolean }> = ({ speed, frozen }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;

    for (let i = 0; i < NUM_SUBSTRATES; i++) {
      const baseAngle = (i / NUM_SUBSTRATES) * Math.PI * 2;
      const radius = 2.2 + Math.sin(i * 1.5) * 0.3;
      const elapsed = frozen ? 0 : state.clock.elapsedTime * speed;
      const angle = baseAngle + elapsed;

      // Orbit in slightly tilted planes for visual interest
      const tilt = (i % 3) * 0.3;
      dummy.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius * Math.cos(tilt),
        Math.sin(angle) * radius * Math.sin(tilt) + Math.sin(i) * 0.4
      );
      dummy.rotation.set(
        state.clock.elapsedTime * 2 + i,
        state.clock.elapsedTime * 1.5 + i,
        0
      );
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, NUM_SUBSTRATES]}>
      <octahedronGeometry args={[0.2]} />
      <meshStandardMaterial color={frozen ? '#666666' : '#4ade80'} emissive={frozen ? '#333' : '#22c55e'} emissiveIntensity={frozen ? 0.2 : 0.6} />
    </instancedMesh>
  );
};

