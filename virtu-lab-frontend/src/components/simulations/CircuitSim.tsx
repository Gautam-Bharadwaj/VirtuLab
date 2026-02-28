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
    return new THREE.CatmullRomCurve3(WIRE_POINTS, false, 'catmullrom', 0);
  }, []);

  const tubeGeom = useMemo(() => {
    return new THREE.TubeGeometry(curve, 128, 0.04, 8, false);
  }, [curve]);

  return (
    <mesh geometry={tubeGeom}>
      <meshStandardMaterial color="#555555" metalness={0.6} roughness={0.4} />
    </mesh>
  );
};

// ─── Electron Dots ───────────────────────────────────────────────────

const NUM_ELECTRONS = 8;

const ElectronDots: React.FC<{ speed: number }> = ({ speed }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const offsets = useMemo(
    () => Array.from({ length: NUM_ELECTRONS }, (_, i) => i / NUM_ELECTRONS),
    []
  );
  const progressRef = useRef(0);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    progressRef.current += delta * speed;

    for (let i = 0; i < NUM_ELECTRONS; i++) {
      const t = progressRef.current + offsets[i];
      const pos = getPointOnPath(WIRE_POINTS, t);
      dummy.position.copy(pos);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, NUM_ELECTRONS]}>
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshStandardMaterial color="#4ade80" emissive="#4ade80" emissiveIntensity={2} />
    </instancedMesh>
  );
};

// ─── Battery ─────────────────────────────────────────────────────────

const Battery: React.FC = () => (
  <group position={[-3, 0, 0]}>
    <mesh>
      <boxGeometry args={[0.8, 1.5, 0.8]} />
      <meshStandardMaterial color="#333333" metalness={0.8} roughness={0.3} />
    </mesh>
    {/* Positive terminal */}
    <mesh position={[0, 0.8, 0]}>
      <cylinderGeometry args={[0.15, 0.15, 0.12, 16]} />
      <meshStandardMaterial color="#aaaaaa" metalness={0.9} roughness={0.2} />
    </mesh>
    <Text position={[0, 1.1, 0]} fontSize={0.35} color="#ffffff" anchorX="center" anchorY="middle">
      +
    </Text>
  </group>
);

// ─── Resistor ────────────────────────────────────────────────────────

const BAND_COLORS = ['#ef4444', '#22c55e', '#000000'];

const Resistor: React.FC = () => (
  <group position={[0, 1.5, 0]} rotation={[0, 0, Math.PI / 2]}>
    {/* Body */}
    <mesh>
      <boxGeometry args={[1.2, 0.4, 0.4]} />
      <meshStandardMaterial color="#a0845c" roughness={0.7} />
    </mesh>
    {/* Color bands */}
    {BAND_COLORS.map((c, i) => (
      <mesh key={i} position={[-0.35 + i * 0.3, 0, 0]}>
        <boxGeometry args={[0.08, 0.42, 0.42]} />
        <meshBasicMaterial color={c} />
      </mesh>
    ))}
  </group>
);

// ─── LED Bulb ────────────────────────────────────────────────────────

const LEDBulb: React.FC<{
  brightness: number;
  isOverload: boolean;
}> = ({ brightness, isOverload }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (!meshRef.current) return;

    if (isOverload) {
      // Pulse scale
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 12) * 0.15;
      meshRef.current.scale.setScalar(pulse);
    } else {
      meshRef.current.scale.setScalar(1);
    }
  });

  const emissiveColor = isOverload ? '#FF0000' : '#FFD700';
  const emissiveIntensity = isOverload ? 4 : (brightness / 100) * 3;

  return (
    <group position={[3, 0, 0]}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial
          color={isOverload ? '#ff4444' : '#ffffcc'}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
          transparent
          opacity={0.9}
        />
      </mesh>
      {/* Glow light */}
      <pointLight
        ref={lightRef}
        color={isOverload ? '#ff0000' : '#FFD700'}
        intensity={isOverload ? 8 : (brightness / 100) * 5}
        distance={6}
      />
    </group>
  );
};

// ─── Main Component ──────────────────────────────────────────────────

const CircuitSim: React.FC = () => {
  const current = useLabStore((s) => s.circuit.outputs.current);
  const brightnessPercent = useLabStore((s) => s.circuit.outputs.brightnessPercent);
  const failureState = useLabStore((s) => s.failureState);

  const isOverload = failureState === 'OVERLOAD';
  const electronSpeed = current * 200;

  return (
    <group>
      <Battery />
      <Resistor />
      <LEDBulb brightness={brightnessPercent} isOverload={isOverload} />
      <WirePath />
      {electronSpeed > 0 && <ElectronDots speed={electronSpeed} />}
    </group>
  );
};

export default CircuitSim;
