import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

// Create scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
scene.background = new THREE.Color(0x000000); // White background

// Set renderer size and add to DOM
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


//Orbit Control Enabled 
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom - true;
controls.autoRotate = false;
controls.target.set(-4.3, -0.8, 0);
controls.update();


// Lighting for a more realistic look
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 2);
const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 3);
directionalLight.position.set(5, 5, 10).normalize();
scene.add(ambientLight, directionalLight);

//Cube Sizes
const size = 0.38;
const gridSize = 4;
const cubes = [];

//Set the color for the cubes
const colors = [
    [0xFF5555, 0xFF5555, 0xFF5555, 0xFF5555], // Red row
    [0xFF6E44, 0xFF6E44, 0xFF6E44, 0xFF6E44], // Orange-red row
    [0xFF8844, 0xFF8844, 0xFF8844, 0xFF8844], // Orange row
    [0xFFA044, 0xFFA044, 0xFFA044, 0xFFA044]  // Light orange row
];
//The offset setter
const right = 1.5;
//Looping for multiple cubes
for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
        const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const material = new THREE.MeshBasicMaterial({ color: colors[j][i] }); // Assign color from the gradient array
        const cube = new THREE.Mesh(geometry, material);

        //Fixed position for each of these cubes 
        cube.position.x = i * size - (gridSize * size) / 2 + right;
        cube.position.y = j * size - (gridSize * size) / 2;

        //Add The Cube on the canvas
        scene.add(cube);
        cubes.push(cube);
    }
}

//Generate the text
// Create a canvas element
const fontLoader = new FontLoader();
fontLoader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', (font) => {
    const textGeometry = new TextGeometry('S | E | A ', {
        font: font,
        size: 1.4,
        height: 0.05, // MUCH LOWER HEIGHT
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.02,
        bevelSize: 0.015,
        bevelSegments: 5
    });
    const textMaterial = new THREE.MeshStandardMaterial({
        color: 0xFF0066, // Pinkish-red
        metalness: 0.5,
        roughness: 0.2
    });

    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.scale.set(1, 1, 0.005); // Reduces depth (Z-axis)
    textMesh.position.set(-7, -0.8, 0);
    scene.add(textMesh);
    
    const textGeometry2 = new TextGeometry('evolution to excellence', {
        font: font,
        size: 0.55,
        height: 0.05,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.01,
        bevelSize: 0.005,
        bevelSegments: 3

    });

    const textMaterial2 = new THREE.MeshStandardMaterial({
        color: 0xFF0066, // Pinkish-red
        metalness: 0.5,
        roughness: 0.2
    });

    const textMesh2 = new THREE.Mesh(textGeometry2,textMaterial2);
    textMesh2.scale.set(1, 1, 0.005); // Reduces depth (Z-axis)
    textMesh2.position.set(-7, -2, 0);
    scene.add(textMesh2);

    
});


// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate all cubes
    cubes.forEach((cube) => {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
    });

    renderer.render(scene, camera);
}


// Move camera back to see the cube
camera.position.z = 10;

animate();

// Handle window resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
