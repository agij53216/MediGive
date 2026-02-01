import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, Sparkles, ContactShadows } from '@react-three/drei';

function Pill(props) {
    const meshRef = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        meshRef.current.rotation.x = Math.cos(t / 4) / 2;
        meshRef.current.rotation.y = Math.sin(t / 4) / 2;
        meshRef.current.position.y = (1 + Math.sin(t / 1.5)) / 10;
    });

    return (
        <group ref={meshRef} {...props} dispose={null}>
            {/* Top Half - White */}
            <group position={[0, 0.5, 0]}>
                <mesh position={[0, 0.5, 0]}>
                    <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
                    <meshStandardMaterial color="#f8fafc" roughness={0.1} metalness={0.1} />
                </mesh>
                <mesh position={[0, 0, 0]}>
                    <cylinderGeometry args={[1, 1, 1, 32]} />
                    <meshStandardMaterial color="#f8fafc" roughness={0.1} metalness={0.1} />
                </mesh>
            </group>

            {/* Bottom Half - Teal */}
            <group position={[0, -0.5, 0]}>
                <mesh position={[0, 0, 0]}>
                    <cylinderGeometry args={[1, 1, 1, 32]} />
                    <meshStandardMaterial color="#14b8a6" roughness={0.1} metalness={0.1} />
                </mesh>
                <mesh position={[0, -0.5, 0]} rotation={[Math.PI, 0, 0]}>
                    <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
                    <meshStandardMaterial color="#14b8a6" roughness={0.1} metalness={0.1} />
                </mesh>
            </group>
        </group>
    );
}

export default function MedicalScene() {
    return (
        <div className="w-full h-full absolute inset-0 pointer-events-none z-0">
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={1} />

                <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5} floatingRange={[0, 0.5]}>
                    <Pill position={[0, 0, 0]} rotation={[0.4, 0.2, 0.4]} scale={1.2} />
                </Float>

                <Sparkles count={50} scale={6} size={4} speed={0.4} opacity={0.5} color="#14b8a6" />
                <Environment preset="city" />
            </Canvas>
        </div>
    );
}
