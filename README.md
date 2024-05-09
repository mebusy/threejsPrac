
# 3js


# Tutor

https://www.youtube.com/watch?v=xJAfLdUgdc4

https://threejs.org/manual/#en/fundamentals

https://www.classcentral.com/course/youtube-intermediate-three-js-tutorial-create-a-globe-with-custom-shaders-150237



- parcel
    - we use parcel to bundle our code and run a local server because it zero-config, you'd may use webpack or any other bundler you like.

- 3js use **right-hand coordinate system** (x: right, y: up, z: forward)

## Canvas

- the HTML canvas's original coordinate system, the (0,0) is on the top-left corner
- in webgl , the values of the axes start from -1 to 1 (along the axis), so the center of the canvas is (0,0), there are called normalized device coordinates (NDC)

## Material

- MeshBasicMaterial
    - A material for drawing geometries in a simple shaded (flat or wireframe) way. 
    - This material is not affected by lights, that is, it doesn't need light to appear.

## Shadow

- shadow is disabled by default
- to enable shadow in threejs, you need
    - 1. set `renderer.shadowMap.enabled = true`
    - 2. enable object to receive shadow by setting `object.receiveShadow = true` 
    - 3.a enable light to cast shadow by setting `light.castShadow = true`
    - 3.b enable object to cast shadow by setting `object.castShadow = true`
- shadow camera
    - actually shadows in 3js use cameras internally which are the same as those we've talked about.
    - the role of a shadow's camera is to delimit where to render the shadows, that said each type of light has a specific type of camera its shadows. Directional light, for an intance, uses OrthographicCamera, while PointLight and SpotLight use PerspectiveCamera.
    - sometimes the shadow display is not perfect, this is because the shadow camera is not set properly.
        - shadows out of the camera's frustum are not rendered.
        - you may need to adjust the shadow camera's properties, e.g. `directionalLight.shadow.camera.bottom = -12`


## Project Resource

- use `import` directive to load resource, so that bundle tool can handle it
    - `import nebula from '../img/nebula.jpg'`

