import * as THREE from 'three'
// OrbitControls
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// fps
import Stats from 'three/examples/jsm/libs/stats.module.js'
// GUI
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'

// renderer
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
// renderer.useLegacyLights = true  // deprecated, and will be deleted since r165

// scene and camera
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(-10, 30, 30)

let _stats
function useStats() {
  // stats
  if (!_stats) {
    _stats = new Stats()
    document.body.appendChild(_stats.dom)
  }
}

let _orbit
function useOrbit() {
  // orbit controls
  if (!_orbit) {
    _orbit = new OrbitControls(camera, renderer.domElement)
    _orbit.update()
  }
}

let _gui
function useGui() {
  // gui
  if (!_gui) {
    _gui = new GUI()
  }
  return _gui
}

// animation
let _customAnimate
let prevTime = performance.now()
function animate(time) {
  const delta = time - prevTime
  prevTime = time

  if (_stats) {
    _stats.update()
  }

  if (_customAnimate) {
    _customAnimate(delta)
  }

  renderer.render(scene, camera)
}
renderer.setAnimationLoop(animate)

// use this function to add animate callback
function addCustomAnimate(fn) {
  _customAnimate = fn
}

// resize event
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

// export all
export { scene, camera, renderer, useStats, useOrbit, useGui, addCustomAnimate }
