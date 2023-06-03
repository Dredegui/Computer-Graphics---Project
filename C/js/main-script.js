//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
var camera, scene, renderer;
var cube, moon;
/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene() {
    'use strict';

    scene = new THREE.Scene();

    scene.add(new THREE.AxisHelper(10));
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


/////////////////////
/* CREATE LIGHT(S) */
/////////////////////

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

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

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
  

////////////////////////////////
/* INITIALIZE ANIMATION CYCLE */
////////////////////////////////
function init() {
    'use strict';
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    createScene();
    camera = createCamera(100,100,100);

    // Create a cube
    var cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
    var cubeMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.5,
        metalness: 0.5,
    });
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    scene.add(cube);

    // Set the position of the cube
    cube.position.set(0,-50,-60);

    // Criar uma esfera para a lua
    const moonGeometry = new THREE.SphereGeometry(5, 32, 32);
    const moonMaterial = new THREE.MeshStandardMaterial({ emissive: 0x808000 });
    moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.position.set(0,40,-60)
    scene.add(moon);

    // Criar uma luz pontual amarela
    const light = new THREE.PointLight(0xffff00, 0.5);
    moon.add(light);

    // Definir a direção da luz
    const lightDirection = new THREE.Vector3(0, -10, 0)
    light.position.copy(lightDirection);

    // Adicionar uma luz ambiente para iluminar a cena como um todo
    //const ambientLight = new THREE.AmbientLight(0x404040);
    //scene.add(ambientLight);
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
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

}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';

}