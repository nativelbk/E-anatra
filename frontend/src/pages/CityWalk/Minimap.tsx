import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { buildings, lights, CITY_HALF, SKYSCRAPERS, TOWERS, HOUSES } from './cityGen'

interface Props {
  playerPos:    { current: THREE.Vector3 }
  playerFacing: { current: number }
  cameraYaw:    { current: number }
  magePos:      THREE.Vector3
}

const SIZE   = 200
const RADIUS = SIZE / 2 - 1
const SCALE  = RADIUS / CITY_HALF

function bldColor(glb: string): string {
  if (SKYSCRAPERS.some(s => s === glb)) return '#00e5ff'
  if (TOWERS.some(s => s === glb))      return '#0099cc'
  if (HOUSES.some(s => s === glb))      return '#2a6644'
  if (glb.includes('low-detail'))       return '#162333'
  return '#1b3c52'
}

export default function Minimap({ playerPos, playerFacing, cameraYaw, magePos }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null!)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')!
    let rafId: number
    let scanAngle = 0

    const draw = () => {
      const CX = SIZE / 2, CY = SIZE / 2
      ctx.clearRect(0, 0, SIZE, SIZE)
      ctx.save()
      ctx.beginPath()
      ctx.arc(CX, CY, RADIUS, 0, Math.PI * 2)
      ctx.clip()

      ctx.fillStyle = 'rgba(0, 6, 18, 0.94)'
      ctx.fillRect(0, 0, SIZE, SIZE)

      ctx.strokeStyle = 'rgba(0, 180, 120, 0.08)'
      ctx.lineWidth = 0.5
      for (let wx = -CITY_HALF; wx <= CITY_HALF; wx += 18.6) {
        const px = CX + wx * SCALE
        ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, SIZE); ctx.stroke()
      }
      for (let wz = -CITY_HALF; wz <= CITY_HALF; wz += 18.6) {
        const py = CY + wz * SCALE
        ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(SIZE, py); ctx.stroke()
      }

      scanAngle = (scanAngle + 0.012) % (Math.PI * 2)
      ctx.save()
      ctx.translate(CX, CY)
      ctx.rotate(scanAngle)
      const sweep = ctx.createLinearGradient(0, 0, RADIUS, 0)
      sweep.addColorStop(0, 'rgba(0,255,180,0.0)')
      sweep.addColorStop(0.6, 'rgba(0,255,180,0.04)')
      sweep.addColorStop(1, 'rgba(0,255,180,0.14)')
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, RADIUS, -0.45, 0.0); ctx.closePath()
      ctx.fillStyle = sweep; ctx.fill()
      ctx.restore()

      ctx.fillStyle = 'rgba(255, 245, 180, 0.25)'
      for (const l of lights) {
        ctx.beginPath(); ctx.arc(CX + l.x * SCALE, CY + l.z * SCALE, 0.7, 0, Math.PI * 2); ctx.fill()
      }

      for (const b of buildings) {
        const bx = CX + b.x * SCALE, bz = CY + b.z * SCALE
        const hw = b.hw * SCALE, hd = b.hd * SCALE
        ctx.save(); ctx.translate(bx, bz); ctx.rotate(b.rotY)
        ctx.fillStyle = bldColor(b.glb); ctx.fillRect(-hw, -hd, hw * 2, hd * 2)
        ctx.strokeStyle = 'rgba(0, 200, 160, 0.18)'; ctx.lineWidth = 0.4
        ctx.strokeRect(-hw, -hd, hw * 2, hd * 2)
        ctx.restore()
      }

      const camYaw   = cameraYaw.current
      const px       = CX + playerPos.current.x * SCALE
      const py       = CY + playerPos.current.z * SCALE
      const viewAngle = camYaw + Math.PI
      const coneHalf  = 0.38
      ctx.save(); ctx.translate(px, py); ctx.rotate(viewAngle)
      const coneGrad = ctx.createLinearGradient(0, 0, 28, 0)
      coneGrad.addColorStop(0, 'rgba(255,68,102,0.22)'); coneGrad.addColorStop(1, 'rgba(255,68,102,0.0)')
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 28, -coneHalf, coneHalf); ctx.closePath()
      ctx.fillStyle = coneGrad; ctx.fill(); ctx.restore()

      const glow = ctx.createRadialGradient(px, py, 0, px, py, 7)
      glow.addColorStop(0, 'rgba(255, 80, 110, 0.8)'); glow.addColorStop(1, 'rgba(255, 80, 110, 0)')
      ctx.beginPath(); ctx.arc(px, py, 7, 0, Math.PI * 2); ctx.fillStyle = glow; ctx.fill()
      ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI * 2); ctx.fillStyle = '#ff4466'; ctx.fill()

      const facing = playerFacing.current
      ctx.save(); ctx.translate(px, py); ctx.rotate(facing)
      ctx.beginPath(); ctx.moveTo(6, 0); ctx.lineTo(3, -2.5); ctx.lineTo(3, 2.5); ctx.closePath()
      ctx.fillStyle = '#ff8899'; ctx.fill(); ctx.restore()

      const mx    = CX + magePos.x * SCALE, mz = CY + magePos.z * SCALE
      const mGlow = ctx.createRadialGradient(mx, mz, 0, mx, mz, 9)
      mGlow.addColorStop(0, 'rgba(200, 0, 255, 0.85)'); mGlow.addColorStop(1, 'rgba(200, 0, 255, 0)')
      ctx.beginPath(); ctx.arc(mx, mz, 9, 0, Math.PI * 2); ctx.fillStyle = mGlow; ctx.fill()
      ctx.beginPath(); ctx.arc(mx, mz, 3, 0, Math.PI * 2); ctx.fillStyle = '#cc00ff'; ctx.fill()
      ctx.fillStyle = 'rgba(220, 100, 255, 0.9)'
      ctx.font = 'bold 7px Courier New'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText('✦', mx, mz - 9)

      ctx.restore()

      ctx.beginPath(); ctx.arc(CX, CY, RADIUS, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(0, 255, 180, 0.45)'; ctx.lineWidth = 1.5; ctx.stroke()
      ctx.beginPath(); ctx.arc(CX, CY, RADIUS - 3, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(0, 255, 180, 0.1)'; ctx.lineWidth = 1; ctx.stroke()

      ctx.fillStyle = 'rgba(0, 255, 180, 0.6)'
      ctx.font = 'bold 8px Courier New'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText('N', CX, 6); ctx.fillText('S', CX, SIZE - 6)
      ctx.fillText('W', 6, CY); ctx.fillText('E', SIZE - 6, CY)

      rafId = requestAnimationFrame(draw)
    }

    rafId = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafId)
  }, [playerPos, playerFacing, cameraYaw, magePos])

  return (
    <canvas
      ref={canvasRef}
      width={SIZE}
      height={SIZE}
      style={{
        position: 'absolute', top: 20, right: 20,
        borderRadius: '50%', imageRendering: 'pixelated', pointerEvents: 'none',
      }}
    />
  )
}
