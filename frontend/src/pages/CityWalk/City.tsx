import { Suspense, useMemo } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { buildings, lights, ALL_MODELS, CITY_HALF, type PlacedBuilding } from './cityGen'

ALL_MODELS.forEach(path => useGLTF.preload(encodeURI(path)))

function BuildingMesh({ glb, x, z, rotY, scale }: PlacedBuilding) {
  const { scene } = useGLTF(encodeURI(glb))
  const clone = useMemo(() => {
    const c = scene.clone(true)
    c.traverse(child => {
      const mesh = child as THREE.Mesh
      if (mesh.isMesh) {
        mesh.castShadow    = true
        mesh.receiveShadow = true
        const mat = mesh.material as THREE.MeshStandardMaterial
        if (mat?.isMeshStandardMaterial) mat.envMapIntensity = 0.8
      }
    })
    return c
  }, [scene])
  return <primitive object={clone} position={[x, 0, z]} rotation={[0, rotY, 0]} scale={scale} />
}

function BuildingSlot(props: PlacedBuilding) {
  return (
    <Suspense fallback={null}>
      <BuildingMesh {...props} />
    </Suspense>
  )
}

function Streetlight({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.06, 0.09, 5, 6]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0.7, 5.0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, 1.4, 5]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[1.35, 4.92, 0]}>
        <boxGeometry args={[0.28, 0.12, 0.2]} />
        <meshStandardMaterial color="#fff" emissive="#fffbe0" emissiveIntensity={4} toneMapped={false} />
      </mesh>
      <pointLight position={[1.35, 4.5, 0]} color="#fff5cc" intensity={14} distance={16} decay={2} />
    </group>
  )
}

function Stars() {
  const geo = useMemo(() => {
    const pos: number[] = []
    for (let i = 0; i < 1400; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi   = Math.acos(2 * Math.random() - 1)
      const r     = 200 + Math.random() * 60
      pos.push(
        r * Math.sin(phi) * Math.cos(theta),
        Math.abs(r * Math.cos(phi)) + 20,
        r * Math.sin(phi) * Math.sin(theta)
      )
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    return g
  }, [])
  return (
    <points geometry={geo}>
      <pointsMaterial color="#cce0ff" size={0.35} sizeAttenuation transparent opacity={0.85} />
    </points>
  )
}

function Ground() {
  const SIZE = CITY_HALF * 2 + 20
  const roadTex = useMemo(() => {
    const c   = document.createElement('canvas')
    c.width   = 512; c.height = 512
    const ctx = c.getContext('2d')!
    ctx.fillStyle = '#101010'
    ctx.fillRect(0, 0, 512, 512)
    ctx.strokeStyle = '#1e1e1e'
    ctx.lineWidth   = 1
    for (let i = 0; i < 512; i += 40) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 512); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(512, i); ctx.stroke()
    }
    const t = new THREE.CanvasTexture(c)
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.repeat.set(SIZE / 5, SIZE / 5)
    return t
  }, [SIZE])
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.01, 0]}>
      <planeGeometry args={[SIZE, SIZE]} />
      <meshStandardMaterial map={roadTex} color="#181818" roughness={0.95} metalness={0.05} />
    </mesh>
  )
}

export default function City() {
  return (
    <group>
      <Ground />
      <Stars />
      {buildings.map(b => <BuildingSlot key={b.id} {...b} />)}
      {lights.map((l, i) => <Streetlight key={i} x={l.x} z={l.z} />)}
    </group>
  )
}
