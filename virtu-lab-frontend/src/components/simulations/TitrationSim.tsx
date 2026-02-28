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
      <sphereGeometry args={[0.1, 8, 8]} />
      <meshStandardMaterial color="#ff00aa" emissive="#ff00aa" emissiveIntensity={2} />
    </instancedMesh>
  );
};

// ─── Main Component ──────────────────────────────────────────────────

const TitrationSim: React.FC = () => {
  const pH = useLabStore((s) => s.titration.outputs.pH);
  const colorHex = useLabStore((s) => s.titration.outputs.colorHex);
  const baseVolume = useLabStore((s) => s.titration.inputs.baseVolume);
  const failureState = useLabStore((s) => s.failureState);
  const isRunning = useLabStore((s) => s.isRunning);

  const isOvershoot = failureState === 'OVERSHOOT';
  const liquidHeight = Math.max(0.05, (baseVolume / 50) * 2.0);

  // Smooth color lerp
  const liquidMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const targetColor = useMemo(() => new THREE.Color(), []);
  const beakerGroupRef = useRef<THREE.Group>(null);

  const prevVolumeRef = useRef(baseVolume);

  useFrame((state) => {
    // Smooth liquid color transition
    if (liquidMatRef.current) {
      targetColor.set(isOvershoot ? '#cc0066' : colorHex);
      liquidMatRef.current.color.lerp(targetColor, 0.08);
    }

    // Beaker shake on OVERSHOOT
    if (beakerGroupRef.current) {
      if (isOvershoot) {
        beakerGroupRef.current.position.x = Math.sin(state.clock.elapsedTime * 30) * 0.12;
        beakerGroupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 25) * 0.03;
      } else {
        beakerGroupRef.current.position.x = 0;
        beakerGroupRef.current.rotation.z = 0;
      }
    }

    prevVolumeRef.current = baseVolume;
  });

  const isDropping = isRunning && baseVolume < 50 && !isOvershoot;

  return (
    <group>
      {/* Burette */}
      <group position={[0, 3, 0]}>
        <mesh>
          <cylinderGeometry args={[0.1, 0.1, 3, 16]} />
          <meshStandardMaterial color="#cccccc" transparent opacity={0.3} roughness={0.1} metalness={0.2} />
        </mesh>
        {/* Tap knob */}
        <mesh position={[0.2, -1.2, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.06, 0.06, 0.3, 8]} />
          <meshStandardMaterial color="#444444" metalness={0.8} />
        </mesh>
      </group>

      {/* Drops */}
      <LiquidDrops active={isDropping} />

      {/* Beaker Group (shakes on OVERSHOOT) */}
      <group ref={beakerGroupRef}>
        {/* Glass beaker */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[1.2, 1.0, 2.5, 32, 1, true]} />
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.15}
            side={THREE.DoubleSide}
            roughness={0.05}
            metalness={0.1}
          />
        </mesh>
        {/* Beaker bottom */}
        <mesh position={[0, -1.25, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.0, 32]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.1} side={THREE.DoubleSide} />
        </mesh>

        {/* Liquid */}
        <mesh position={[0, -1.25 + liquidHeight / 2, 0]}>
          <cylinderGeometry args={[1.0, 0.9, liquidHeight, 32]} />
          <meshStandardMaterial
            ref={liquidMatRef}
            color={colorHex}
            roughness={0.3}
            transparent
            opacity={0.85}
          />
        </mesh>
      </group>

      {/* pH floating text */}
      <Text
        position={[2.2, 1.8, 0]}
        fontSize={0.5}
        color="#ffffff"
        anchorX="left"
        anchorY="middle"
        font={undefined}
      >
        {`pH ${pH.toFixed(2)}`}
      </Text>

      {/* pH indicator color swatch */}
      <mesh position={[2.2, 1.2, 0]}>
        <boxGeometry args={[0.6, 0.3, 0.05]} />
        <meshBasicMaterial color={isOvershoot ? '#cc0066' : colorHex} />
      </mesh>

      {/* Overshoot burst particles */}
      {isOvershoot && <BurstParticles />}
    </group>
  );
};

export default TitrationSim;
