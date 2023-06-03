//////////////////////
/* CONSTANTS DUDEERS*/
//////////////////////
const SCALE_OVNI = 5;

const PHONG = 0;
const TOON = 1;
const LAMBERT = 2;
const BASIC = 3;

const MAT_MOON = 0;
//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
var camera, scene, renderer;
var geometry,material,mesh;

var moon,moonLight;
var ovni;

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
        geometry = new THREE.CubeGeometry(SCALE * sx,SCALE * sy, SCALE * sz);
        material = materials[materials.length-1][selectedMaterial];
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        obj.add(mesh);
    }

    if (type == CYLINDER) {
        geometry = new THREE.CylinderGeometry(SCALE * sx,SCALE * sy, SCALE * sz, 16);
        material = materials[materials.length-1][selectedMaterial];
        mesh = new THREE.Mesh(geometry, material);
        // Rotate 90º
        mesh.rotation.z = 1.57;
        mesh.position.set(x, y-3, z);
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
}

function createMoon() {
    var moon = new THREE.Object3D();
    addGeneric(moon,100,0,0,SPHERE,0xffA500,10,3,3);
    moonLight = new THREE.DirectionalLight(0xffff00,1);
    moonLight.position.set(50,1,1);
    moonLight.target = ovni;
    //moonLight.target.updateMatrixWorld();
    moon.add(moonLight);
    const lightHelper = new THREE.DirectionalLightHelper(moonLight,1);
    moon.add(lightHelper);
    scene.add(moon);
}

function createOVNI() {
    ovni = new THREE.Object3D();
    addGeneric(ovni,-100,0,0,ELLIPSOIDE,0x808080,10*SCALE_OVNI,2*SCALE_OVNI,10*SCALE_OVNI);
    addGeneric(ovni,-100,0,0,CAP,0x808080,7*SCALE_OVNI,-1,-1);
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

function init() {
    'use strict';
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    createScene();
    createOVNI();
    createMoon();

    

    camera = createCamera(200,200,200);


    // Adicionar uma luz ambiente para iluminar a cena como um todo
    //const ambientLight = new THREE.AmbientLight(0x404040);
    //scene.add(ambientLight);

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
            moonLight.intensity = 1;
        }
        pressed[68] = true;
    }
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