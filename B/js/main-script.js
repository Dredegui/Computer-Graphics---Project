const SPEED = 1;
const SCALE = 3;

////////////////////////////////////////////
/////////         BASE          ////////////
////////////////////////////////////////////
var camera, scene, renderer;
var cameras = [];
var geometry, material, mesh;


////////////////////////////////////////////
/////////         TRAILOR          /////////
////////////////////////////////////////////
var trailor;
var trailor_velX = [0,0]
var trailor_velZ = [0,0]

////////////////////////////////////////////
/////////         ROBOT            /////////
////////////////////////////////////////////
var robot, pivotHead;
var head_ror = [0,0];
var i = 0;




function addWheel(obj, x, y, z) {
    'use strict';

    material = new THREE.MeshBasicMaterial({ color: 0xC41274, wireframe: true });

    var Container =  new THREE.Object3D();
    geometry = new THREE.CylinderGeometry(SCALE * 1.5,SCALE * 1.5, SCALE * 1.5, 16);
    mesh = new THREE.Mesh(geometry, material);

    Container.add(mesh);
    // Rotate 90º
    Container.rotation.z = 1.57;
    Container.position.set(x, y-3, z);
    obj.add(Container);
}

function addCargo(obj, x, y, z) {
    'use strict';
    geometry = new THREE.CubeGeometry(20, 20, 60);
    material = new THREE.MeshBasicMaterial({ color: 0x1b2133, wireframe: true });
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addConnection(obj, x, y, z) {
    'use strict';
    geometry = new THREE.CubeGeometry(15, 5, 25);
    material = new THREE.MeshBasicMaterial({ color: 0x344F24, wireframe: true });
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}


function addWaist(obj, x, y, z) {
    'use strict';
    geometry = new THREE.CubeGeometry(6 * SCALE, 2 * SCALE, 4 * SCALE);
    material = new THREE.MeshBasicMaterial({ color: 0x2b3113, wireframe: true });
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addGrill(obj, x, y, z) {
    'use strict';
    geometry = new THREE.CubeGeometry(4 * SCALE, 4 * SCALE, 1 * SCALE);
    material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function addUpperBody(obj, x, y, z) {

    'use strict';

    var UpperBody = new THREE.Object3D();

    addWaist(UpperBody,x,y - 4 * SCALE,z);
    addGrill(UpperBody,x,y - SCALE * 2,z + 2 * SCALE);

    addWheel(UpperBody,x - 2.2*SCALE,y - SCALE * 4,z);
    addWheel(UpperBody,x + 2.2*SCALE,y - SCALE * 4,z);

    geometry = new THREE.CubeGeometry(6 * SCALE, 6 * SCALE, 4 * SCALE);
    material = new THREE.MeshBasicMaterial({ color: 0x1b2133, wireframe: true });
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);

    UpperBody.add(mesh);

    obj.add(UpperBody);
}

function addHead(obj, x, y, z) {

    'use strict';

    var Head = new THREE.Object3D();

    geometry = new THREE.CubeGeometry(2 * SCALE, 1.5 * SCALE, 2 * SCALE);
    material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 2*SCALE,0);

    Head.add(mesh);

    pivotHead = new THREE.Object3D();
    pivotHead.position.set(x,y+SCALE,z);
    pivotHead.add(mesh);
    scene.add(pivotHead);


    obj.add(Head);
}


function createTrailer(x, y, z) {
    'use strict';

    trailor = new THREE.Object3D();


    addCargo(trailor, 0, 10, 0);


    addConnection(trailor,0,3,35);

    addWheel(trailor, -8, -1, -25);
    addWheel(trailor, 8, -1, -25);
    addWheel(trailor, 8, -1, 25);
    addWheel(trailor, -8, -1, 25);


    scene.add(trailor);

    trailor.position.x = x;
    trailor.position.y = y;
    trailor.position.z = z;
}

function createRobot(x, y, z) {
    'use strict';

    robot = new THREE.Object3D();

    // tronco
    addUpperBody(robot, 0, 10, 0);


    // cabeça
    addHead(robot,0,SCALE * 3.5 + 10,0);

    /*
    // left leg
    addLeg(robot, -25, -1, -8);
    
    // Right leg
    addLeg(robot, -25, -1, -8);

    // Left arm
    addArm(robot, -25, -1, -8);

    // Right arm
    addArm(robot, -25, -1, -8);
    */



    scene.add(robot);

    robot.position.x = x;
    robot.position.y = y;
    robot.position.z = z;
}

function createScene() {
    'use strict';

    scene = new THREE.Scene();


    scene.add(new THREE.AxisHelper(10));
    scene.background = new THREE.Color( 0xffffff );

    createTrailer(-50, 8, -50);
    createRobot(0, 8, 0);
}

const ORTOGONAL = 0;
const PERSPECTIVE = 1;

function createCamera(type,x,y,z) {

    if (type == ORTOGONAL) {

        var viewSize = 50; // Ajuste esse valor para controlar a área visível
        var aspectRatio = window.innerWidth / window.innerHeight;

        var cam = new THREE.OrthographicCamera(
            -viewSize * aspectRatio,
            viewSize * aspectRatio,
            viewSize,
            -viewSize,
            -1000,
            1000
        );

        cam.position.set(x,y,z);
        cam.lookAt(scene.position);
        return cam;
    }

    if (type == PERSPECTIVE) {
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
    return -1; 
}

function createCameras() {
    'use strict';

    cameras[0] = createCamera(ORTOGONAL,0,0,50);

    cameras[1] = createCamera(ORTOGONAL,50,0,0);

    cameras[2] = createCamera(ORTOGONAL,0,50,0);

    cameras[3] = createCamera(ORTOGONAL,50,50,50);

    cameras[4] = createCamera(PERSPECTIVE,50,50,50);

    //INITIAL CAMERA
    camera = cameras[4];
}

function onResize() {
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }

}

function onKeyDown(e) {
    'use strict';


    // Camera control (generic)
    if (e.keyCode <= 53 && e.keyCode >= 49) {
        camera = cameras[e.keyCode - 49];
        return ;
    }

    switch (e.keyCode) {


        case 37: // LEFT ARROW
            trailor_velX[0] = -1;
            break;

        case 38: // UP ARROW
            trailor_velZ[0] = -1;
            break;

        case 39: // RIGHT ARROW
            trailor_velX[1] = 1;
            break;

            
        case 40: // DOWN ARROW
            trailor_velZ[1] = 1;
            break;

        case 70: // F
        case 102: // f
            head_ror[0] = -1;
            break;

        case 82: // R
        case 114: // r
            head_ror[1] = 1;
            break;

        case 65: //A
        case 97: //a
            scene.traverse(function (node) {
                if (node instanceof THREE.Mesh) {
                    node.material.wireframe = !node.material.wireframe;
                }
            });
            break;

        case 83:  //S
        case 115: //s
            // ball.userData.jumping = !ball.userData.jumping;
            break;

        case 69:  //E
        case 101: //e
            scene.traverse(function (node) {
                if (node instanceof THREE.AxisHelper) {
                    node.visible = !node.visible;
                }
            });
            break;
    }
}

function onKeyUp(e) {
    'use strict';

    switch (e.keyCode) {
        case 37: // LEFT ARROW
            trailor_velX[0] = 0; // Stop left movement when key is released
            break;
        case 38: // LEFT ARROW
            trailor_velZ[0] = 0; // Stop left movement when key is released
            break;
        case 39: // RIGHT ARROW
            trailor_velX[1] = 0; // Stop right movement when key is released
            break;
        case 40: // LEFT ARROW
            trailor_velZ[1] = 0; // Stop left movement when key is released
            break;
    }
}


function render() {
    'use strict';
    renderer.render(scene, camera);
}

function init() {
    'use strict';
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    createScene();
    createCameras();

    render();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);
}

function animate() {
    'use strict';

    // Movimentar o reboque
    var newX = trailor_velX[0] + trailor_velX[1];
    var newZ = trailor_velZ[0] + trailor_velZ[1];

    // Normalizar
    if (newX != 0 && newZ != 0) {
        newX = newX / Math.sqrt(2);
        newZ = newZ / Math.sqrt(2);
    }

    trailor.position.x += newX * SPEED;
    trailor.position.z += newZ * SPEED;

    // Rodar a cabeça
    i += 0.01;
    pivotHead.rotation.set(i,0,0);

    render();

    requestAnimationFrame(animate);
}
