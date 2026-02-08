import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

// Animated wireframe sphere component
function WireframeSphere() {
    const meshRef = useRef<THREE.Mesh>(null);
    const timeRef = useRef(0);

    useFrame((_, delta) => {
        if (meshRef.current) {
            // Rotate the sphere
            meshRef.current.rotation.x += delta * 0.3;
            meshRef.current.rotation.y += delta * 0.2;
            
            // Subtle scale pulsing
            timeRef.current += delta;
            const scale = 1 + Math.sin(timeRef.current * 2) * 0.05;
            meshRef.current.scale.setScalar(scale);
        }
    });

    return (
        <mesh ref={meshRef}>
            <sphereGeometry args={[2, 32, 32]} />
            <meshBasicMaterial
                color="#EC4899"
                wireframe
                transparent
                opacity={0.8}
            />
        </mesh>
    );
}

// Gradient background plane
function GradientPlane() {
    return (
        <mesh position={[0, 0, -5]}>
            <planeGeometry args={[50, 50]} />
            <meshBasicMaterial color="#831843" transparent opacity={0.3} />
        </mesh>
    );
}

interface GenerationAnimationProps {
    isVisible: boolean;
}

export const GenerationAnimation: React.FC<GenerationAnimationProps> = ({ isVisible }) => {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center"
                    style={{
                        background: 'linear-gradient(135deg, #020617 0%, #1a0b1f 50%, #020617 100%)',
                    }}
                >
                    {/* 3D Canvas */}
                    <div className="w-full h-full absolute inset-0">
                        <Canvas
                            camera={{ position: [0, 0, 8], fov: 50 }}
                            gl={{ alpha: true, antialias: true }}
                        >
                            <ambientLight intensity={0.5} />
                            <pointLight position={[10, 10, 10]} intensity={1} color="#EC4899" />
                            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#D946EF" />
                            <GradientPlane />
                            <WireframeSphere />
                        </Canvas>
                    </div>

                    {/* Text overlay */}
                    <div className="relative z-10 text-center px-8">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h2 className="text-3xl font-bold text-white mb-4">
                                Generating Your Slides
                            </h2>
                            <p className="text-slate-300 text-lg">
                                Stratify is crafting your presentation...
                            </p>
                        </motion.div>

                        {/* Animated dots */}
                        <motion.div 
                            className="flex gap-2 justify-center mt-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-magenta"
                                    animate={{
                                        scale: [1, 1.3, 1],
                                        opacity: [0.5, 1, 0.5],
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        delay: i * 0.2,
                                    }}
                                />
                            ))}
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
