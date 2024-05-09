import * as THREE from 'three'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

// use import directive to load resource, so that bundle tool can handle it
import nebula from '../img/nebula.jpg'
import stars from '../img/stars.jpg'

// load model
const monkeyUrl = new URL('../assets/monkey.glb', import.meta.url)

// scene and camera
import { scene, camera, renderer, useStats, useOrbit, useGui, addCustomAnimate } from './render.js'

// orbit
useOrbit()
// stats
useStats()

// shadow 1: enable renderer shadow map
renderer.shadowMap.enabled = true

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

// map texture to a cube
const box2Geometry = new THREE.BoxGeometry(4, 4, 4)
const box2Material = new THREE.MeshBasicMaterial({
  // color: 0x00ff00,
  map: textureLoader.load(nebula),
})
// const box2 = new THREE.Mesh(box2Geometry, box2Material)

const multiMaterials = [
  new THREE.MeshBasicMaterial({ map: textureLoader.load(nebula) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(nebula) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(stars) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(stars) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(stars) }),
  new THREE.MeshBasicMaterial({ map: textureLoader.load(stars) }),
]
const box2 = new THREE.Mesh(box2Geometry, multiMaterials)
scene.add(box2)
box2.position.set(0, 15, 10)

// change mesh
const plane2Geometry = new THREE.PlaneGeometry(10, 10, 8, 8) // 10x10, and subdivision
const plane2Material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })
const plane2 = new THREE.Mesh(plane2Geometry, plane2Material)
scene.add(plane2)
plane2.position.set(10, 10, 15)

// shader
const sphere2Geometry = new THREE.SphereGeometry(4)
const sphere2Material = new THREE.ShaderMaterial({
  vertexShader: `
        varying vec3 vNormal;
        void main() {
        vNormal = normal;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
  fragmentShader: `
        varying vec3 vNormal;
        void main() {
        gl_FragColor = vec4(vNormal, 1.0);
        }
    `,
})
const sphere2 = new THREE.Mesh(sphere2Geometry, sphere2Material)
scene.add(sphere2)

// load model
const gltfLoader = new GLTFLoader()
gltfLoader.load(
  monkeyUrl.href,
  (gltf) => {
    const model = gltf.scene
    scene.add(model)
    gltf.scene.position.set(-12, 4, 10)
  },
  undefined,
  (error) => {
    console.error(error)
  }
)

// gui
const gui = useGui()

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
  // update light helper
  sLightHelper.update()
})
gui.add(options, 'penumbra', 0, 1).onChange((penumbra) => {
  spotLight.penumbra = penumbra
})
gui.add(options, 'intensity', 0, 1).onChange((intensity) => {
  spotLight.intensity = intensity * Math.PI
})

// ray-cast
const mousePosition = new THREE.Vector2(-2, -2) // init value out of screen
window.addEventListener('mousemove', (event) => {
  // convert to normalized device coordinates
  mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1
  mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1
})
const raycaster = new THREE.Raycaster()

box2.name = 'theBox'

// sphere bouncing
let step = 0

// animation
function animate(delta) {
  box.rotation.x += delta / 1000
  box.rotation.y += delta / 1000

  step += options.speed
  sphere.position.y = Math.abs(10 * Math.sin(step))

  // ray-cast
  raycaster.setFromCamera(mousePosition, camera)
  const intersects = raycaster.intersectObjects(scene.children)
  for (const intersect of intersects) {
    // intersect.object.material.color.set(0xff0000)
    if (intersect.object.id === sphere.id) {
      // console.log(intersect.object)
      intersect.object.material.color.set(0xff0000)
    }
    if (intersect.object.name === 'theBox') {
      intersect.object.rotation.x += delta / 1000
      intersect.object.rotation.y += delta / 1000
    }
  }

  // change the first vertex of the plane
  plane2.geometry.attributes.position.array[0] = 10 * Math.random()
  plane2.geometry.attributes.position.array[1] = 10 * Math.random()
  plane2.geometry.attributes.position.array[2] = 10 * Math.random()
  // important !!!
  plane2.geometry.attributes.position.needsUpdate = true
}

addCustomAnimate(animate)
