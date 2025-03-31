// Game state
let money = 0;
let pizzaProductionRate = 1;
let isGameOver = false;
let isGameStarted = false;
let upgrades = {
    oven: { level: 0, cost: 50, productionMultiplier: 2, maxLevel: 9 },
    workers: { level: 0, cost: 100, productionMultiplier: 1.5, maxLevel: 4 },
    ingredients: { level: 0, cost: 75, productionMultiplier: 1.8, maxLevel: 10 }
};

// Cutscene state
let isCutscenePlaying = false;
let cutsceneTime = 0;
let moneyParticles = [];
let businessmanModel = null;
let cutscenePlayerModel = null;

// Order system
let currentOrder = null;
let hasPizza = false;
let pizzaModels = []; // Array to store multiple pizza models
let pizzaBakingTime = 0;
const PIZZA_BAKE_TIME = 3; // seconds
let isBaking = false;
let orderCooldown = 0;
let customerModel = null;

// Player state
const player = {
    speed: 0.1,
    position: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Euler(0, 0, 0)
};

// Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Create pizza model
function createPizza() {
    const pizzaGroup = new THREE.Group();
    
    // Pizza base
    const baseGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 32);
    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0xDEB887 });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    pizzaGroup.add(base);
    
    // Cheese
    const cheeseGeometry = new THREE.CylinderGeometry(0.45, 0.45, 0.11, 32);
    const cheeseMaterial = new THREE.MeshStandardMaterial({ color: 0xFFD700 });
    const cheese = new THREE.Mesh(cheeseGeometry, cheeseMaterial);
    pizzaGroup.add(cheese);
    
    return pizzaGroup;
}

// Create cashier table
function createCashierTable() {
    const tableGroup = new THREE.Group();
    
    // Table top
    const topGeometry = new THREE.BoxGeometry(2, 0.1, 1);
    const topMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const top = new THREE.Mesh(topGeometry, topMaterial);
    top.position.y = 1;
    tableGroup.add(top);
    
    // Table legs
    const legGeometry = new THREE.BoxGeometry(0.1, 2, 0.1);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    
    const leg1 = new THREE.Mesh(legGeometry, legMaterial);
    leg1.position.set(-0.9, 0, -0.4);
    tableGroup.add(leg1);
    
    const leg2 = new THREE.Mesh(legGeometry, legMaterial);
    leg2.position.set(0.9, 0, -0.4);
    tableGroup.add(leg2);
    
    const leg3 = new THREE.Mesh(legGeometry, legMaterial);
    leg3.position.set(-0.9, 0, 0.4);
    tableGroup.add(leg3);
    
    const leg4 = new THREE.Mesh(legGeometry, legMaterial);
    leg4.position.set(0.9, 0, 0.4);
    tableGroup.add(leg4);
    
    return tableGroup;
}

// Create oven
function createOven() {
    const ovenGroup = new THREE.Group();
    
    // Oven body
    const bodyGeometry = new THREE.BoxGeometry(2, 1.5, 1);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.75;
    ovenGroup.add(body);
    
    // Oven door
    const doorGeometry = new THREE.BoxGeometry(1.8, 1.3, 0.1);
    const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x696969 });
    const door = new THREE.Mesh(doorGeometry, doorMaterial);
    door.position.set(0, 0.75, 0.5);
    ovenGroup.add(door);
    
    return ovenGroup;
}

// Create player model
function createPlayer() {
    const playerGroup = new THREE.Group();
    
    // Body
    const bodyGeometry = new THREE.BoxGeometry(1, 2, 1);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 1;
    playerGroup.add(body);
    
    // Head
    const headGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 2.5;
    playerGroup.add(head);
    
    // Arms
    const armGeometry = new THREE.BoxGeometry(0.3, 1, 0.3);
    const armMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-0.65, 1.5, 0);
    playerGroup.add(leftArm);
    
    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0.65, 1.5, 0);
    playerGroup.add(rightArm);
    
    // Legs
    const legGeometry = new THREE.BoxGeometry(0.3, 1, 0.3);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    
    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-0.3, 0, 0);
    playerGroup.add(leftLeg);
    
    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.3, 0, 0);
    playerGroup.add(rightLeg);
    
    return playerGroup;
}

const playerModel = createPlayer();
scene.add(playerModel);

// Create customer model
function createCustomer() {
    const customerGroup = new THREE.Group();
    
    // Body
    const bodyGeometry = new THREE.BoxGeometry(1, 2, 1);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 1;
    customerGroup.add(body);
    
    // Head
    const headGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 2.5;
    customerGroup.add(head);
    
    // Arms
    const armGeometry = new THREE.BoxGeometry(0.3, 1, 0.3);
    const armMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-0.65, 1.5, 0);
    customerGroup.add(leftArm);
    
    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0.65, 1.5, 0);
    customerGroup.add(rightArm);
    
    // Legs
    const legGeometry = new THREE.BoxGeometry(0.3, 1, 0.3);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    
    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-0.3, 0, 0);
    customerGroup.add(leftLeg);
    
    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.3, 0, 0);
    customerGroup.add(rightLeg);
    
    return customerGroup;
}

// Create and position cashier table
const cashierTable = createCashierTable();
cashierTable.position.set(8, 0, -5);
scene.add(cashierTable);

// Create and position customer
customerModel = createCustomer();
customerModel.position.set(8, 0, -6); // Position behind the table
customerModel.visible = true; // Start visible since order is collectable
scene.add(customerModel);

// Create and position oven
const oven = createOven();
oven.position.set(-8, 0, -2);
scene.add(oven);

// Camera position
camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

// Create factory floor
const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floorMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x8B4513,  // Saddle brown color
    roughness: 0.8,   // Make it less shiny
    metalness: 0.1    // Make it less metallic
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// Create walls
const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc });
const backWall = new THREE.Mesh(new THREE.PlaneGeometry(20, 10), wallMaterial);
backWall.position.z = -10;
backWall.position.y = 5;
scene.add(backWall);

const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(20, 10), wallMaterial);
leftWall.position.x = -10;
leftWall.position.y = 5;
leftWall.rotation.y = Math.PI / 2;
scene.add(leftWall);

// Add front and right walls
const frontWall = new THREE.Mesh(new THREE.PlaneGeometry(20, 10), wallMaterial);
frontWall.position.z = 10;
frontWall.position.y = 5;
frontWall.rotation.y = Math.PI; // Rotate to face inward
scene.add(frontWall);

const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(20, 10), wallMaterial);
rightWall.position.x = 10;
rightWall.position.y = 5;
rightWall.rotation.y = -Math.PI / 2; // Rotate to face inward
scene.add(rightWall);

// Create interactive buttons
const buttonGeometry = new THREE.BoxGeometry(1, 0.2, 1);
const buttonMaterial = new THREE.MeshStandardMaterial({ color: 0x4CAF50 });
const buttons = [];

function createButton(x, y, z, name) {
    const button = new THREE.Mesh(buttonGeometry, buttonMaterial);
    button.position.set(x, y, z);
    button.userData.name = name;
    scene.add(button);
    buttons.push(button);
    return button;
}

// Create upgrade buttons
createButton(-8, 0.1, -8, 'oven');
createButton(-5, 0.1, -8, 'workers');
createButton(-2, 0.1, -8, 'ingredients');

// Raycaster for button interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Add testing mode state
let isTestingMode = false;
const NORMAL_SPEED = 0.1;
const TESTING_SPEED = 0.2;
const NORMAL_COOLDOWN = 2 + Math.random() * 3; // Original cooldown time
const TESTING_COOLDOWN = 0.1; // Testing mode cooldown time

// Keyboard controls
const keys = {
    w: false,
    a: false,
    s: false,
    d: false
};

window.addEventListener('keydown', (event) => {
    if (keys.hasOwnProperty(event.key)) {
        keys[event.key] = true;
    }
});

window.addEventListener('keyup', (event) => {
    if (keys.hasOwnProperty(event.key)) {
        keys[event.key] = false;
    }
});

// Event listeners
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Add worker models array
let workerModels = [];

// Create dishwasher model
function createDishwasher() {
    const dishwasherGroup = new THREE.Group();
    
    // Main body
    const bodyGeometry = new THREE.BoxGeometry(1.5, 1.2, 0.8);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.6;
    dishwasherGroup.add(body);
    
    // Door
    const doorGeometry = new THREE.BoxGeometry(1.3, 1, 0.1);
    const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x696969 });
    const door = new THREE.Mesh(doorGeometry, doorMaterial);
    door.position.set(0, 0.6, 0.4);
    dishwasherGroup.add(door);
    
    // Control panel
    const panelGeometry = new THREE.BoxGeometry(0.3, 0.2, 0.1);
    const panelMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const panel = new THREE.Mesh(panelGeometry, panelMaterial);
    panel.position.set(0, 1.1, 0.4);
    dishwasherGroup.add(panel);
    
    return dishwasherGroup;
}

// Create worker model
function createWorker() {
    const workerGroup = new THREE.Group();
    
    // Body
    const bodyGeometry = new THREE.BoxGeometry(1, 2, 1);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xFFA500 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 1;
    workerGroup.add(body);
    
    // Head
    const headGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0xFFA500 });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 2.5;
    workerGroup.add(head);
    
    // Arms
    const armGeometry = new THREE.BoxGeometry(0.3, 1, 0.3);
    const armMaterial = new THREE.MeshStandardMaterial({ color: 0xFFA500 });
    
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-0.65, 1.5, 0);
    workerGroup.add(leftArm);
    
    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0.65, 1.5, 0);
    workerGroup.add(rightArm);
    
    // Legs
    const legGeometry = new THREE.BoxGeometry(0.3, 1, 0.3);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0xFFA500 });
    
    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-0.3, 0, 0);
    workerGroup.add(leftLeg);
    
    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.3, 0, 0);
    workerGroup.add(rightLeg);
    
    return workerGroup;
}

// Create and position dishwashers
const dishwashers = [];
const dishwasherPositions = [
    { x: -6, z: 5 },
    { x: -2, z: 5 },
    { x: 2, z: 5 },
    { x: 6, z: 5 }
];

dishwasherPositions.forEach(pos => {
    const dishwasher = createDishwasher();
    dishwasher.position.set(pos.x, 0, pos.z);
    scene.add(dishwasher);
    dishwashers.push(dishwasher);
});

// Modify purchaseUpgrade function to handle worker spawning
function purchaseUpgrade(upgradeName) {
    const upgrade = upgrades[upgradeName];
    if (money >= upgrade.cost && upgrade.level < upgrade.maxLevel) {
        money -= upgrade.cost;
        upgrade.level++;
        upgrade.cost = Math.floor(upgrade.cost * 1.5);
        pizzaProductionRate *= upgrade.productionMultiplier;
        
        // Handle worker spawning
        if (upgradeName === 'workers') {
            const newWorker = createWorker();
            const dishwasherIndex = upgrade.level - 1; // -1 because level starts at 0
            if (dishwasherIndex < dishwashers.length) {
                const dishwasher = dishwashers[dishwasherIndex];
                newWorker.position.set(
                    dishwasher.position.x,
                    0,
                    dishwasher.position.z - 1 // Position behind the dishwasher
                );
                scene.add(newWorker);
                workerModels.push(newWorker);
            }
        }
        
        updateUI();
    }
}

function generateOrder() {
    const orderTypes = ['Margherita', 'Pepperoni', 'Cheese'];
    const randomOrder = orderTypes[Math.floor(Math.random() * orderTypes.length)];
    const baseReward = 10 + Math.floor(Math.random() * 10);
    // Increase reward based on oven level (10% increase per level)
    const ovenMultiplier = 1 + (upgrades.oven.level * 0.1);
    // Increase base reward based on ingredients level (15% increase per level)
    const ingredientsMultiplier = 1 + (upgrades.ingredients.level * 0.15);
    // Multiply reward by number of pizzas being made
    const numPizzas = Math.max(1, upgrades.oven.level + 1);
    return {
        type: randomOrder,
        reward: Math.floor(baseReward * ovenMultiplier * ingredientsMultiplier * numPizzas)
    };
}

function startOrderCooldown() {
    orderCooldown = 2 + Math.random() * 3;
    customerModel.visible = false;
}

function checkInteraction() {
    const playerPos = playerModel.position;
    
    // Check oven interaction
    const ovenPos = oven.position;
    const ovenDistance = playerPos.distanceTo(ovenPos);
    if (ovenDistance < 2 && currentOrder && !hasPizza && !isBaking) {
        isBaking = true;
        pizzaBakingTime = 0;
        updateUI();
    }
    
    // Check cashier table interaction
    const cashierPos = cashierTable.position;
    const cashierDistance = playerPos.distanceTo(cashierPos);
    if (cashierDistance < 2) {
        if (hasPizza && currentOrder) {
            // Complete order
            money += currentOrder.reward;
            hasPizza = false;
            currentOrder = null;
            isBaking = false;
            // Remove all pizza models
            pizzaModels.forEach(pizza => scene.remove(pizza));
            pizzaModels = [];
            startOrderCooldown();
            updateUI();
        } else if (!currentOrder && !hasPizza && orderCooldown <= 0) {
            // Get new order
            currentOrder = generateOrder();
            updateUI();
        }
    }

    // Check button interactions
    buttons.forEach(button => {
        const buttonPos = button.position;
        const buttonDistance = playerPos.distanceTo(buttonPos);
        if (buttonDistance < 1.5) { // Slightly larger interaction radius for buttons
            const upgradeName = button.userData.name;
            purchaseUpgrade(upgradeName);
        }
    });
}

// Add UI button references
const uiButtons = {};

function updateUI() {
    document.getElementById('money-amount').textContent = money.toFixed(2);
    const upgradesDiv = document.getElementById('upgrades');
    
    // Clear only the content, not the buttons
    upgradesDiv.innerHTML = '';
    
    // Display current order
    if (currentOrder) {
        const orderText = document.createElement('div');
        orderText.style.color = 'white';
        orderText.style.marginBottom = '10px';
        orderText.textContent = `Current Order: ${currentOrder.type} (Reward: $${currentOrder.reward})`;
        upgradesDiv.appendChild(orderText);
    }
    
    // Display upgrade buttons
    for (const [name, upgrade] of Object.entries(upgrades)) {
        // Create or update button
        if (!uiButtons[name]) {
            const button = document.createElement('button');
            button.className = 'upgrade-button';
            button.onclick = () => purchaseUpgrade(name);
            uiButtons[name] = button;
        }
        
        // Update button text
        const maxLevelText = upgrade.level >= upgrade.maxLevel ? ' (MAX)' : '';
        uiButtons[name].textContent = `${name.charAt(0).toUpperCase() + name.slice(1)} (Level ${upgrade.level}/${upgrade.maxLevel})${maxLevelText} - $${upgrade.cost}`;
        
        // Add button to UI if not already added
        if (!uiButtons[name].parentNode) {
            upgradesDiv.appendChild(uiButtons[name]);
        }
    }
}

// Add collision detection
function checkCollision(newX, newZ) {
    const playerRadius = 0.5; // Half the player's width
    const wallPositions = [
        { x: -10, z: -10, width: 20, depth: 0.1 }, // Back wall
        { x: -10, z: -10, width: 0.1, depth: 20 }, // Left wall
        { x: 10, z: -10, width: 20, depth: 0.1 },  // Front wall
        { x: -10, z: 10, width: 0.1, depth: 20 }   // Right wall
    ];

    for (const wall of wallPositions) {
        // Check if player's new position would intersect with any wall
        if (newX + playerRadius > wall.x && 
            newX - playerRadius < wall.x + wall.width &&
            newZ + playerRadius > wall.z && 
            newZ - playerRadius < wall.z + wall.depth) {
            return true; // Collision detected
        }
    }
    return false; // No collision
}

function updatePlayerMovement() {
    // Calculate movement direction
    const moveX = (keys.d ? 1 : 0) - (keys.a ? 1 : 0);
    const moveZ = (keys.s ? 1 : 0) - (keys.w ? 1 : 0);
    
    // Normalize diagonal movement
    let newX = player.position.x;
    let newZ = player.position.z;
    
    if (moveX !== 0 && moveZ !== 0) {
        const length = Math.sqrt(moveX * moveX + moveZ * moveZ);
        newX += (moveX / length) * player.speed;
        newZ += (moveZ / length) * player.speed;
    } else {
        newX += moveX * player.speed;
        newZ += moveZ * player.speed;
    }
    
    // Check for collisions before updating position
    if (!checkCollision(newX, newZ)) {
        player.position.x = newX;
        player.position.z = newZ;
        playerModel.position.copy(player.position);
        
        // Rotate player model based on movement direction
        if (moveX !== 0 || moveZ !== 0) {
            playerModel.rotation.y = Math.atan2(moveX, moveZ);
        }
    }
}

// Create businessman model
function createBusinessman() {
    const businessmanGroup = new THREE.Group();
    
    // Body (suit)
    const bodyGeometry = new THREE.BoxGeometry(1, 2, 1);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x000080 }); // Navy blue suit
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 1;
    businessmanGroup.add(body);
    
    // Head
    const headGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0xFFD700 }); // Gold color for head
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 2.5;
    businessmanGroup.add(head);
    
    // Tie
    const tieGeometry = new THREE.BoxGeometry(0.2, 0.8, 0.1);
    const tieMaterial = new THREE.MeshStandardMaterial({ color: 0xFF0000 }); // Red tie
    const tie = new THREE.Mesh(tieGeometry, tieMaterial);
    tie.position.set(0, 1.2, 0.5);
    businessmanGroup.add(tie);
    
    // Briefcase
    const briefcaseGeometry = new THREE.BoxGeometry(0.6, 0.4, 0.3);
    const briefcaseMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 }); // Brown briefcase
    const briefcase = new THREE.Mesh(briefcaseGeometry, briefcaseMaterial);
    briefcase.position.set(0.5, 0.2, 0);
    businessmanGroup.add(briefcase);
    
    return businessmanGroup;
}

// Create cutscene player model (similar to regular player but with different color)
function createCutscenePlayer() {
    const playerGroup = new THREE.Group();
    
    // Body
    const bodyGeometry = new THREE.BoxGeometry(1, 2, 1);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 1;
    playerGroup.add(body);
    
    // Head
    const headGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 2.5;
    playerGroup.add(head);
    
    // Arms
    const armGeometry = new THREE.BoxGeometry(0.3, 1, 0.3);
    const armMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-0.65, 1.5, 0);
    playerGroup.add(leftArm);
    
    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0.65, 1.5, 0);
    playerGroup.add(rightArm);
    
    // Legs
    const legGeometry = new THREE.BoxGeometry(0.3, 1, 0.3);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    
    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-0.3, 0, 0);
    playerGroup.add(leftLeg);
    
    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.3, 0, 0);
    playerGroup.add(rightLeg);
    
    return playerGroup;
}

// Create money particle
function createMoneyParticle() {
    const geometry = new THREE.PlaneGeometry(0.5, 0.2);
    const material = new THREE.MeshStandardMaterial({ 
        color: 0x00FF00,
        side: THREE.DoubleSide
    });
    const money = new THREE.Mesh(geometry, material);
    money.rotation.x = Math.PI / 2;
    return money;
}

// Check if all upgrades are maxed
function checkAllUpgradesMaxed() {
    return Object.values(upgrades).every(upgrade => upgrade.level >= upgrade.maxLevel);
}

// Start cutscene
function startCutscene() {
    isCutscenePlaying = true;
    cutsceneTime = 0;
    
    // Create cutscene models
    businessmanModel = createBusinessman();
    cutscenePlayerModel = createCutscenePlayer();
    
    // Position models far outside the factory
    businessmanModel.position.set(45, 0, 0);
    cutscenePlayerModel.position.set(40, 0, 0);
    
    // Make player face the businessman (rotate to face positive x-axis)
    cutscenePlayerModel.rotation.y = -Math.PI / 2;
    
    // Make businessman face the player (rotate to face negative x-axis)
    businessmanModel.rotation.y = -Math.PI / 2;
    
    // Add models to scene
    scene.add(businessmanModel);
    scene.add(cutscenePlayerModel);
    
    // Move camera to cutscene position (further away)
    camera.position.set(42, 5, 10);
    camera.lookAt(42, 0, 0);
    
    // Hide factory models
    scene.remove(playerModel);
    scene.remove(customerModel);
    scene.remove(cashierTable);
    scene.remove(oven);
    buttons.forEach(button => scene.remove(button));
    workerModels.forEach(worker => scene.remove(worker));
    dishwashers.forEach(dishwasher => scene.remove(dishwasher));
}

// Update cutscene
function updateCutscene() {
    cutsceneTime += 1/60; // Assuming 60 FPS
    
    // Animate businessman walking towards player
    if (cutsceneTime < 2) {
        // Move from x=45 to x=42 (stopping 2 units away from player at x=40)
        businessmanModel.position.x = 45 - (cutsceneTime * 1.5);
    }
    
    // Start money rain after businessman reaches player
    if (cutsceneTime > 2) {
        // Make both characters face the fourth wall (positive z-axis)
        businessmanModel.rotation.y = 0;
        cutscenePlayerModel.rotation.y = 0;
        
        // Create new money particles
        if (Math.random() < 0.3) { // 30% chance each frame
            const money = createMoneyParticle();
            money.position.set(
                40 + (Math.random() - 0.5) * 10,
                15,
                (Math.random() - 0.5) * 10
            );
            money.userData.velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 0.2,
                -0.5,
                (Math.random() - 0.5) * 0.2
            );
            scene.add(money);
            moneyParticles.push(money);
        }
        
        // Update money particles
        moneyParticles.forEach((money, index) => {
            money.position.add(money.userData.velocity);
            money.rotation.z += 0.1;
            
            // Remove particles that have fallen below ground
            if (money.position.y < -5) {
                scene.remove(money);
                moneyParticles.splice(index, 1);
            }
        });
    }

    // End game after 10 seconds
    if (cutsceneTime > 10) {
        isGameOver = true;
        // Create game over text
        const gameOverDiv = document.createElement('div');
        gameOverDiv.style.position = 'absolute';
        gameOverDiv.style.top = '50%';
        gameOverDiv.style.left = '50%';
        gameOverDiv.style.transform = 'translate(-50%, -50%)';
        gameOverDiv.style.color = 'white';
        gameOverDiv.style.fontSize = '48px';
        gameOverDiv.style.fontFamily = 'Arial, sans-serif';
        gameOverDiv.style.textAlign = 'center';
        gameOverDiv.style.textShadow = '2px 2px 4px rgba(0,0,0,0.5)';
        gameOverDiv.innerHTML = 'Game Over!<br>Your pizza place was bought out by a corporation,<br>and now you\'re rich for life!';
        document.body.appendChild(gameOverDiv);
    }
}

// Create title screen
function createTitleScreen() {
    const titleDiv = document.createElement('div');
    titleDiv.style.position = 'absolute';
    titleDiv.style.top = '0';
    titleDiv.style.left = '0';
    titleDiv.style.width = '100%';
    titleDiv.style.height = '100%';
    titleDiv.style.display = 'flex';
    titleDiv.style.flexDirection = 'column';
    titleDiv.style.justifyContent = 'center';
    titleDiv.style.alignItems = 'center';
    titleDiv.style.zIndex = '1000';

    // Create title screen scene
    const titleScene = new THREE.Scene();
    titleScene.background = new THREE.Color(0x000000); // Black background
    const titleCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const titleRenderer = new THREE.WebGLRenderer({ alpha: true });
    titleRenderer.setSize(window.innerWidth, window.innerHeight);
    titleRenderer.domElement.style.position = 'absolute';
    titleRenderer.domElement.style.top = '0';
    titleRenderer.domElement.style.left = '0';
    titleRenderer.domElement.style.zIndex = '1';
    titleDiv.appendChild(titleRenderer.domElement);

    // Add lighting
    const titleAmbientLight = new THREE.AmbientLight(0xffffff, 0.5);
    titleScene.add(titleAmbientLight);
    const titleDirectionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    titleDirectionalLight.position.set(5, 5, 5);
    titleScene.add(titleDirectionalLight);

    // Position camera
    titleCamera.position.set(0, 5, 15);
    titleCamera.lookAt(0, 0, 0);

    // Create falling pizzas
    const fallingPizzas = [];
    const numPizzas = 20;
    const pizzaArea = 20; // Area where pizzas can fall

    for (let i = 0; i < numPizzas; i++) {
        const pizza = createPizza();
        // Randomize initial height between 10 and 20
        const initialHeight = 10 + Math.random() * 10;
        // Randomize initial x and z positions
        pizza.position.set(
            (Math.random() - 0.5) * pizzaArea,
            initialHeight,
            (Math.random() - 0.5) * pizzaArea
        );
        // Randomize fall speed between 0.2 and 0.4
        const fallSpeed = 0.2 + Math.random() * 0.2;
        pizza.userData.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 0.1, // Reduced horizontal movement
            -fallSpeed,
            (Math.random() - 0.5) * 0.1  // Reduced horizontal movement
        );
        // Randomize rotation speed
        pizza.userData.rotationSpeed = (Math.random() - 0.5) * 0.05;
        titleScene.add(pizza);
        fallingPizzas.push(pizza);
    }

    // Add a semi-transparent overlay
    const overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
    overlay.style.zIndex = '2';
    titleDiv.appendChild(overlay);

    // Create content container
    const contentDiv = document.createElement('div');
    contentDiv.style.position = 'absolute';
    contentDiv.style.top = '50%';
    contentDiv.style.left = '50%';
    contentDiv.style.transform = 'translate(-50%, -50%)';
    contentDiv.style.zIndex = '3';
    contentDiv.style.textAlign = 'center';

    // Title text
    const titleText = document.createElement('div');
    titleText.style.color = 'white';
    titleText.style.fontSize = '72px';
    titleText.style.fontFamily = 'Arial, sans-serif';
    titleText.style.textAlign = 'center';
    titleText.style.marginBottom = '40px';
    titleText.style.textShadow = '2px 2px 4px rgba(0,0,0,0.5)';
    titleText.textContent = 'Pizza Restaurant Tycoon';
    contentDiv.appendChild(titleText);

    // Start button
    const startButton = document.createElement('button');
    startButton.style.padding = '15px 40px';
    startButton.style.fontSize = '24px';
    startButton.style.backgroundColor = '#4CAF50';
    startButton.style.color = 'white';
    startButton.style.border = 'none';
    startButton.style.borderRadius = '5px';
    startButton.style.cursor = 'pointer';
    startButton.style.transition = 'all 0.3s';
    startButton.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    startButton.textContent = 'Start Game';
    
    // Button hover effect
    startButton.onmouseover = () => {
        startButton.style.backgroundColor = '#45a049';
        startButton.style.transform = 'translateY(-2px)';
        startButton.style.boxShadow = '0 6px 8px rgba(0,0,0,0.2)';
    };
    startButton.onmouseout = () => {
        startButton.style.backgroundColor = '#4CAF50';
        startButton.style.transform = 'translateY(0)';
        startButton.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    };
    
    // Start game when clicked
    startButton.onclick = () => {
        // Start fade out animation
        let fadeOutTime = 0;
        const fadeOutDuration = 4; // 4 seconds fade out
        
        function fadeOut() {
            fadeOutTime += 1/60; // Assuming 60 FPS
            const opacity = Math.max(0, 1 - (fadeOutTime / fadeOutDuration));
            
            // Update pizza materials opacity
            fallingPizzas.forEach(pizza => {
                pizza.children.forEach(child => {
                    if (child.material) {
                        child.material.opacity = opacity;
                    }
                });
            });
            
            // Update overlay opacity
            overlay.style.backgroundColor = `rgba(0, 0, 0, ${0.4 + (1 - opacity) * 0.6})`;
            
            if (fadeOutTime < fadeOutDuration) {
                requestAnimationFrame(fadeOut);
            } else {
                // After fade out, start the game
                titleDiv.style.display = 'none';
                isGameStarted = true;
                animate();
            }
        }
        
        fadeOut();
    };
    
    contentDiv.appendChild(startButton);
    titleDiv.appendChild(contentDiv);
    document.body.appendChild(titleDiv);

    // Animate title screen
    function animateTitle() {
        requestAnimationFrame(animateTitle);

        // Update falling pizzas
        fallingPizzas.forEach((pizza, index) => {
            pizza.position.add(pizza.userData.velocity);
            pizza.rotation.y += pizza.userData.rotationSpeed;
            
            // Reset pizza position when it falls below ground
            if (pizza.position.y < -5) {
                // Randomize new height between 10 and 20
                const newHeight = 10 + Math.random() * 10;
                pizza.position.set(
                    (Math.random() - 0.5) * pizzaArea,
                    newHeight,
                    (Math.random() - 0.5) * pizzaArea
                );
                // Randomize new fall speed between 0.2 and 0.4
                const newFallSpeed = 0.2 + Math.random() * 0.2;
                pizza.userData.velocity.set(
                    (Math.random() - 0.5) * 0.1,
                    -newFallSpeed,
                    (Math.random() - 0.5) * 0.1
                );
            }
        });

        titleRenderer.render(titleScene, titleCamera);
    }

    animateTitle();
}

// Modify the game loop to include game start state
function animate() {
    if (!isGameStarted) {
        return;
    }

    if (isGameOver) {
        renderer.render(scene, camera);
        return;
    }

    requestAnimationFrame(animate);

    // Check if all upgrades are maxed and start cutscene
    if (!isCutscenePlaying && checkAllUpgradesMaxed()) {
        startCutscene();
    }

    if (isCutscenePlaying) {
        updateCutscene();
    } else {
        // Regular game loop code
        // Update order cooldown
        if (orderCooldown > 0) {
            orderCooldown -= 1/60; // Assuming 60 FPS
            if (orderCooldown <= 0) {
                customerModel.visible = true;
            }
        }

        // Update customer visibility based on order state
        if (currentOrder) {
            customerModel.visible = true;
        }

        // Update pizza baking time
        if (isBaking && !hasPizza) {
            // Calculate baking speed based on worker level
            let bakingSpeed;
            if (upgrades.workers.level >= upgrades.workers.maxLevel) {
                bakingSpeed = 30; // 0.1 seconds when maxed out
            } else {
                bakingSpeed = 1 + (upgrades.workers.level * 0.2); // 20% faster per level
            }
            pizzaBakingTime += (1/60) * bakingSpeed; // Assuming 60 FPS
            if (pizzaBakingTime >= PIZZA_BAKE_TIME) {
                hasPizza = true;
                // Create pizzas based on oven level (1 pizza per level)
                const numPizzas = Math.max(1, upgrades.oven.level + 1);
                for (let i = 0; i < numPizzas; i++) {
                    const pizza = createPizza();
                    scene.add(pizza);
                    pizzaModels.push(pizza);
                }
            }
        }

        // Update pizza positions if player has pizzas
        if (hasPizza && pizzaModels.length > 0) {
            pizzaModels.forEach((pizza, index) => {
                pizza.position.copy(playerModel.position);
                // Stack pizzas on top of each other
                pizza.position.y = 3.5 + (index * 0.2); // Each pizza slightly higher than the previous
                pizza.rotation.y = playerModel.rotation.y; // Match player's rotation
            });
        }

        // Check for interactions
        checkInteraction();

        // Update player movement
        updatePlayerMovement();

        // Rotate buttons slightly for visual feedback
        buttons.forEach(button => {
            button.rotation.y += 0.01;
        });

        updateUI();
    }

    renderer.render(scene, camera);
}

// Initialize the game
createTitleScreen();
// Don't start the animation loop immediately
// animate(); // Remove this line 