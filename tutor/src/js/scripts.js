import * as THREE from 'three'
// OrbitControls
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// GUI
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
// fps
import Stats from 'three/examples/jsm/libs/stats.module.js'

// use import directive to load resource, so that bundle tool can handle it
import nebula from '../img/nebula.jpg'
import stars from '../img/stars.jpg'

// renderer
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
// renderer.useLegacyLights = true  // deprecated, and will be deleted since r165

// shadow 1: enable renderer shadow map
renderer.shadowMap.enabled = true

// scene and camera
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(-10, 30, 30)

// stats
const stats = Stats()
document.body.appendChild(stats.dom)

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
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide })
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
// set it horizontal
plane.rotation.x = -Math.PI / 2
scene.add(plane)

// shadow 2: enable object to receive shadow
plane.receiveShadow = true

// grid helper
const gridHelper = new THREE.GridHelper(30)
scene.add(gridHelper)

// shpere, and show its wireframe, and eventually set it false
const sphereGeometry = new THREE.SphereGeometry(4, 50, 50)
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff, wireframe: false })
// const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x0000ff, wireframe: false })
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
sphere.position.set(-10, 10, 0)
scene.add(sphere)

// shadow 3.1: enable object to cast shadow
sphere.castShadow = true

// light
const ambientLight = new THREE.AmbientLight(0x333333, Math.PI)
scene.add(ambientLight)

/*
// light intensity are not internally scaled by factor PI anymore
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8 * Math.PI)
scene.add(directionalLight)
directionalLight.position.set(-30, 50, 0)
// TODO  Point and spot lights now decay in physically correct ways.
// https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733
// shadow 3.2: enable light to cast shadow
directionalLight.castShadow = true
// adjust shadow camera for render shadow correctly
directionalLight.shadow.camera.bottom = -12

// light helper
const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5) // 5: size of helper
scene.add(dLightHelper)

// shadow camera helper
const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(dLightShadowHelper)
//*/

// spot light
const spotLight = new THREE.SpotLight(0xffffff)
spotLight.intensity *= Math.PI
scene.add(spotLight)
spotLight.position.set(-100, 100, 0)
spotLight.castShadow = true
spotLight.decay = 0 // debug only, should not do this !
// if the spot light camera angle is too wide, the shadow will be too pixelated
// to solve this problem, all we need to do is to narrow the light angle
spotLight.angle = Math.PI / 10

// spot light helper
const sLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(sLightHelper)

// fog: color, near, far
// scene.fog = new THREE.Fog(0xffffff, 0, 100)
scene.fog = new THREE.FogExp2(0xffffff, 0.01) // go exponentially with distance to camera

// bg color
// renderer.setClearColor(0x203020)

// load image
const textureLoader = new THREE.TextureLoader()
// scene.background = textureLoader.load(stars)

// 3d background
const cubeTextureLoader = new THREE.CubeTextureLoader()
scene.background = cubeTextureLoader.load([nebula, nebula, stars, stars, stars, stars])

// gui
gui = new GUI()

const options = {
  // for sphere
  sphereColor: sphereMaterial.color,
  wireframe: sphereMaterial.wireframe,
  speed: 0.01,
  // for spot light
  angle: Math.PI / 10,
  penumbra: 0, // blur effect at the edge of light cone
  intensity: 1,
}
gui.addColor(options, 'sphereColor').onChange((color) => {
  sphereMaterial.color.set(color)
})
gui.add(options, 'wireframe').onChange((wireframe) => {
  sphereMaterial.wireframe = wireframe
})
gui.add(options, 'speed', 0, 0.1).onChange((speed) => {
  speed = speed
})
// spot light
gui.add(options, 'angle', 0, 1).onChange((angle) => {
  spotLight.angle = angle
})
gui.add(options, 'penumbra', 0, 1).onChange((penumbra) => {
  spotLight.penumbra = penumbra
})
gui.add(options, 'intensity', 0, 1).onChange((intensity) => {
  spotLight.intensity = intensity * Math.PI
})

// sphere bouncing
let step = 0

// animation
let prevTime = performance.now()
function animate(time) {
  const delta = time - prevTime
  prevTime = time

  stats.update()

  box.rotation.x += delta / 1000
  box.rotation.y += delta / 1000

  step += options.speed
  sphere.position.y = Math.abs(10 * Math.sin(step))

  renderer.render(scene, camera)
}
renderer.setAnimationLoop(animate)
