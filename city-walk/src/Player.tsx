import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useKeys } from './hooks/useKeys'
import { checkCollision, CITY_HALF } from './cityGen'

interface Props {
  posRef:    { current: THREE.Vector3 }
  facingRef: { current: number }
  cameraYaw: { current: number }
  onSprint: (s: boolean) => void
}

const WALK_SPEED = 5
const RUN_SPEED = 11
const BOUNDS = CITY_HALF - 2

export default function Player({ posRef, facingRef, cameraYaw, onSprint }: Props) {
  const groupRef = useRef<THREE.Group>(null!)
  const velocity = useRef(new THREE.Vector3())
  const facingAngle = useRef(Math.PI)
  const legAngle = useRef(0)
  const isMoving = useRef(false)
  const leftLegRef = useRef<THREE.Mesh>(null!)
  const rightLegRef = useRef<THREE.Mesh>(null!)
  const leftArmRef = useRef<THREE.Mesh>(null!)
  const rightArmRef = useRef<THREE.Mesh>(null!)
  const keys = useKeys()

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.position.set(0, 0, 8)
      posRef.current.set(0, 0, 8)
    }
  }, [posRef])

  useFrame((_state, delta) => {
    if (!groupRef.current) return

    const isSprinting = keys.current.has('ShiftLeft') || keys.current.has('ShiftRight')
    const speed = isSprinting ? RUN_SPEED : WALK_SPEED

    // Camera-relative forward/right vectors
    const yaw = cameraYaw.current
    const forward = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw))
    const right = new THREE.Vector3(Math.cos(-yaw), 0, -Math.sin(-yaw))

    const move = new THREE.Vector3()
    if (keys.current.has('KeyW') || keys.current.has('ArrowUp'))    move.addScaledVector(forward, 1)
    if (keys.current.has('KeyS') || keys.current.has('ArrowDown'))  move.addScaledVector(forward, -1)
    if (keys.current.has('KeyA') || keys.current.has('ArrowLeft'))  move.addScaledVector(right, -1)
    if (keys.current.has('KeyD') || keys.current.has('ArrowRight')) move.addScaledVector(right, 1)

    isMoving.current = move.lengthSq() > 0
    onSprint(isSprinting && isMoving.current)

    if (isMoving.current) {
      move.normalize().multiplyScalar(speed)
    }

    // Smooth velocity
    velocity.current.lerp(move, 12 * delta)

    const pos = groupRef.current.position
    const dx = velocity.current.x * delta
    const dz = velocity.current.z * delta

    // Axis-separated collision
    const newX = Math.max(-BOUNDS, Math.min(BOUNDS, pos.x + dx))
    if (!checkCollision(newX, pos.z)) pos.x = newX

    const newZ = Math.max(-BOUNDS, Math.min(BOUNDS, pos.z + dz))
    if (!checkCollision(pos.x, newZ)) pos.z = newZ

    // Sync position ref for camera
    posRef.current.copy(pos)

    // Character rotation: face movement direction
    if (isMoving.current && velocity.current.lengthSq() > 0.01) {
      const targetAngle = Math.atan2(velocity.current.x, velocity.current.z)
      // Shortest angle interpolation
      let diff = targetAngle - facingAngle.current
      while (diff > Math.PI) diff -= Math.PI * 2
      while (diff < -Math.PI) diff += Math.PI * 2
      facingAngle.current += diff * Math.min(1, 14 * delta)
      facingRef.current = facingAngle.current
      groupRef.current.rotation.y = facingAngle.current
    }

    // Leg/arm swing animation
    if (isMoving.current) {
      const freq = isSprinting ? 8 : 5
      legAngle.current += freq * delta
      const swing = Math.sin(legAngle.current) * (isSprinting ? 0.55 : 0.38)
      if (leftLegRef.current)  leftLegRef.current.rotation.x  =  swing
      if (rightLegRef.current) rightLegRef.current.rotation.x = -swing
      if (leftArmRef.current)  leftArmRef.current.rotation.x  = -swing * 0.6
      if (rightArmRef.current) rightArmRef.current.rotation.x =  swing * 0.6
    } else {
      if (leftLegRef.current)  leftLegRef.current.rotation.x  = THREE.MathUtils.lerp(leftLegRef.current.rotation.x,  0, 8 * delta)
      if (rightLegRef.current) rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, 0, 8 * delta)
      if (leftArmRef.current)  leftArmRef.current.rotation.x  = THREE.MathUtils.lerp(leftArmRef.current.rotation.x,  0, 8 * delta)
      if (rightArmRef.current) rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x, 0, 8 * delta)
    }
  })

  return (
    <group ref={groupRef}>
      {/* Body */}
      <mesh position={[0, 1.05, 0]} castShadow>
        <capsuleGeometry args={[0.28, 0.7, 6, 12]} />
        <meshStandardMaterial color="#cc2244" roughness={0.4} metalness={0.3} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.72, 0]} castShadow>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color="#f5c5a0" roughness={0.6} />
      </mesh>
      {/* Visor/eyes glow */}
      <mesh position={[0, 1.73, 0.19]}>
        <boxGeometry args={[0.2, 0.04, 0.04]} />
        <meshStandardMaterial color="#00ffcc" emissive="#00ffcc" emissiveIntensity={2} toneMapped={false} />
      </mesh>

      {/* Left arm */}
      <group position={[-0.35, 1.1, 0]}>
        <mesh ref={leftArmRef} position={[0, -0.22, 0]} castShadow>
          <capsuleGeometry args={[0.1, 0.36, 4, 8]} />
          <meshStandardMaterial color="#aa2033" roughness={0.4} metalness={0.3} />
        </mesh>
      </group>

      {/* Right arm */}
      <group position={[0.35, 1.1, 0]}>
        <mesh ref={rightArmRef} position={[0, -0.22, 0]} castShadow>
          <capsuleGeometry args={[0.1, 0.36, 4, 8]} />
          <meshStandardMaterial color="#aa2033" roughness={0.4} metalness={0.3} />
        </mesh>
      </group>

      {/* Left leg */}
      <group position={[-0.18, 0.6, 0]}>
        <mesh ref={leftLegRef} position={[0, -0.26, 0]} castShadow>
          <capsuleGeometry args={[0.12, 0.42, 4, 8]} />
          <meshStandardMaterial color="#1a1a3a" roughness={0.5} />
        </mesh>
      </group>

      {/* Right leg */}
      <group position={[0.18, 0.6, 0]}>
        <mesh ref={rightLegRef} position={[0, -0.26, 0]} castShadow>
          <capsuleGeometry args={[0.12, 0.42, 4, 8]} />
          <meshStandardMaterial color="#1a1a3a" roughness={0.5} />
        </mesh>
      </group>

      {/* Subtle player glow */}
      <pointLight position={[0, 1, 0]} color="#ff4466" intensity={1.5} distance={3} />
    </group>
  )
}
