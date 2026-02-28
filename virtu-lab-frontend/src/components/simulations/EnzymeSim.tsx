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

// ─── Product Emission ────────────────────────────────────────────────

const NUM_PRODUCTS = 10;

const Products: React.FC<{ rate: number }> = ({ rate }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(
    () =>
      Array.from({ length: NUM_PRODUCTS }, () => ({
        pos: new THREE.Vector3(0, 0, 0),
        vel: new THREE.Vector3(),
        life: 0,
        active: false,
      })),
    []
  );

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // Spawn based on rate
    if (rate > 0 && Math.random() < rate * delta * 0.5) {
      const idle = particles.find((p) => !p.active);
      if (idle) {
        idle.active = true;
        idle.life = 0;
        idle.pos.set(0, 0, 0);
        idle.vel.set(
          (Math.random() - 0.5) * 3,
          (Math.random() - 0.5) * 3,
          (Math.random() - 0.5) * 3
        );
      }
    }

    for (let i = 0; i < NUM_PRODUCTS; i++) {
      const p = particles[i];
      if (p.active) {
        p.life += delta;
        p.pos.addScaledVector(p.vel, delta);
        const fade = Math.max(0, 1 - p.life * 0.4);
        dummy.position.copy(p.pos);
        dummy.scale.setScalar(fade * 0.6);

        if (p.life > 2.5 || p.pos.length() > 5) {
          p.active = false;
        }
      } else {
        dummy.scale.setScalar(0);
      }
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, NUM_PRODUCTS]}>
      <octahedronGeometry args={[0.15]} />
      <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={0.8} />
    </instancedMesh>
  );
};

// ─── Denaturation Fragments ──────────────────────────────────────────

const NUM_FRAGMENTS = 5;

const DenatureFragments: React.FC = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const fragmentData = useMemo(
    () =>
      Array.from({ length: NUM_FRAGMENTS }, (_, i) => ({
        offset: new THREE.Vector3(
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2
        ),
        rotSpeed: Math.random() * 2 + 0.5,
        driftY: 0.02 + Math.random() * 0.02,
        driftX: (Math.random() - 0.5) * 0.01,
        baseScale: 0.3 + Math.random() * 0.3,
        idx: i,
      })),
    []
  );

  useFrame((state) => {
    if (!meshRef.current) return;

    for (let i = 0; i < NUM_FRAGMENTS; i++) {
      const f = fragmentData[i];
      const t = state.clock.elapsedTime;

      dummy.position.set(
        f.offset.x + Math.sin(t * 0.5 + f.idx) * 0.3 + t * f.driftX * 5,
        f.offset.y + t * f.driftY * 3,
        f.offset.z + Math.cos(t * 0.3 + f.idx) * 0.2
      );
      dummy.rotation.set(t * f.rotSpeed, t * f.rotSpeed * 0.7, 0);
      dummy.scale.setScalar(f.baseScale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, NUM_FRAGMENTS]}>
      <icosahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial color="#555555" roughness={0.8} />
    </instancedMesh>
  );
};

// ─── Thermometer ─────────────────────────────────────────────────────

const Thermometer: React.FC<{ temperature: number }> = ({ temperature }) => {
  const fillRef = useRef<THREE.MeshStandardMaterial>(null);
  const targetColor = useMemo(() => new THREE.Color(), []);
  const cold = useMemo(() => new THREE.Color('#3b82f6'), []);
  const hot = useMemo(() => new THREE.Color('#ef4444'), []);

  const fillHeight = Math.max(0.05, (temperature / 100) * 3);
  const t = Math.min(Math.max(temperature / 100, 0), 1);

  useFrame(() => {
    if (fillRef.current) {
      targetColor.copy(cold).lerp(hot, t);
      fillRef.current.color.lerp(targetColor, 0.1);
    }
  });

  return (
    <group position={[4, -1.5, 0]}>
      {/* Background bar */}
      <mesh position={[0, 1.6, -0.05]}>
        <boxGeometry args={[0.35, 3.4, 0.1]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
      {/* Fill bar */}
      <mesh position={[0, fillHeight / 2, 0]}>
        <boxGeometry args={[0.25, fillHeight, 0.15]} />
        <meshStandardMaterial ref={fillRef} color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.3} />
      </mesh>
      {/* Bulb at bottom */}
      <mesh position={[0, -0.15, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.4} />
      </mesh>
    </group>
  );
};

// ─── Main Component ──────────────────────────────────────────────────

const EnzymeSim: React.FC = () => {
  const reactionRate = useLabStore((s) => s.enzyme.outputs.reactionRate);
  const normalizedRate = useLabStore((s) => s.enzyme.outputs.normalizedRate);
  const temperature = useLabStore((s) => s.enzyme.inputs.temperature);
  const failureState = useLabStore((s) => s.failureState);
  const isRunning = useLabStore((s) => s.isRunning);

  const isDenatured = failureState === 'DENATURED';
  const enzymeRef = useRef<THREE.Mesh>(null);

  useFrame((_state, delta) => {
    if (!enzymeRef.current) return;

    if (isDenatured) {
      // Slowly shrink away
      enzymeRef.current.scale.lerp(new THREE.Vector3(0.01, 0.01, 0.01), 0.02);
    } else {
      enzymeRef.current.scale.set(1, 1, 1);
      if (isRunning) {
        enzymeRef.current.rotation.x += delta * 0.4 * normalizedRate;
        enzymeRef.current.rotation.y += delta * 0.6 * normalizedRate;
      }
    }
  });

  return (
    <group>
      {/* Central Enzyme */}
      {!isDenatured && (
        <mesh ref={enzymeRef}>
          <icosahedronGeometry args={[1.0, 1]} />
          <meshStandardMaterial
            color="#7c3aed"
            emissive="#7c3aed"
            emissiveIntensity={0.3}
            roughness={0.4}
            metalness={0.1}
          />
        </mesh>
      )}

      {/* Denaturation Fragments */}
      {isDenatured && <DenatureFragments />}

      {/* Substrates */}
      <Substrates speed={normalizedRate * 2} frozen={isDenatured} />

      {/* Products */}
      {!isDenatured && isRunning && <Products rate={reactionRate} />}

      {/* Thermometer */}
      <Thermometer temperature={temperature} />
    </group>
  );
};

export default EnzymeSim;
