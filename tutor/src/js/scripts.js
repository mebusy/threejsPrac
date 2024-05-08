import * as THREE from 'three'

// renderer
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// scene and camera
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 2, 5)

// show axis
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

// add a box
const boxGeometry = new THREE.BoxGeometry()
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const box = new THREE.Mesh(boxGeometry, boxMaterial)
scene.add(box)

// animation
let prevTime = performance.now()
function animate(time) {
  const delta = time - prevTime
  prevTime = time
  box.rotation.x += delta / 1000
  box.rotation.y += delta / 1000
  renderer.render(scene, camera)
}
renderer.setAnimationLoop(animate)
