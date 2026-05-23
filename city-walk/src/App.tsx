import { useRef, useState, useCallback, useEffect, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import Scene from './Scene'
import Minimap from './Minimap'
import SageChat from './SageChat'
import { generateMagePos } from './cityGen'
import './App.css'

export default function App() {
  const cameraYaw    = useRef(Math.PI)
  const playerPos    = useRef(new THREE.Vector3(0, 0, 8))
  const playerFacing = useRef(Math.PI)
  const isSprinting  = useRef(false)

  // Computed once at mount — stable for the entire session
  const magePos = useMemo(() => {
    const { x, z } = generateMagePos()
    return new THREE.Vector3(x, 0, z)
  }, [])

  const [sprinting,     setSprinting]     = useState(false)
  const [nearMage,      setNearMage]      = useState(false)
  const [dialogOpen,    setDialogOpen]    = useState(false)
  const [onboarding,    setOnboarding]    = useState(true)

  const isDragging = useRef(false)
  const lastX      = useRef(0)
  const lastTouch  = useRef(0)

  const onSprintChange = useCallback((s: boolean) => {
    isSprinting.current = s
    setSprinting(s)
  }, [])

  const onNearMage = useCallback((near: boolean) => {
    setNearMage(near)
    if (!near) setDialogOpen(false)
  }, [])

  // E key → toggle dialog when near mage
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'KeyE' && nearMage && !e.repeat) {
        setDialogOpen(prev => !prev)
      }
      if (e.code === 'Escape') {
        setDialogOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [nearMage])

  return (
    <div className="app">
      <div
        className="canvas-wrap"
        onMouseDown={(e) => { isDragging.current = true; lastX.current = e.clientX }}
        onMouseMove={(e) => {
          if (!isDragging.current) return
          cameraYaw.current += (e.clientX - lastX.current) * 0.004
          lastX.current = e.clientX
        }}
        onMouseUp={() => { isDragging.current = false }}
        onMouseLeave={() => { isDragging.current = false }}
        onTouchStart={(e) => { lastTouch.current = e.touches[0].clientX }}
        onTouchMove={(e) => {
          cameraYaw.current += (e.touches[0].clientX - lastTouch.current) * 0.005
          lastTouch.current = e.touches[0].clientX
        }}
      >
        <Canvas
          shadows
          dpr={[1, 1.5]}
          camera={{ fov: 60, near: 0.1, far: 300 }}
          gl={{ antialias: true, toneMapping: 4, toneMappingExposure: 0.9 }}
        >
          <Scene
            cameraYaw={cameraYaw}
            playerPos={playerPos}
            playerFacing={playerFacing}
            magePos={magePos}
            onSprintChange={onSprintChange}
            onNearMage={onNearMage}
          />
        </Canvas>
      </div>

      {/* HUD */}
      <div className="hud">
        <div className="hud-top">
          <div className="city-name">
            <span className="city-label">SECTEUR</span>
            <span className="city-value">NOVA-7 / DISTRICT CENTRAL</span>
          </div>
          <div className={`status-dot ${sprinting ? 'run' : 'walk'}`}>
            {sprinting ? '⚡ SPRINT' : '◉ MARCHE'}
          </div>
        </div>

        <div className="controls">
          <div className="ctrl-row"><kbd>W A S D</kbd><span>Déplacer</span></div>
          <div className="ctrl-row"><kbd>⇧ Shift</kbd><span>Sprint</span></div>
          <div className="ctrl-row"><kbd>🖱 Drag</kbd><span>Pivoter caméra</span></div>
          {nearMage && (
            <div className="ctrl-row mage-hint">
              <kbd>E</kbd><span>Parler à E-Tsiry</span>
            </div>
          )}
        </div>

        <div className="crosshair">
          <div className="ch-h" />
          <div className="ch-v" />
        </div>

        <div className="scan-line" />
      </div>

      {/* Minimap */}
      <Minimap playerPos={playerPos} playerFacing={playerFacing} cameraYaw={cameraYaw} magePos={magePos} />

      {/* Sage chat dialog */}
      {dialogOpen && <SageChat onClose={() => setDialogOpen(false)} />}

      {/* Onboarding overlay */}
      {onboarding && (
        <div className="onboarding">
          <div className="onboarding-panel">
            <div className="onboarding-tag">TRANSMISSION ENTRANTE</div>
            <div className="onboarding-title">NOVA-7</div>
            <div className="onboarding-sub">DISTRICT CENTRAL</div>
            <p className="onboarding-body">
              Quelque part dans les rues de cette mégalopole se cache un être
              d'une sagesse millénaire&nbsp;: le mage <span className="onboarding-name">E-Tsiry</span>.
              <br /><br />
              Parcourez la ville, trouvez-le grâce au repère&nbsp;
              <span className="onboarding-marker">✦</span> sur la minimap,
              et approchez-vous de lui pour recevoir ses précieux conseils.
            </p>
            <div className="onboarding-hint">
              <span className="onboarding-marker">✦</span>
              <span>Repère violet sur le radar en haut à droite</span>
            </div>
            <button
              className="onboarding-btn"
              onClick={() => setOnboarding(false)}
            >
              ▶&nbsp;&nbsp;COMMENCER L'EXPLORATION
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
