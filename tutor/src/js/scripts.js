import * as THREE from 'three'

// renderer
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// scene and camera
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

// show axis
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

camera.position.set(0, 2, 5)

renderer.render(scene, camera)
