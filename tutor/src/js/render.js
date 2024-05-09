import * as THREE from 'three'

// renderer
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
// renderer.useLegacyLights = true  // deprecated, and will be deleted since r165

// scene and camera
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(-10, 30, 30)

// export all
export { scene, camera, renderer }
