const SPEED = 1;
const ROT_SPEED = 0.05;
const SCALE = 3;
const ARM_BONUS = 1.7;

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

var previousTime = 0;

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

function addUpperBody(obj, x, y, z) {

    'use strict';

    var UpperBody = new THREE.Object3D();

    // WAIST
    addGeneric(UpperBody,x,y-3*SCALE,z + 1.5*SCALE,CUBE,0x909090,8, 1, 1);

    // GRILL
    addGeneric(UpperBody,x,y-SCALE * 1.2,z + 2 * SCALE,CUBE,0xF9F9F0,4, 4, 1);

    // WHEELS
    addGeneric(UpperBody,x - 3 * SCALE,y - SCALE * 2.1,z + 0.3*SCALE,CYLINDER,0xff0000,1.3,1.3,1.3);
    addGeneric(UpperBody,x + 3 * SCALE,y - SCALE * 2.1,z + 0.3*SCALE,CYLINDER,0xff0000,1.3,1.3,1.3);

    geometry = new THREE.CubeGeometry(8 * SCALE, 4 * SCALE, 4 * SCALE);
    material = new THREE.MeshBasicMaterial({ color: 0x1b2133, wireframe: true });
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y + SCALE, z);

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
    
    // EYES
    addGeneric(pivotHead, 0.5 * SCALE, 2 * SCALE, 0.6 * SCALE,CUBE,0xffff00,0.5, 0.2, 1);
    addGeneric(pivotHead, -0.5 * SCALE, 2 * SCALE, 0.6 * SCALE,CUBE,0xffff00,0.5, 0.2, 1);

    // ANTENNA
    addGeneric(pivotHead, 0.6 * SCALE, 3 * SCALE, 0,CUBE,0x898989,0.5, 1.5, 1);
    addGeneric(pivotHead, -0.6 * SCALE, 3 * SCALE, 0,CUBE,0x898989,0.5, 1.5, 1);

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
    
    
    geometry = new THREE.CubeGeometry(2 * SCALE, 2 * SCALE, 4 * SCALE);
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
    
    addGeneric(Arm, x, -2 * SCALE + y, z + 3 * SCALE,CUBE,0x222280,2,2,4);
    if (Arms.length == 1) {
        addExhaust(Arm, x - 1.5 * SCALE, 0.5 * SCALE + y, z);
        
    } else {
        addExhaust(Arm, x + 1.5 * SCALE, 0.5 * SCALE + y, z);
    }

    obj.add(Arm);
    Arms.push(Arm);
}

function addLeg(obj, x, y, z, left) {

    'use strict';

    var Leg = new THREE.Object3D();
    
    // TODO add details to leg
    
    geometry = new THREE.CubeGeometry(1 * SCALE, 4 * SCALE, 1 * SCALE);
    material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, -2*SCALE,0);
    
    Leg.add(mesh);
    
    
    var pivotLeg = new THREE.Object3D();
    pivotLeg.position.set(x,y + 7 * SCALE,z);
    pivotLeg.add(mesh);
    
    //Big Leg
    addGeneric(pivotLeg,0,-8*SCALE,0,CUBE,0x00ff00,2, 8, 2);
    var pos = 1;
    if (left) {
        pos = -1;
    }
    //Wheels
    addGeneric(pivotLeg, pos * 1.7 * SCALE,-9.5*SCALE,1*SCALE,CYLINDER,0xff0000,1.3,1.3,1.3);
    addGeneric(pivotLeg, pos * 1.7 * SCALE,-6.5*SCALE,1*SCALE,CYLINDER,0xff0000,1.3,1.3,1.3);
    

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
    addGeneric(trailor,-8,-1,-25,CYLINDER,0x000000,1.5,1.5,1.5);
    addGeneric(trailor,-8,-1,-15,CYLINDER,0x000000,1.5,1.5,1.5);
    addGeneric(trailor,8,-1,-25,CYLINDER,0x000000,1.5,1.5,1.5);
    addGeneric(trailor,8,-1,-15,CYLINDER,0xC000000,1.5,1.5,1.5);


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
    addLeg(robot, 1.2*SCALE, -3 * SCALE, 0, false);
    
    // Right leg
    addLeg(robot, -1.2*SCALE, -3 * SCALE, 0, true);

    // Left arm
    addArm(robot, 5*SCALE, 3.34*SCALE, -1*SCALE);
    // Right arm
    addArm(robot, -5*SCALE, 3.34*SCALE, -1*SCALE);

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
            head_ror[0] = 1;
            break;

        case 82: // R
        case 114: // r
            head_ror[1] = -1;
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


    // Calculate delta time
    const currentTime = performance.now();
    const deltaTime = (currentTime - previousTime) / 10;
    previousTime = currentTime;


    // Movimentar o reboque
    var newX = trailor_velX[0] + trailor_velX[1];
    var newZ = trailor_velZ[0] + trailor_velZ[1];

    // Normalizar
    if (newX != 0 && newZ != 0) {
        newX = newX / Math.sqrt(2);
        newZ = newZ / Math.sqrt(2);
    }

    
    trailor.position.x += newX * SPEED * deltaTime;
    trailor.position.z += newZ * SPEED * deltaTime;

    var newPos = arm_tr[0] + arm_tr[1];
    if(Arms[0].position.x + (newPos * ROT_SPEED * deltaTime) <= 0 * SCALE &&  Arms[0].position.x + (newPos * ROT_SPEED * deltaTime) >= -2 * SCALE) {
        Arms[0].position.x += newPos * ROT_SPEED * deltaTime * ARM_BONUS;
        Arms[1].position.x -= newPos * ROT_SPEED * deltaTime * ARM_BONUS;
        Arms[0].position.z += newPos * ROT_SPEED * deltaTime * ARM_BONUS;
        Arms[1].position.z += newPos * ROT_SPEED * deltaTime * ARM_BONUS;
    }


    // Rodar a cabeça
    var rot = (head_ror[0] + head_ror[1]) * ROT_SPEED * deltaTime;
    if (pivotHead.rotation.x +rot <= 0 && pivotHead.rotation.x +rot >= -3) {
        pivotHead.rotation.set(pivotHead.rotation.x + rot,0,0);
    } else if (pivotHead.rotation.x < 0.1 && pivotHead.rotation.x > -0.1) {
        pivotHead.rotation.set(0,0,0);
    }


    // Rodar pernas
    rot = (leg_ror[0] + leg_ror[1]) * ROT_SPEED * deltaTime / 2;
    var pos;
    if (Legs[0].rotation.x - rot <= 1.58 &&  Legs[0].rotation.x - rot >= 0) {
        pos = Legs[0].rotation.x - rot;
    } else if (1.6 - Legs[0].rotation.x > Legs[0].rotation.x - 0) {
        pos = 0;        
    } else {
        pos = 1.57; 
    }
    Legs[0].rotation.set(pos,0,0);
    Legs[1].rotation.set(pos,0,0);
    
    render();

    requestAnimationFrame(animate);
}
