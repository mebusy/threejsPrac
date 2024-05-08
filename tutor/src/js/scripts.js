import * as THREE from 'three'
// OrbitControls
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// GUI
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
// fps
import Stats from 'three/examples/jsm/libs/stats.module.js'

// renderer
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// scene and camera
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(-10, 30, 30)

// stats
const stats = Stats()
document.body.appendChild(stats.dom)

// gui
gui = new GUI()

// orbit controls
const orbit = new OrbitControls(camera, renderer.domElement)
orbit.update()

// show axis
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

// add a box
const boxGeometry = new THREE.BoxGeometry()
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const box = new THREE.Mesh(boxGeometry, boxMaterial)
scene.add(box)

// add a plane
const planeGeometry = new THREE.PlaneGeometry(30, 30)
// plane normally be DoubleSide, so we can see it from both sides
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
// set it horizontal
plane.rotation.x = -Math.PI / 2
scene.add(plane)

// grid helper
const gridHelper = new THREE.GridHelper(30)
scene.add(gridHelper)

// shpere, and show its wireframe, and eventually set it false
const sphereGeometry = new THREE.SphereGeometry(4, 50, 50)
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: false })
// const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x0000ff, wireframe: false })
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
sphere.position.set(-10, 10, 0)
scene.add(sphere)

const options = {
  sphereColor: sphereMaterial.color,
  wireframe: sphereMaterial.wireframe,
}
gui.addColor(options, 'sphereColor').onChange((color) => {
  sphereMaterial.color.set(color)
})
gui.add(options, 'wireframe').onChange((wireframe) => {
  sphereMaterial.wireframe = wireframe
})

// sphere bouncing
let step = 0
let speed = 0.01

// animation
let prevTime = performance.now()
function animate(time) {
  const delta = time - prevTime
  prevTime = time

  stats.update()

  box.rotation.x += delta / 1000
  box.rotation.y += delta / 1000

  step += speed
  sphere.position.y = Math.abs(10 * Math.sin(step))

  renderer.render(scene, camera)
}
renderer.setAnimationLoop(animate)
