import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add lighting
const light = new THREE.PointLight(0xffffff, 2, 100);
light.position.set(2, 3, 2);
scene.add(light);

// Ambient light for better visibility
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// Create floor
const floorGeometry = new THREE.PlaneGeometry(5, 5);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// Create walls
const wallGeometry = new THREE.PlaneGeometry(5, 3);
const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide });

// Back Wall
const backWall = new THREE.Mesh(wallGeometry, wallMaterial);
backWall.position.set(0, 1.5, -2.5);
scene.add(backWall);

// Left Wall
const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
leftWall.rotation.y = Math.PI / 2;
leftWall.position.set(-2.5, 1.5, 0);
scene.add(leftWall);

// Create a production table
function createTable() {
  const tableGroup = new THREE.Group();
  
  // Table top
  const tableTopGeometry = new THREE.BoxGeometry(2, 0.1, 1);
  const tableTopMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 }); // Brown wood color
  const tableTop = new THREE.Mesh(tableTopGeometry, tableTopMaterial);
  tableTop.position.y = 0.75; // Table height
  tableGroup.add(tableTop);
  
  // Table legs
  const legGeometry = new THREE.BoxGeometry(0.1, 0.75, 0.1);
  const legMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
  
  // Add four legs at the corners
  const positions = [
    { x: 0.9, z: 0.4 },
    { x: 0.9, z: -0.4 },
    { x: -0.9, z: 0.4 },
    { x: -0.9, z: -0.4 }
  ];
  
  positions.forEach(pos => {
    const leg = new THREE.Mesh(legGeometry, legMaterial);
    leg.position.set(pos.x, 0.375, pos.z); // Position the leg
    tableGroup.add(leg);
  });
  
  // Position the table in the room
  tableGroup.position.set(0, 0, 0);
  
  return tableGroup;
}

// Create production-related items for the table
function createProductionItems() {
  const itemsGroup = new THREE.Group();
  
  // Create a simple conveyor belt on the table
  const conveyorGeometry = new THREE.BoxGeometry(1.5, 0.05, 0.4);
  const conveyorMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
  const conveyor = new THREE.Mesh(conveyorGeometry, conveyorMaterial);
  conveyor.position.set(0, 0.825, 0);
  itemsGroup.add(conveyor);
  
  // Add rollers to the conveyor
  for (let i = -0.6; i <= 0.6; i += 0.2) {
    const rollerGeometry = new THREE.CylinderGeometry(0.025, 0.025, 0.4, 16);
    const rollerMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const roller = new THREE.Mesh(rollerGeometry, rollerMaterial);
    roller.rotation.z = Math.PI / 2;
    roller.position.set(i, 0.825, 0);
    itemsGroup.add(roller);
  }
  
  // Add some products/items on the conveyor
  const colors = [0xff0000, 0x00ff00, 0x0000ff];
  for (let i = -0.5; i <= 0.5; i += 0.5) {
    const itemGeometry = new THREE.BoxGeometry(0.15, 0.1, 0.15);
    const itemMaterial = new THREE.MeshStandardMaterial({ color: colors[Math.floor(Math.random() * colors.length)] });
    const item = new THREE.Mesh(itemGeometry, itemMaterial);
    item.position.set(i, 0.9, 0);
    itemsGroup.add(item);
  }
  
  // Add a small control panel
  const panelGeometry = new THREE.BoxGeometry(0.2, 0.1, 0.15);
  const panelMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
  const panel = new THREE.Mesh(panelGeometry, panelMaterial);
  panel.position.set(0.8, 0.85, 0.3);
  itemsGroup.add(panel);
  
  // Add buttons to the panel
  const buttonGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.02, 16);
  const buttonMaterials = [
    new THREE.MeshStandardMaterial({ color: 0xff0000 }),
    new THREE.MeshStandardMaterial({ color: 0x00ff00 })
  ];
  
  for (let i = 0; i < 2; i++) {
    const button = new THREE.Mesh(buttonGeometry, buttonMaterials[i]);
    button.rotation.x = Math.PI / 2;
    button.position.set(0.75 + i * 0.1, 0.91, 0.3);
    itemsGroup.add(button);
  }
  
  return itemsGroup;
}

// Create pipes along the wall
function createPipes() {
  const pipesGroup = new THREE.Group();
  
  // Create main horizontal pipe along the back wall
  const mainPipeGeometry = new THREE.CylinderGeometry(0.05, 0.05, 4, 16);
  const pipeMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
  const mainPipe = new THREE.Mesh(mainPipeGeometry, pipeMaterial);
  mainPipe.rotation.z = Math.PI / 2;
  mainPipe.position.set(0, 2.5, -2.4);
  pipesGroup.add(mainPipe);
  
  // Create vertical pipes coming down from the main pipe
  for (let i = -1.5; i <= 1.5; i += 1) {
    const verticalPipeGeometry = new THREE.CylinderGeometry(0.03, 0.03, 1, 16);
    const verticalPipe = new THREE.Mesh(verticalPipeGeometry, pipeMaterial);
    verticalPipe.position.set(i, 2, -2.4);
    pipesGroup.add(verticalPipe);
    
    // Add a valve to some of the pipes
    if (i % 2 === 0) {
      const valveGeometry = new THREE.TorusGeometry(0.08, 0.02, 16, 16);
      const valveMaterial = new THREE.MeshStandardMaterial({ color: 0xaa0000 });
      const valve = new THREE.Mesh(valveGeometry, valveMaterial);
      valve.rotation.x = Math.PI / 2;
      valve.position.set(i, 1.7, -2.3);
      pipesGroup.add(valve);
    }
  }
  
  // Create a horizontal pipe along the left wall
  const leftWallPipeGeometry = new THREE.CylinderGeometry(0.05, 0.05, 4, 16);
  const leftWallPipe = new THREE.Mesh(leftWallPipeGeometry, pipeMaterial);
  leftWallPipe.rotation.z = Math.PI / 2;
  leftWallPipe.rotation.y = Math.PI / 2;
  leftWallPipe.position.set(-2.4, 1.8, 0);
  pipesGroup.add(leftWallPipe);
  
  // Add some pipe junctions
  for (let i = -1.5; i <= 1.5; i += 1.5) {
    const junctionGeometry = new THREE.SphereGeometry(0.07, 16, 16);
    const junctionMaterial = new THREE.MeshStandardMaterial({ color: 0x777777 });
    const junction = new THREE.Mesh(junctionGeometry, junctionMaterial);
    junction.position.set(i, 2.5, -2.4);
    pipesGroup.add(junction);
  }
  
  return pipesGroup;
}

// Create ruler and measurement tools
function createMeasurementTools() {
  const toolsGroup = new THREE.Group();
  
  // Create a ruler on the table
  const rulerGeometry = new THREE.BoxGeometry(1.2, 0.01, 0.05);
  const rulerMaterial = new THREE.MeshStandardMaterial({ color: 0xffffdd });
  const ruler = new THREE.Mesh(rulerGeometry, rulerMaterial);
  ruler.position.set(0, 0.81, -0.3);
  toolsGroup.add(ruler);
  
  // Add markings to the ruler
  for (let i = -0.55; i <= 0.55; i += 0.1) {
    const markGeometry = new THREE.BoxGeometry(0.01, 0.015, 0.05);
    const markMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const mark = new THREE.Mesh(markGeometry, markMaterial);
    mark.position.set(i, 0.82, -0.3);
    toolsGroup.add(mark);
  }
  
  // Add a caliper
  const caliperBaseGeometry = new THREE.BoxGeometry(0.3, 0.02, 0.07);
  const caliperMaterial = new THREE.MeshStandardMaterial({ color: 0xdddddd });
  const caliperBase = new THREE.Mesh(caliperBaseGeometry, caliperMaterial);
  caliperBase.position.set(-0.7, 0.81, 0.3);
  toolsGroup.add(caliperBase);
  
  // Caliper jaws
  const jawGeometry = new THREE.BoxGeometry(0.07, 0.04, 0.03);
  const jaw1 = new THREE.Mesh(jawGeometry, caliperMaterial);
  jaw1.position.set(-0.82, 0.83, 0.3);
  toolsGroup.add(jaw1);
  
  const jaw2 = new THREE.Mesh(jawGeometry, caliperMaterial);
  jaw2.position.set(-0.58, 0.83, 0.3);
  toolsGroup.add(jaw2);
  
  return toolsGroup;
}

// Create additional industrial elements
function createIndustrialElements() {
  const industrialGroup = new THREE.Group();
  
  // Add a small machine on the side of the table
  const machineBaseGeometry = new THREE.BoxGeometry(0.4, 0.3, 0.3);
  const machineMaterial = new THREE.MeshStandardMaterial({ color: 0x336699 });
  const machineBase = new THREE.Mesh(machineBaseGeometry, machineMaterial);
  machineBase.position.set(-0.7, 0.95, -0.1);
  industrialGroup.add(machineBase);
  
  // Add a small display on the machine
  const displayGeometry = new THREE.PlaneGeometry(0.15, 0.08);
  const displayMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 0.5 });
  const display = new THREE.Mesh(displayGeometry, displayMaterial);
  display.position.set(-0.7, 1.05, 0.051);
  display.rotation.y = Math.PI;
  industrialGroup.add(display);
  
  // Add machine buttons
  for (let i = 0; i < 3; i++) {
    const buttonGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.01, 16);
    const buttonMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const button = new THREE.Mesh(buttonGeometry, buttonMaterial);
    button.rotation.x = Math.PI / 2;
    button.position.set(-0.75 + i * 0.05, 0.9, 0.051);
    industrialGroup.add(button);
  }
  
  // Add a small ventilation fan
  const fanHubGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.02, 16);
  const fanHub = new THREE.Mesh(fanHubGeometry, new THREE.MeshStandardMaterial({ color: 0x222222 }));
  fanHub.rotation.x = Math.PI / 2;
  fanHub.position.set(-0.55, 1.05, -0.15);
  industrialGroup.add(fanHub);
  
  // Fan blades
  for (let i = 0; i < 4; i++) {
    const bladeGeometry = new THREE.BoxGeometry(0.08, 0.01, 0.02);
    const bladeMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
    blade.position.set(-0.55, 1.05, -0.15);
    blade.rotation.z = (i * Math.PI) / 2;
    industrialGroup.add(blade);
  }
  
  // Wire conduit along the wall
  const conduitGeometry = new THREE.CylinderGeometry(0.02, 0.02, 3, 8);
  const conduitMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
  const conduit = new THREE.Mesh(conduitGeometry, conduitMaterial);
  conduit.rotation.z = Math.PI / 2;
  conduit.position.set(0, 0.3, -2.45);
  industrialGroup.add(conduit);
  
  // Add some electrical junction boxes
  for (let i = -1; i <= 1; i += 1) {
    const boxGeometry = new THREE.BoxGeometry(0.1, 0.15, 0.05);
    const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x999999 });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.set(i, 0.3, -2.43);
    industrialGroup.add(box);
  }
  
  return industrialGroup;
}

// Create safety equipment
function createSafetyEquipment() {
  const safetyGroup = new THREE.Group();
  
  // Safety warning sign on the wall
  const signGeometry = new THREE.PlaneGeometry(0.4, 0.3);
  const signMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xffff00, 
    side: THREE.DoubleSide
  });
  const sign = new THREE.Mesh(signGeometry, signMaterial);
  sign.position.set(1.5, 1.8, -2.45);
  safetyGroup.add(sign);
  
  // Danger triangle on the sign
  const triangleGeometry = new THREE.BufferGeometry();
  const vertices = new Float32Array([
    -0.1, -0.07, 0.01,
    0.1, -0.07, 0.01,
    0, 0.07, 0.01
  ]);
  triangleGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  const triangleMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const triangle = new THREE.Mesh(triangleGeometry, triangleMaterial);
  triangle.position.set(1.5, 1.8, -2.44);
  safetyGroup.add(triangle);
  
  // Fire extinguisher
  const extinguisherBodyGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.3, 16);
  const extinguisherMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  const extinguisherBody = new THREE.Mesh(extinguisherBodyGeometry, extinguisherMaterial);
  extinguisherBody.position.set(-2.2, 0.5, -2.2);
  safetyGroup.add(extinguisherBody);
  
  // Extinguisher nozzle
  const nozzleGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.1, 8);
  const nozzleMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
  const nozzle = new THREE.Mesh(nozzleGeometry, nozzleMaterial);
  nozzle.rotation.z = Math.PI / 2;
  nozzle.position.set(-2.15, 0.6, -2.2);
  safetyGroup.add(nozzle);
  
  return safetyGroup;
}

// Add the table and production items to the scene
const table = createTable();
scene.add(table);

const productionItems = createProductionItems();
scene.add(productionItems);

// Add pipes to the scene
const pipes = createPipes();
scene.add(pipes);

// Add measurement tools
const measurementTools = createMeasurementTools();
scene.add(measurementTools);

// Add industrial elements
const industrialElements = createIndustrialElements();
scene.add(industrialElements);

// Add safety equipment
const safetyEquipment = createSafetyEquipment();
scene.add(safetyEquipment);

// Animation for the production items
let rollers = [];
for (let i = 0; i < productionItems.children.length; i++) {
  if (productionItems.children[i].geometry && 
      productionItems.children[i].geometry.type === 'CylinderGeometry' &&
      productionItems.children[i].position.y === 0.825) {
    rollers.push(productionItems.children[i]);
  }
}

// Animation for the production items (moving the boxes)
let boxes = [];
for (let i = 0; i < productionItems.children.length; i++) {
  if (productionItems.children[i].geometry && 
      productionItems.children[i].geometry.type === 'BoxGeometry' &&
      productionItems.children[i].position.y === 0.9) {
    boxes.push(productionItems.children[i]);
  }
}

// Find fan blades for animation
let fanBlades = [];
for (let i = 0; i < industrialElements.children.length; i++) {
  if (industrialElements.children[i].geometry && 
      industrialElements.children[i].geometry.type === 'BoxGeometry' &&
      industrialElements.children[i].position.x === -0.55 &&
      industrialElements.children[i].position.y === 1.05) {
    fanBlades.push(industrialElements.children[i]);
  }
}

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);

// Set camera position
camera.position.set(3, 3, 5);
controls.update();

function animate() {
  requestAnimationFrame(animate);
  
  // Rotate the rollers to simulate movement
  rollers.forEach(roller => {
    roller.rotation.x += 0.01;
  });
  
  // Move the boxes along the conveyor
  boxes.forEach(box => {
    box.position.x += 0.005;
    if (box.position.x > 0.7) {
      box.position.x = -0.7;
    }
  });
  
  // Rotate the fan blades
  fanBlades.forEach(blade => {
    blade.rotation.z += 0.05;
  });
  
  renderer.render(scene, camera);
}

animate();