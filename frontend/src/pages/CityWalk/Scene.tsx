import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Sparkles } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import City from './City'
import Player from './Player'
import Mage, { INTERACT_DIST } from './Mage'

interface Props {
  cameraYaw:      { current: number }
  playerPos:      { current: THREE.Vector3 }
  playerFacing:   { current: number }
  magePos:        THREE.Vector3
  onSprintChange: (s: boolean) => void
  onNearMage:     (near: boolean) => void
}

const CAMERA_DIST   = 5.5
const CAMERA_HEIGHT = 2.8
const CAMERA_LERP   = 8

export default function Scene({ cameraYaw, playerPos, playerFacing, magePos, onSprintChange, onNearMage }: Props) {
  const camTarget = useRef(new THREE.Vector3(0, CAMERA_HEIGHT, CAMERA_DIST))
  const wasNear   = useRef(false)
  const nearMage  = useRef(false)
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(0, CAMERA_HEIGHT, 8 + CAMERA_DIST)
    camera.lookAt(0, 1, 8)
  }, [camera])

  useFrame((state, delta) => {
    const p   = playerPos.current
    const yaw = cameraYaw.current
    camTarget.current.set(
      p.x + Math.sin(yaw) * CAMERA_DIST,
      p.y + CAMERA_HEIGHT,
      p.z + Math.cos(yaw) * CAMERA_DIST,
    )
    state.camera.position.lerp(camTarget.current, CAMERA_LERP * delta)
    state.camera.lookAt(p.x, p.y + 1.1, p.z)
    const dist  = p.distanceTo(magePos)
    const isNear = dist < INTERACT_DIST
    if (isNear !== wasNear.current) {
      wasNear.current  = isNear
      nearMage.current = isNear
      onNearMage(isNear)
    }
  })

  return (
    <>
      <ambientLight intensity={0.08} color="#0a0820" />
      <directionalLight
        position={[30, 50, 20]} intensity={0.5} color="#8ab4ff" castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-80} shadow-camera-right={80}
        shadow-camera-top={80}  shadow-camera-bottom={-80} shadow-camera-far={200}
      />
      <hemisphereLight groundColor="#220a33" color="#0a1522" intensity={0.3} />
      <pointLight position={[0, 30, 0]} color="#220a44" intensity={40} distance={200} />
      <Sparkles count={300} scale={[200, 60, 200]} size={0.3} speed={0.6} opacity={0.15} color="#88aaff" />
      <Sparkles count={80}  scale={[40, 4, 40]}   size={0.8} speed={0.05} opacity={0.08} color="#aaaaff" />
      <ContactShadows position={[0, 0, 0]} opacity={0.6} scale={200} blur={3} far={1} color="#000" />
      <City />
      <Player posRef={playerPos} facingRef={playerFacing} cameraYaw={cameraYaw} onSprint={onSprintChange} />
      <Mage nearPlayer={nearMage.current} magePos={magePos} />
      <EffectComposer>
        <Bloom luminanceThreshold={0.15} luminanceSmoothing={0.85} intensity={1.8} blendFunction={BlendFunction.SCREEN} mipmapBlur />
        <ChromaticAberration
          offset={new THREE.Vector2(0.0006, 0.0006) as any}
          blendFunction={BlendFunction.NORMAL}
          radialModulation={false}
          modulationOffset={0}
        />
        <Vignette offset={0.25} darkness={0.7} eskil={false} blendFunction={BlendFunction.NORMAL} />
      </EffectComposer>
      <fog attach="fog" args={['#030210', 18, 90]} />
    </>
  )
}
