<script setup lang="ts">
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps<{
    modelUrl?: string;
    modelFile?: File;
}>()

const container = ref<HTMLDivElement>()

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let controls: OrbitControls
let mixer: THREE.AnimationMixer | null = null
let clock = new THREE.Clock()

let currentModel: THREE.Object3D | null = null

function init() {
    if (!container.value) return
    const width = container.value.clientWidth
    const height = container.value.clientHeight

    scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf0f0f0)

    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)

    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(width, height)
    renderer.shadowMap.enabled = true
    container.value.appendChild(renderer.domElement)

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2)
    hemiLight.position.set(0, 5, 0)
    scene.add(hemiLight)

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8)
    dirLight.position.set(5, 10, 7.5)
    dirLight.castShadow = true
    scene.add(dirLight)

    const gridHelper = new THREE.GridHelper(20, 20)
    scene.add(gridHelper)

    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(200, 200),
        new THREE.ShadowMaterial({ opacity: 0.2 })
    )
    ground.rotation.x = -Math.PI / 2
    ground.position.y = 0
    ground.receiveShadow = true
    scene.add(ground)

    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.1
    controls.screenSpacePanning = false
    controls.minDistance = 0.5
    controls.maxDistance = 50
    controls.maxPolarAngle = Math.PI

    if (props.modelUrl && !props.modelFile) {
        loadModelFromUrl(props.modelUrl)
    }

    animate()
    window.addEventListener('resize', onWindowResize)
}

function loadModelFromUrl(url: string) {
    const loader = new GLTFLoader()
    loader.setCrossOrigin('anonymous');

    loader.load(
        url,
        (gltf) => {
            addModelToScene(gltf.scene, gltf.animations)
        },
        (xhr) => console.log(`Loading: ${(xhr.loaded / xhr.total) * 100}%`),
        (err) => console.error(err)
    )
}

function loadModelFromFile(file: File) {
    const reader = new FileReader()
    reader.onload = (e) => {
        const arrayBuffer = e.target?.result
        if (!arrayBuffer || !(arrayBuffer instanceof ArrayBuffer)) return

        const loader = new GLTFLoader()
        loader.parse(arrayBuffer, '', (gltf) => {
            addModelToScene(gltf.scene, gltf.animations)
        })
    }
    reader.readAsArrayBuffer(file)
}

function addModelToScene(model: THREE.Object3D, animations?: THREE.AnimationClip[]) {
    if (currentModel) scene.remove(currentModel)
    currentModel = model
    model.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) child.castShadow = true
    })
    scene.add(model)
    fitCameraToObject(model, camera, controls)

    if (animations && animations.length > 0) {
        mixer = new THREE.AnimationMixer(model)
        animations.forEach((clip) => mixer!.clipAction(clip).play())
    }
}

function animate() {
    requestAnimationFrame(animate)
    const delta = clock.getDelta()
    mixer?.update(delta)
    controls.update()
    renderer.render(scene, camera)
}

function onWindowResize() {
    if (!container.value) return
    const width = container.value.clientWidth
    const height = container.value.clientHeight
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
}

function fitCameraToObject(
    object: THREE.Object3D,
    camera: THREE.PerspectiveCamera,
    controls: OrbitControls,
    offset = 1.25
) {
    const box = new THREE.Box3().setFromObject(object)
    const size = box.getSize(new THREE.Vector3()).length()
    const center = box.getCenter(new THREE.Vector3())

    camera.position.copy(center)
    camera.position.x += size / offset
    camera.position.y += size / (offset * 2)
    camera.position.z += size / offset
    camera.lookAt(center)

    controls.target.copy(center)
    controls.update()
}

watch(() => props.modelFile, (newFile) => {
    if (newFile) loadModelFromFile(newFile)
})

onMounted(init)

onBeforeUnmount(() => {
    renderer.dispose()
    scene.clear()
    window.removeEventListener('resize', onWindowResize)
})
</script>

<template>
    <div ref="container" class="three-container"></div>
</template>

<style scoped>
.three-container {
    width: 100%;
    height: 100%;
    position: relative;
    background-color: #f0f0f0;
}
</style>
