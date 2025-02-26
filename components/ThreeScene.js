import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Center } from '@react-three/drei';

// 3D rotating cube component
const AnimatedCube = ({ position, size, color }) => {
  const mesh = useRef();
  
  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.x += 0.01;
      mesh.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh position={position} ref={mesh}>
      <boxGeometry args={[size, size, size]} />
      <meshStandardMaterial color={color} metalness={0.5} roughness={0.1} />
    </mesh>
  );
};

// 3D Scene
const ThreeScene = () => {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      
      <AnimatedCube position={[-2, 0, 0]} size={1} color="#4287f5" />
      <AnimatedCube position={[2, 0, 0]} size={1} color="#2563eb" />
      
      <Center>
        <Text
          color="#1e40af"
          fontSize={1.5}
          position={[0, 0, 0]}
          font="/fonts/Inter-Bold.woff"
          anchorX="center"
          anchorY="middle"
        >
          PDFolio
        </Text>
      </Center>
      
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} />
    </Canvas>
  );
};

export default ThreeScene;