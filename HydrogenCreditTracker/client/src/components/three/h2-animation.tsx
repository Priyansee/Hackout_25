import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text3D, Center } from "@react-three/drei";
import { Mesh } from "three";

export function H2Animation() {
  const h2Ref = useRef<Mesh>(null);
  const subscriptRef = useRef<Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (h2Ref.current) {
      h2Ref.current.rotation.y = Math.sin(time * 0.5) * 0.2;
      h2Ref.current.position.y = Math.sin(time * 0.8) * 0.1;
    }
    
    if (subscriptRef.current) {
      subscriptRef.current.rotation.y = Math.sin(time * 0.5) * 0.2;
      subscriptRef.current.position.y = Math.sin(time * 0.8) * 0.1 - 0.3;
    }
  });

  return (
    <Center>
      <group>
        {/* Main H */}
        <Text3D
          ref={h2Ref}
          font="/fonts/inter_bold.json"
          size={2}
          height={0.2}
          position={[-1, 0, 0]}
        >
          H
          <meshStandardMaterial
            color="#00BFFF"
            emissive="#00BFFF"
            emissiveIntensity={0.3}
          />
        </Text3D>
        
        {/* Subscript 2 */}
        <Text3D
          ref={subscriptRef}
          font="/fonts/inter_bold.json"
          size={1.2}
          height={0.15}
          position={[0.5, -0.3, 0]}
        >
          2
          <meshStandardMaterial
            color="#32CD32"
            emissive="#32CD32"
            emissiveIntensity={0.2}
          />
        </Text3D>
        
        {/* Glowing particles around the letters */}
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              array={new Float32Array(
                Array.from({ length: 100 }, () => [
                  (Math.random() - 0.5) * 8,
                  (Math.random() - 0.5) * 6,
                  (Math.random() - 0.5) * 4,
                ]).flat()
              )}
              count={100}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.02}
            color="#00BFFF"
            transparent
            opacity={0.6}
          />
        </points>
      </group>
    </Center>
  );
}
