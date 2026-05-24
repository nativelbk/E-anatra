// HeroSphere.tsx — avec suivi de la souris
import { useRef, Suspense, useState, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  MeshTransmissionMaterial,
  Float,
  Environment,
  ContactShadows,
  Sparkles as DreiSparkles,
  OrbitControls,
} from "@react-three/drei";
import { useSpring, animated } from "@react-spring/three";
import * as THREE from "three";

useGLTF.preload("/models/360_sphere_robot_no_glass.glb");

/* ── Types pour le suivi souris ── */
interface MousePos {
  x: number; // -1 → +1 (normalisé)
  y: number; // -1 → +1
}

/* ─────────────────────────────────────────────────
   SphereModel — suit la souris via springs
───────────────────────────────────────────────── */
function SphereModel({ mouse }: { mouse: MousePos }) {
  const { scene } = useGLTF("/models/360_sphere_robot_no_glass.glb");
  const autoRotRef = useRef<THREE.Group>(null);

  scene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    }
  });

  // Rotation automatique sur le sous-groupe interne
  useFrame((state) => {
    if (!autoRotRef.current) return;
    autoRotRef.current.rotation.y = state.clock.elapsedTime * 0.18;
  });

  // Spring sur la rotation du groupe externe (suivi souris)
  const { rotX, rotY } = useSpring({
    rotX: -mouse.y * 0.45, // inclinaison verticale
    rotY: mouse.x * 0.55, // inclinaison horizontale
    config: { mass: 1, tension: 120, friction: 28 },
  });

  return (
    // Groupe externe animé — réagit à la souris
    <animated.group rotation-x={rotX} rotation-y={rotY}>
      {/* Groupe interne — rotation automatique continue */}
      <group ref={autoRotRef} dispose={null}>
        <primitive object={scene} scale={3.8} />

        {/* Overlay holographique cyan */}
        <mesh scale={1.52}>
          <sphereGeometry args={[1, 64, 64]} />
          <MeshTransmissionMaterial
            backside
            samples={8}
            thickness={0.4}
            roughness={0.02}
            transmission={0.95}
            ior={1.5}
            chromaticAberration={0.06}
            anisotropy={0.3}
            distortion={0.2}
            distortionScale={0.3}
            temporalDistortion={0.1}
            color="#22d3ee"
            attenuationColor="#0e7490"
            attenuationDistance={0.8}
          />
        </mesh>
      </group>
    </animated.group>
  );
}

/* ── HoloLights (inchangé) ── */
function HoloLights() {
  const light1 = useRef<THREE.PointLight>(null);
  const light2 = useRef<THREE.PointLight>(null);
  const light3 = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (light1.current) {
      light1.current.position.x = Math.sin(t * 0.7) * 3;
      light1.current.position.y = Math.cos(t * 0.5) * 2;
      light1.current.intensity = 2 + Math.sin(t * 1.2) * 0.8;
    }
    if (light2.current) {
      light2.current.position.x = Math.cos(t * 0.6) * 3;
      light2.current.position.z = Math.sin(t * 0.4) * 3;
      light2.current.intensity = 1.5 + Math.cos(t * 0.9) * 0.5;
    }
    if (light3.current) {
      light3.current.position.y = Math.sin(t * 0.8) * 2.5;
      light3.current.intensity = 1 + Math.sin(t * 1.5) * 0.4;
    }
  });

  return (
    <>
      <pointLight
        ref={light1}
        color="#22d3ee"
        intensity={2.5}
        distance={8}
        position={[2, 1, 2]}
      />
      <pointLight
        ref={light2}
        color="#38bdf8"
        intensity={2}
        distance={6}
        position={[-2, -1, 1]}
      />
      <pointLight
        ref={light3}
        color="#2dd4bf"
        intensity={1.5}
        distance={5}
        position={[0, 2, -2]}
      />
      <ambientLight color="#0c4a6e" intensity={0.4} />
      <directionalLight
        color="#e0f2fe"
        intensity={0.6}
        position={[-3, 3, -2]}
      />
    </>
  );
}

/* ── OrbitalRings (inchangé) ── */
function OrbitalRings() {
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const ring3 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ring1.current) {
      ring1.current.rotation.x = t * 0.4;
      ring1.current.rotation.z = t * 0.2;
    }
    if (ring2.current) {
      ring2.current.rotation.y = t * 0.35;
      ring2.current.rotation.x = Math.PI / 3 + t * 0.15;
    }
    if (ring3.current) {
      ring3.current.rotation.z = -t * 0.25;
      ring3.current.rotation.y = t * 0.1;
    }
  });

  const ringMat = (color: string, opacity: number) => (
    <meshBasicMaterial
      color={color}
      transparent
      opacity={opacity}
      side={THREE.DoubleSide}
      depthWrite={false}
    />
  );

  return (
    <group>
      <mesh ref={ring1}>
        <torusGeometry args={[1.8, 0.006, 2, 120]} />
        {ringMat("#22d3ee", 0.5)}
      </mesh>
      <mesh ref={ring2}>
        <torusGeometry args={[2.2, 0.004, 2, 120]} />
        {ringMat("#38bdf8", 0.35)}
      </mesh>
      <mesh ref={ring3}>
        <torusGeometry args={[2.3, 0.003, 2, 120]} />
        {ringMat("#2dd4bf", 0.25)}
      </mesh>
    </group>
  );
}

function LoadingFallback() {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (mesh.current) mesh.current.rotation.y = state.clock.elapsedTime * 0.5;
  });
  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.5, 4]} />
      <meshStandardMaterial
        color="#22d3ee"
        wireframe
        transparent
        opacity={0.3}
      />
    </mesh>
  );
}

/* ─────────────────────────────────────────────────
   HeroSphere — composant principal
───────────────────────────────────────────────── */
export default function HeroSphere() {
  const [mouse, setMouse] = useState<MousePos>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Normalise la position souris entre -1 et +1 dans le conteneur
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMouse({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
    });
  }, []);

  // Recentre doucement quand la souris quitte
  const handleMouseLeave = useCallback(() => {
    setMouse({ x: 0, y: 0 });
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: "520px", cursor: "grab" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Halo de glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(34,211,238,0.12), transparent 70%)",
          filter: "blur(20px)",
        }}
      />

      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
        dpr={[1, 2]}
      >
        <Environment preset="city" />
        <HoloLights />

        <Float
          speed={1.8}
          rotationIntensity={0.4}
          floatIntensity={0.8}
          floatingRange={[-0.15, 0.15]}
        >
          <Suspense fallback={<LoadingFallback />}>
            {/* ← On passe mouse au modèle */}
            <SphereModel mouse={mouse} />
          </Suspense>
        </Float>

        <OrbitalRings />

        <DreiSparkles
          count={60}
          scale={1}
          size={0.6}
          speed={0.3}
          opacity={0.5}
          color="#22d3ee"
        />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
          maxPolarAngle={Math.PI / 1.6}
          minPolarAngle={Math.PI / 3}
          rotateSpeed={0.4}
        />
      </Canvas>
    </div>
  );
}
