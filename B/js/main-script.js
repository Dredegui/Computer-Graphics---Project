const SPEED = 1;
const ROT_SPEED = 0.02;
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
var Arms = [];
var Legs = [];
var head_ror = [0,0];
var leg_ror = [0,0];
var arm_tr = [0,0];

const CUBE = 0;
const CYLINDER = 1;

function addGeneric(obj,x,y,z,type,color,sx,sy,sz) {
    'use strict';
    if (type == CUBE) {
        geometry = new THREE.CubeGeometry(SCALE * sx,SCALE * sy, SCALE * sz);
        material = new THREE.MeshBasicMaterial({ color: color, wireframe: true });
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        obj.add(mesh);
    }

    if (type == CYLINDER) {
        material = new THREE.MeshBasicMaterial({ color: color, wireframe: true });

        var Container =  new THREE.Object3D();
        geometry = new THREE.CylinderGeometry(SCALE * sx,SCALE * sy, SCALE * sz, 16);
        mesh = new THREE.Mesh(geometry, material);

        Container.add(mesh);
        // Rotate 90º
        Container.rotation.z = 1.57;
        Container.position.set(x, y-3, z);
        obj.add(Container);
    }
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

    addGeneric(UpperBody,x - 2.2 * SCALE,y - SCALE * 4,z,CYLINDER,0xC41274,1.5,1.5,1.5);
    addGeneric(UpperBody,x + 2.2 * SCALE,y - SCALE * 4,z,CYLINDER,0xC41274,1.5,1.5,1.5);

    geometry = new THREE.CubeGeometry(6 * SCALE, 6 * SCALE, 4 * SCALE);
    material = new THREE.MeshBasicMaterial({ color: 0x1b2133, wireframe: true });
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);

    UpperBody.add(mesh);

    obj.add(UpperBody);
}

function addEye(obj, x, y, z) {

    'use strict';

    var Eye = new THREE.Object3D();

    geometry = new THREE.CubeGeometry(0.5 * SCALE, 0.2 * SCALE, 1 * SCALE);
    material = new THREE.MeshBasicMaterial({ color: 0xFFFF00, wireframe: true });
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    
    Eye.add(mesh);

    obj.add(Eye);
}

function addAntenna(obj, x, y, z) {

    'use strict';

    var Antenna = new THREE.Object3D();

    geometry = new THREE.CubeGeometry(0.5 * SCALE, 1.5 * SCALE, 1 * SCALE);
    material = new THREE.MeshBasicMaterial({ color: 0x898989, wireframe: true });
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    
    Antenna.add(mesh);

    obj.add(Antenna);
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
    
    addEye(pivotHead, 0.5 * SCALE, 2 * SCALE, 0.6 * SCALE);
    addEye(pivotHead, -0.5 * SCALE, 2 * SCALE, 0.6 * SCALE);
    addAntenna(pivotHead, 0.6 * SCALE, 3 * SCALE, 0);
    addAntenna(pivotHead, -0.6 * SCALE, 3 * SCALE, 0);

    obj.add(Head);
}

function addTube(obj, x, y, z) {

    'use strict';

    var Tube = new THREE.Object3D();
    
    geometry = new THREE.CylinderGeometry(SCALE * 0.2, SCALE * 0.2, SCALE * 3, 16);
    material = new THREE.MeshBasicMaterial({ color: 0x80FF80, wireframe: true });
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    
    
    Tube.add(mesh);
    
    obj.add(Tube);
}

function addExhaust(obj, x, y, z) {

    'use strict';

    var Exhaust = new THREE.Object3D();
    
    geometry = new THREE.CylinderGeometry(SCALE * 0.5, SCALE * 0.5, SCALE * 4, 16);
    material = new THREE.MeshBasicMaterial({ color: 0x802280, wireframe: true });
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    
    
    Exhaust.add(mesh);
    addTube(Exhaust, x, y + 2 * SCALE, z)
    obj.add(Exhaust);
}

function addForearm(obj, x, y, z) {

    'use strict';

    var Forearm = new THREE.Object3D();
    
    
    geometry = new THREE.CubeGeometry(2 * SCALE, 4 * SCALE, 2 * SCALE);
    material = new THREE.MeshBasicMaterial({ color: 0x222280, wireframe: true });
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    
    
    Forearm.add(mesh);
    
    obj.add(Forearm);
}

function addArm(obj, x, y, z) {

    'use strict';

    var Arm = new THREE.Object3D();
    
    
    geometry = new THREE.CubeGeometry(2 * SCALE, 6 * SCALE, 2 * SCALE);
    material = new THREE.MeshBasicMaterial({ color: 0x1111FF, wireframe: true });
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    
    
    Arm.add(mesh);
    
    
    addForearm(Arm, x, -5 * SCALE + y, z);
    if (Arms.length == 1) {
        addExhaust(Arm, x - 1.5 * SCALE, 0.5 * SCALE + y, z);
        
    } else {
        addExhaust(Arm, x + 1.5 * SCALE, 0.5 * SCALE + y, z);
    }

    obj.add(Arm);
    Arms.push(Arm);
}

function addLeg(obj, x, y, z) {

    'use strict';

    var Leg = new THREE.Object3D();
    
    // TODO add details to leg
    
    geometry = new THREE.CubeGeometry(2 * SCALE, 8 * SCALE, 2 * SCALE);
    material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, -5*SCALE,0);
    
    Leg.add(mesh);
    
    var pivotLeg = new THREE.Object3D();
    pivotLeg.position.set(x,y + 5 * SCALE,z);
    pivotLeg.add(mesh);
    
    scene.add(pivotLeg);

    obj.add(Leg);
    Legs.push(pivotLeg);
}


function createTrailer(x, y, z) {
    'use strict';

    trailor = new THREE.Object3D();

    // Cargo
    addGeneric(trailor,0,10,0,CUBE,0x1b2133,7,7,20);

    // Connection
    addGeneric(trailor,0,3,35,CUBE,0x344F24,5,1.67,8.33);

    // Wheels
    addGeneric(trailor,-8,-1,-25,CYLINDER,0xC41274,1.5,1.5,1.5);
    addGeneric(trailor,-8,-1,25,CYLINDER,0xC41274,1.5,1.5,1.5);
    addGeneric(trailor,8,-1,-25,CYLINDER,0xC41274,1.5,1.5,1.5);
    addGeneric(trailor,8,-1,25,CYLINDER,0xC41274,1.5,1.5,1.5);


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

    // left leg
    addLeg(robot, 2*SCALE, -3 * SCALE, 0);
    
    // Right leg
    addLeg(robot, -2*SCALE, -3 * SCALE, 0);

    // Left arm
    addArm(robot, 4*SCALE, 3.34*SCALE, -1*SCALE);
    // Right arm
    addArm(robot, -4*SCALE, 3.34*SCALE, -1*SCALE);

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

        case 87: // W
        case 119: // w
            leg_ror[0] = -1;
            break;

        case 83: // S
        case 115: // s
            leg_ror[1] = 1;
            break;

        case 69: // E
        case 101: // e
            arm_tr[0] = -1;
            break;

        case 68: // D
        case 100: // d
            arm_tr[1] = 1;
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

        case 1000:  //non functional
        case 10001: //non functional
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
        case 70: // F
        case 102: // f
            head_ror[0] = 0;
            break;

        case 82: // R
        case 114: // r
            head_ror[1] = 0;
            break;

        case 69: // E
        case 101: // e
            arm_tr[0] = 0;
            break;

        case 68: // D
        case 100: // d
            arm_tr[1] = 0;
            break;

        case 87: // W
        case 119: // w
            leg_ror[0] = 0;
            break;

        case 83: // S
        case 115: // s
            leg_ror[1] = 0;
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

    var newPos = arm_tr[0] + arm_tr[1];
    if(Arms[0].position.x + (newPos * ROT_SPEED) <= 0 * SCALE &&  Arms[0].position.x + (newPos * ROT_SPEED) >= -2 * SCALE) {
        Arms[0].position.x += newPos * ROT_SPEED;
        Arms[1].position.x -= newPos * ROT_SPEED;
        Arms[0].position.z += newPos * ROT_SPEED;
        Arms[1].position.z += newPos * ROT_SPEED;
    }

    // Rodar a cabeça
    var rot = (head_ror[0] + head_ror[1]) * ROT_SPEED;
    pivotHead.rotation.set(pivotHead.rotation.x + rot,0,0);

    rot = (leg_ror[0] + leg_ror[1]) * ROT_SPEED;
    Legs[0].rotation.set(Legs[0].rotation.x - rot,0,0);
    Legs[1].rotation.set(Legs[1].rotation.x - rot,0,0);

    render();

    requestAnimationFrame(animate);
}
