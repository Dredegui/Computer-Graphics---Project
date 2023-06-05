//////////////////////
/* CONSTANTS DUDEERS*/
//////////////////////
const NUM_TREES = 10;
const MOON_LIGHT_INTENSITY = 1;

const SCALE_OVNI = 5;
const SPEED_OVNI = 5;
const SPHERES_OVNI = 4;
const SPHERES_DIST_OVNI = 5;
const OVNI_POINT_LIGHT_INTENSITY = 30;
const OVNI_SPOT_LIGHT_INTENSITY = 0.5;
const OVNI_ROTATION_SPEED = 0.01;

const PHONG = 0;
const TOON = 1;
const LAMBERT = 2;
const BASIC = 3;

//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

// Work variables
var camera, scene, renderer;
var geometry,material,mesh;

// Moon variables
var moon,moonLight;

// Ovni variables 
var ovni;
var ovni_pointLights = [];
var spotLight;
// Default material
var selectedMaterial = BASIC;

var keys = [];
var pressed = [];
var materials = [];
var meshs = [];

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene() {
    'use strict';

    scene = new THREE.Scene();

    //scene.add(new THREE.AxisHelper(10));
    scene.background = new THREE.Color( 0x000000 );
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createCamera(x,y,z) {
    var cam = new THREE.PerspectiveCamera(70,
        window.innerWidth / window.innerHeight,
        1,
        1000);
    cam.position.x = x;
    cam.position.y = y;
    cam.position.z = z;
    cam.lookAt(scene.position);
    return cam;
}


////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

const CUBE = 0; 
const CYLINDER = 1;
const SPHERE = 2;
const ELLIPSOIDE = 3;
const CAP = 4;

function createMaterials(newColor) {
    materials.push([new THREE.MeshPhongMaterial({ color: newColor }),new THREE.MeshToonMaterial({ color: newColor }),
        new THREE.MeshLambertMaterial({ color: newColor }),new THREE.MeshBasicMaterial({color: newColor})]);
    console.log(materials);
}

function addGeneric(obj,x,y,z,type,color,sx,sy,sz) {
    'use strict';

    createMaterials(color);

    if (type == CUBE) {
        geometry = new THREE.CubeGeometry(sx,sy,sz);
        material = materials[materials.length-1][selectedMaterial];
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        obj.add(mesh);
    }

    if (type == CYLINDER) {
        geometry = new THREE.CylinderGeometry(sx,sy,sz, 16);
        material = materials[materials.length-1][selectedMaterial];
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        obj.add(mesh);
    }

    if (type == ELLIPSOIDE) {
        geometry = new THREE.SphereGeometry(sx, 32, 32);

        const positionAttribute = geometry.getAttribute('position');
        const positions = positionAttribute.array;

        for (let i = 0; i < positions.length; i+= 3) {
            positions[i] *= sx / sz;
            positions[i+1] *= sy / sz;
        }

        positionAttribute.needsUpdate = true;

        material = materials[materials.length-1][selectedMaterial];
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x,y,z);
        obj.add(mesh);
    }

    if (type == CAP) {
        geometry = new THREE.SphereGeometry(sx, 32, 32,0,Math.PI * 2,-1.57,3);
        material = materials[materials.length-1][selectedMaterial];
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x,y,z);
        obj.add(mesh);
    }

    if (type == SPHERE) {
        geometry = new THREE.SphereGeometry(sx, 32, 32);
        material = materials[materials.length-1][selectedMaterial];
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x,y,z);
        obj.add(mesh);
    }

    meshs.push(mesh);
    return mesh;
}

function createMoon() {
    var moon = new THREE.Object3D();
    addGeneric(moon,100,200,0,SPHERE,0xffA500,10,3,3);
    moonLight = new THREE.DirectionalLight(0xA0A000,MOON_LIGHT_INTENSITY);
    moonLight.position.set(100,200,0);
    moonLight.target.position.set(1,-1,1);
    moonLight.target.updateMatrixWorld();
    moon.add(moonLight);
    const lightHelper = new THREE.DirectionalLightHelper(moonLight,1);
    moon.add(lightHelper);
    scene.add(moon);
}

function createTree(x,y,z) {
    var tree = new THREE.Object3D();

    addGeneric(tree,0,0,0,CYLINDER,0x993333,5,5,40);
    var side_branch = addGeneric(tree,-5,3,0,CYLINDER,0x993333,3,3,20);
    side_branch.rotation.z = Math.PI / 4;

    addGeneric(tree,0,30,0,ELLIPSOIDE,0x00B020,30,10,30);
    addGeneric(tree,-15,13,0,ELLIPSOIDE,0x00B020,15,5,15);
    
    tree.position.set(x,y,z);

    scene.add(tree);
}

function spawnTrees(){
    for (var i = 0; i < NUM_TREES; i++) {
        createTree(Math.random() * 500 - 100,Math.random() * 20 - 10,Math.random() * 500 - 100);
    }
}


function createOVNI(x,y,z) {
    ovni = new THREE.Object3D();
    addGeneric(ovni,0,0,0,ELLIPSOIDE,0x808080,10*SCALE_OVNI,2*SCALE_OVNI,10*SCALE_OVNI);
    addGeneric(ovni,0,0,0,CAP,0xA0A0A0,7*SCALE_OVNI,-1,-1);
    addGeneric(ovni,0,- 2.2 * SCALE_OVNI,0,CYLINDER,0xAFAFF3,7*SPHERES_DIST_OVNI, 4*SPHERES_DIST_OVNI, 1.5*SCALE_OVNI);

    // Create target
    var target = new THREE.Object3D();
    target.position.set(0,-4*SCALE_OVNI,0);

    // Add spotlight to the cylinder
    spotLight = new THREE.SpotLight(0xffffff, OVNI_SPOT_LIGHT_INTENSITY);
    spotLight.position.set(0,-2*SCALE_OVNI,0);
    spotLight.target = target;
    const spotlightHelper = new THREE.SpotLightHelper(spotLight);
    scene.add(spotlightHelper);
    ovni.add(spotLight);
    ovni.add(target);

    for (let i = 0; i < SPHERES_OVNI; i++) {
        const angle = (i / SPHERES_OVNI) * Math.PI * 2;
        const angx = Math.cos(angle) * SCALE_OVNI * SPHERES_DIST_OVNI;
        const angz = Math.sin(angle) * SCALE_OVNI * SPHERES_DIST_OVNI;
        addGeneric(ovni,angx,-1.6*SCALE_OVNI*1.5,angz,SPHERE,0xC00070,SCALE_OVNI * 0.8,-1,-1);

        const pointLight = new THREE.PointLight(0xC00070, OVNI_POINT_LIGHT_INTENSITY, SCALE_OVNI * 5);
        pointLight.position.set(angx*1.2, -SCALE_OVNI * 4, angz*1.2);
        ovni.add(pointLight);
        ovni_pointLights.push(pointLight);
    }


    ovni.position.set(x,y,z);

    scene.add(ovni);
}

//////////////////////
/* CHECK COLLISIONS */
//////////////////////
function checkCollisions(){
    'use strict';
}

///////////////////////
/* HANDLE COLLISIONS */
///////////////////////
function handleCollisions(){
    'use strict';

}

////////////
/* UPDATE */
////////////


// Q: 81 W: 87 E: 69 R: 82
function checkMaterials() {
    if (keys[81] && !pressed[81]) {
        selectedMaterial = LAMBERT;
        pressed[81] = true;
        return true;
    }
    if (keys[87] && !pressed[87]) {
        selectedMaterial = PHONG;
        pressed[87] = true;
        return true;
    }
    if (keys[69] && !pressed[69]) {
        selectedMaterial = TOON;
        pressed[69] = true;
        return true;
    }
    if (keys[82] && !pressed[82]) {
        selectedMaterial = BASIC;
        pressed[82] = true;
        return true;
    }
    return false;
}

function update(){
    'use strict';

}

/////////////
/* DISPLAY */
/////////////
function render() {
    'use strict';
    renderer.render(scene, camera);
}
////////////////////////////////
/* INITIALIZE ANIMATION CYCLE */
////////////////////////////////

function initKeys() {
    for (i = 0; i < 256; i++) {
        keys[i] = false;
        pressed[i] = false;
    }
}

function createSkydome() {
        // Create a sphere geometry
        var geometry = new THREE.SphereGeometry(700, 32, 32,0,Math.PI * 2,-1.57,3);

        // Load the sky texture
        var textureLoader = new THREE.TextureLoader();
        var texture = textureLoader.load('https://raw.githubusercontent.com/JoseCutileiro/ImageLinks/master/free-sky-texture.jpg');
    
        // Apply the texture to the material
        var material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
    
        // Create the skydome mesh
        var skydome = new THREE.Mesh(geometry, material);

        skydome.position.set(0,-100,0);

        // Add the skydome to your scene
        scene.add(skydome);
}

function createGround() {
    const groundGeo = new THREE.PlaneGeometry(1700, 1700, 100, 100);
    let disMap = new THREE.TextureLoader().load('https://raw.githubusercontent.com/JoseCutileiro/ImageLinks/master/cg/heightmap.png');
    disMap.wrapS = disMap.wrapT = THREE.RepeatWrapping;
    // disMap.repeat.set(sliders.horTexture, sliders.vertTexture);
    const groundMat = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        displacementMap: disMap,
        displacementScale: 500,
        displacementBias: -150,
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    scene.add(groundMesh);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.rotation.y = 0;
}

function createBufferGeometry(tx,ty,tz,sx,sy,sz,color) {
    const geometry = new THREE.BufferGeometry();
    var vertices = [
        // Front face
        -1, -1, 1,
        1, -1, 1,
        1, 1, 1,
        -1, 1, 1,
        // Back face
        -1, -1, -1,
        1, -1, -1,
        1, 1, -1,
        -1, 1, -1
    ];
    var indices = [
        // Front face
        0, 1, 2,
        2, 3, 0,
        // Back face
        4, 5, 6,
        6, 7, 4,
        // Top face
        3, 2, 6,
        6, 7, 3,
        // Bottom face
        0, 1, 5,
        5, 4, 0,
        // Left face
        0, 3, 7,
        7, 4, 0,
        // Right face
        1, 2, 6,
        6, 5, 1
    ];
}

function createHouse() {
    const geometry = new THREE.BufferGeometry();
    var vertices = [
        // Front face
        -1, -1, 1,
        1, -1, 1,
        1, 1, 1,
        -1, 1, 1,
        // Back face
        -1, -1, -1,
        1, -1, -1,
        1, 1, -1,
        -1, 1, -1
    ];
    var indices = [
        // Front face
        0, 1, 2,
        2, 3, 0,
        // Back face
        4, 5, 6,
        6, 7, 4,
        // Top face
        3, 2, 6,
        6, 7, 3,
        // Bottom face
        0, 1, 5,
        5, 4, 0,
        // Left face
        0, 3, 7,
        7, 4, 0,
        // Right face
        1, 2, 6,
        6, 5, 1
    ];

    var scale_x = 50; // Scale factor
    var scale_y = 50; // Scale factor
    var scale_z = 100; // Scale factor
    var shift_x = -200;
    var shift_y = 0;
    var shift_z = -200;


    // Multiply each vertex by the scale factor
    for (var i = 0; i < vertices.length; i += 3) {
        vertices[i] *= scale_x;
        vertices[i + 1] *= scale_y;
        vertices[i + 2] *= scale_z;

        vertices[i] += shift_x;
        vertices[i + 1] += shift_y;
        vertices[i + 2] += shift_z;

    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setIndex(indices);

    geometry.computeVertexNormals();

    const material = new THREE.MeshPhongMaterial({ color: 0xffffff });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
}

function init() {
    'use strict';

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    createScene();

    createSkydome();

    //createGround();

    createOVNI(0,100,0);
   
    spawnTrees();

    createHouse();

    createMoon();

    camera = createCamera(200,200,200);

    // Adicionar uma luz ambiente para iluminar a cena como um todo
    const ambientLight = new THREE.AmbientLight(0xA0A0A0,0.5);
    scene.add(ambientLight);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);
}

function checkMoon() {
    if (keys[68] && !pressed[68]) {
        if (moonLight.intensity) {
            moonLight.intensity = 0;
        }
        else {
            moonLight.intensity = MOON_LIGHT_INTENSITY;
        }
        pressed[68] = true;
    }
}

function checkOvniPointLights() {
    if (keys[80] && !pressed[80]) {
        if (ovni_pointLights[0].intensity) {
            for (let i = 0; i < ovni_pointLights.length; i++) {
                ovni_pointLights[i].intensity = 0;
            }
        }
        else {
            for (let i = 0; i < ovni_pointLights.length; i++) {
                ovni_pointLights[i].intensity = OVNI_POINT_LIGHT_INTENSITY;
            }
        }
        pressed[80] = true;
    }
}

function checkOvniSpotLight() {
    if (keys[83] && !pressed[83]) {
        if (spotLight.intensity) {
            spotLight.intensity = 0;
        }
        else {
            spotLight.intensity = OVNI_SPOT_LIGHT_INTENSITY;
        }
        pressed[83] = true;
    }
}

function moveOVNI() {
    var move_X = 0;
    var move_Z = 0;
    if (keys[37]) {
        move_X -= 1;
    }
    if (keys[39]) {
        move_X += 1;
    }
    if (keys[38]) {
        move_Z -= 1;
    }
    if (keys[40]) {
        move_Z += 1;
    }
    if (move_X != 0 && move_Z != 0) {
        move_X = move_X / Math.sqrt(2);
        move_Z = move_Z / Math.sqrt(2);
    }
    ovni.position.x += move_X * SPEED_OVNI;
    ovni.position.z += move_Z * SPEED_OVNI;

    ovni.rotation.y += OVNI_ROTATION_SPEED;
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////

function changeMaterials() {
    for (i = 0; i < meshs.length; i++) {
        meshs[i].material = materials[i][selectedMaterial];
    }
}

function animate() {

    checkMoon();
    checkOvniPointLights(); 
    checkOvniSpotLight();
    moveOVNI();

    if (checkMaterials()) {
        changeMaterials();
    }
    'use strict';
    // Render the scene
    render();
    requestAnimationFrame(animate);
}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() { 
    'use strict';
}

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
    'use strict';
    console.log(e.keyCode);
    keys[e.keyCode] = true;
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';
    keys[e.keyCode] = false;
    pressed[e.keyCode] = false;
}