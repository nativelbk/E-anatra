const C = '/models/kenney_city-kit-commercial_2.1/Models/GLB format/'
const M = '/models/kenney_modular-buildings/Models/GLB format/'

export const COMMERCIAL = [
  'building-a','building-b','building-c','building-d','building-e',
  'building-f','building-g','building-h','building-i','building-j',
  'building-k','building-l','building-m','building-n',
].map(n => `${C}${n}.glb`)

export const SKYSCRAPERS = [
  'building-skyscraper-a','building-skyscraper-b','building-skyscraper-c',
  'building-skyscraper-d','building-skyscraper-e',
].map(n => `${C}${n}.glb`)

export const TOWERS = [
  'building-sample-tower-a','building-sample-tower-b',
  'building-sample-tower-c','building-sample-tower-d',
].map(n => `${M}${n}.glb`)

export const HOUSES = [
  'building-sample-house-a','building-sample-house-b','building-sample-house-c',
].map(n => `${M}${n}.glb`)

export const LOW_DETAIL = [
  'low-detail-building-a','low-detail-building-b','low-detail-building-c',
  'low-detail-building-d','low-detail-building-e','low-detail-building-f',
  'low-detail-building-wide-a','low-detail-building-wide-b',
].map(n => `${C}${n}.glb`)

export const ALL_MODELS = [...COMMERCIAL, ...SKYSCRAPERS, ...TOWERS, ...HOUSES, ...LOW_DETAIL]

export interface PlacedBuilding {
  id: number
  glb: string
  x: number
  z: number
  rotY: number
  scale: number
  hw: number
  hd: number
}

export interface LightData { x: number; z: number }

function rng(seed: number) {
  let s = seed
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) | 0
    return (s >>> 0) / 0xffffffff
  }
}

const SCALE   = 2.5
const SLOT    = 5.8
const COLS    = 2
const ROWS    = 2
const BLOCK_W = SLOT * COLS
const BLOCK_D = SLOT * ROWS
const ROAD    = 7
const PITCH   = BLOCK_W + ROAD
export const CITY_HALF = (6 * PITCH) / 2

function generateCity() {
  const r = rng(1337)
  const buildings: PlacedBuilding[] = []
  const lights: LightData[] = []
  const GRID = 6

  for (let bx = 0; bx < GRID; bx++) {
    for (let bz = 0; bz < GRID; bz++) {
      const cx = (bx - GRID / 2 + 0.5) * PITCH
      const cz = (bz - GRID / 2 + 0.5) * PITCH
      lights.push({ x: cx - PITCH / 2, z: cz - PITCH / 2 })

      const dMax = Math.max(Math.abs(bx - 2.5), Math.abs(bz - 2.5))
      let pool: string[]
      if (dMax < 1)        pool = [...SKYSCRAPERS, ...TOWERS]
      else if (dMax < 2)   pool = [...COMMERCIAL, ...TOWERS]
      else if (dMax < 2.5) pool = [...COMMERCIAL, ...LOW_DETAIL]
      else                 pool = [...COMMERCIAL, ...HOUSES, ...LOW_DETAIL]

      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          const x         = cx - BLOCK_W / 2 + col * SLOT + SLOT / 2
          const z         = cz - BLOCK_D / 2 + row * SLOT + SLOT / 2
          const glb       = pool[Math.floor(r() * pool.length)]
          const rotY      = Math.floor(r() * 4) * (Math.PI / 2)
          const scaleVar  = 0.9 + r() * 0.3
          const finalScale = SCALE * scaleVar
          const hw        = 1.0 * finalScale
          const hd        = 1.0 * finalScale
          buildings.push({ id: buildings.length, glb, x, z, rotY, scale: finalScale, hw, hd })
        }
      }
    }
  }

  return { buildings, lights }
}

export const { buildings, lights } = generateCity()

export function generateMagePos(): { x: number; z: number } {
  const bound    = CITY_HALF - 8
  const PLAYER_X = 0, PLAYER_Z = 8
  const MIN_DIST = 40
  for (let i = 0; i < 400; i++) {
    const x  = (Math.random() * 2 - 1) * bound
    const z  = (Math.random() * 2 - 1) * bound
    const dx = x - PLAYER_X, dz = z - PLAYER_Z
    if (Math.sqrt(dx * dx + dz * dz) < MIN_DIST) continue
    if (checkCollision(x, z, 2)) continue
    return { x, z }
  }
  return { x: 44, z: -44 }
}

export function checkCollision(px: number, pz: number, radius = 0.5): boolean {
  for (const b of buildings) {
    const swap      = Math.round(b.rotY / (Math.PI / 2)) % 2 !== 0
    const [hw, hd]  = swap ? [b.hd, b.hw] : [b.hw, b.hd]
    if (Math.abs(px - b.x) < hw + radius && Math.abs(pz - b.z) < hd + radius) return true
  }
  return false
}
