import "./style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import gsap from "gsap";

// Texture Loader
const textureLoader = new THREE.TextureLoader();
const height = textureLoader.load("/textures/height.png");
const texture = textureLoader.load("/textures/texture.jpg");
const alpha = textureLoader.load("/textures/alpha.gif");
// const alpha = textureLoader.load("/textures/alpha.jpg");

// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Objects
const geometry = new THREE.PlaneGeometry(3, 3, 64, 64);

// Materials
const material = new THREE.MeshStandardMaterial({
  color: "gray",
  doubleSide: true,
  map: texture,
  displacementMap: height,
  displacementScale: 0.4,
  alphaMap: alpha,
  transparent: true,
  depthTest: false,
});

// Mesh
const plane = new THREE.Mesh(geometry, material);
plane.rotation.x = 181;
scene.add(plane);

// Debug
gui
  .add(plane.rotation, "x")
  .min(0)
  .max(Math.PI * 2)
  .name("rotationX");

// Lights

const pointLight = new THREE.PointLight("#53aad9", 50);
pointLight.position.x = 0;
pointLight.position.y = 0;
pointLight.position.z = 1.15;
scene.add(pointLight);

gui.add(pointLight.position, "x").min(-3).max(3).step(0.01).name("lightX");
gui.add(pointLight.position, "y").min(-3).max(3).step(0.01).name("lightY");
gui.add(pointLight.position, "z").min(-3).max(3).step(0.01).name("lightZ");

const color = { color: "#0000ff" };
gui.addColor(color, "color").onChange(() => {
  pointLight.color.set(color.color);
});

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 3;
scene.add(camera);

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */

let mouseY = 0;

const animateTerrain = (event) => {
  mouseY = event.clientY;
};

document.addEventListener("mousemove", animateTerrain);

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  plane.rotation.z = 0.5 * elapsedTime;
  plane.material.displacementScale = 0.3 + mouseY * 0.0008;

  // Update Orbital Controls
  // controls.update()

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
