import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cylinder, MeshDistortMaterial } from '@react-three/drei';

export const Beaker3D = () => {
    const liquidRef = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (liquidRef.current) {
            liquidRef.current.distort = 0.2 + Math.sin(t) * 0.1;
        }
    });

    return (
        <group>
            {/* Beaker Glass */}
            <Cylinder args={[1, 1, 2.5, 32]} castShadow>
                <meshPhysicalMaterial
                    transparent
                    opacity={0.3}
                    roughness={0}
                    transmission={1}
                    thickness={0.5}
                />
            </Cylinder>

            {/* Liquid */}
            <Cylinder args={[0.95, 0.95, 1.5, 32]} position={[0, -0.4, 0]}>
                <MeshDistortMaterial
                    ref={liquidRef}
                    color="#3b82f6"
                    speed={2}
                    distort={0.3}
                    radius={1}
                />
            </Cylinder>
        </group>
    );
};
