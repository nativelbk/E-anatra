import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sparkles, Billboard, Text } from '@react-three/drei'
import * as THREE from 'three'

export const INTERACT_DIST = 5

function RuneCircle() {
  const ringRef = useRef<THREE.Mesh>(null!)
  useFrame((s) => {
    if (ringRef.current) ringRef.current.rotation.y = s.clock.elapsedTime * 0.4
  })
  return (
    <group position={[0, 0.02, 0]}>
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.6, 1.9, 64]} />
        <meshStandardMaterial
          color="#6600cc" emissive="#4400aa" emissiveIntensity={1.5}
          transparent opacity={0.7} toneMapped={false} side={THREE.DoubleSide}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.4, 64]} />
        <meshStandardMaterial
          color="#1a0033" emissive="#2a0055" emissiveIntensity={0.6}
          transparent opacity={0.5} side={THREE.DoubleSide} depthWrite={false}
        />
      </mesh>
    </group>
  )
}

function MageBody() {
  const groupRef = useRef<THREE.Group>(null!)
  const orbRef   = useRef<THREE.Mesh>(null!)
  const ringRef  = useRef<THREE.Mesh>(null!)

  useFrame((s) => {
    const t = s.clock.elapsedTime
    if (groupRef.current) groupRef.current.position.y = 0.25 + Math.sin(t * 0.9) * 0.12
    if (orbRef.current) {
      const mat = orbRef.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = 2.5 + Math.sin(t * 2.4) * 0.8
    }
    if (ringRef.current) ringRef.current.rotation.z = t * 1.2
  })

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0.9, 0]}>
        <coneGeometry args={[0.55, 1.8, 8]} />
        <meshStandardMaterial color="#1a0035" emissive="#0a0020" roughness={0.85} metalness={0.1} />
      </mesh>
      <mesh position={[0, 1.75, 0]}>
        <cylinderGeometry args={[0.26, 0.36, 0.65, 8]} />
        <meshStandardMaterial color="#220044" emissive="#110022" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.5, -0.15]} rotation={[0.25, 0, 0]}>
        <coneGeometry args={[0.42, 1.4, 6]} />
        <meshStandardMaterial color="#160028" roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 2.22, 0]}>
        <sphereGeometry args={[0.21, 16, 16]} />
        <meshStandardMaterial color="#c8a87a" roughness={0.65} />
      </mesh>
      <mesh position={[0, 2.0, 0.1]}>
        <coneGeometry args={[0.1, 0.4, 6]} />
        <meshStandardMaterial color="#aaaaaa" roughness={0.9} />
      </mesh>
      <mesh position={[0, 2.85, 0]}>
        <coneGeometry args={[0.24, 0.72, 8]} />
        <meshStandardMaterial color="#1a0033" emissive="#0a0018" roughness={0.8} />
      </mesh>
      <mesh position={[0, 2.38, 0]}>
        <cylinderGeometry args={[0.36, 0.36, 0.06, 16]} />
        <meshStandardMaterial color="#1a0033" roughness={0.8} />
      </mesh>
      <mesh position={[0, 3.24, 0]}>
        <octahedronGeometry args={[0.07, 0]} />
        <meshStandardMaterial color="#ffcc00" emissive="#ffaa00" emissiveIntensity={2} toneMapped={false} />
      </mesh>
      {([-0.08, 0.08] as const).map((x, i) => (
        <mesh key={i} position={[x, 2.25, 0.18]}>
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshStandardMaterial color="#00ffcc" emissive="#00ffcc" emissiveIntensity={4} toneMapped={false} />
        </mesh>
      ))}
      <group position={[0.52, 1.4, 0.1]}>
        <mesh position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.025, 0.03, 1.6, 6]} />
          <meshStandardMaterial color="#5a3500" roughness={0.8} metalness={0.3} />
        </mesh>
        <mesh ref={orbRef} position={[0, 1.45, 0]}>
          <sphereGeometry args={[0.14, 20, 20]} />
          <meshStandardMaterial
            color="#cc00ff" emissive="#aa00ee" emissiveIntensity={2.5}
            transparent opacity={0.85} toneMapped={false}
          />
        </mesh>
        <pointLight position={[0, 1.45, 0]} color="#cc00ff" intensity={5} distance={7} />
        <mesh ref={ringRef} position={[0, 1.45, 0]}>
          <torusGeometry args={[0.22, 0.02, 8, 32]} />
          <meshStandardMaterial color="#cc00ff" emissive="#aa00ee" emissiveIntensity={2} toneMapped={false} />
        </mesh>
      </group>
      <pointLight position={[0, 1.5, 0]} color="#7700bb" intensity={3.5} distance={5} />
    </group>
  )
}

interface Props {
  nearPlayer: boolean
  magePos: THREE.Vector3
}

export default function Mage({ nearPlayer, magePos }: Props) {
  return (
    <group position={magePos}>
      <RuneCircle />
      <MageBody />
      <Sparkles count={40} scale={[3, 4, 3]} size={1.4} speed={0.3} opacity={0.7} color="#cc44ff" />
      <Sparkles count={20} scale={[2, 2, 2]} size={0.7} speed={0.15} opacity={0.5} color="#00ffcc" />
      {nearPlayer && (
        <Billboard position={[0, 4.2, 0]}>
          <Text
            fontSize={0.32} color="#00ffcc" outlineColor="#003322" outlineWidth={0.02}
            font={undefined} anchorX="center" anchorY="middle"
          >
            [ E ]  Parler à E-Tsiry
          </Text>
        </Billboard>
      )}
    </group>
  )
}
