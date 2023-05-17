const SPEED = 1;

/*global THREE, requestAnimationFrame, console*/

var camera, scene, renderer;
var cameras = [];
var geometry, material, mesh;

var trailor,ball;

// TRAILOR INFO
var trailor_velX = [0,0]
var trailor_velZ = [0,0]

function addWheel(obj, x, y, z) {
    'use strict';

    material = new THREE.MeshBasicMaterial({ color: 0xC41274, wireframe: true });

    var Container =  new THREE.Object3D();
    geometry = new THREE.CylinderGeometry(5,5, 6, 16);
    mesh = new THREE.Mesh(geometry, material);

    Container.add(mesh);
    Container.rotation.x = 1.57;
    Container.position.set(x, y-3, z);
    obj.add(Container);
}

function addCargo(obj, x, y, z) {
    'use strict';
    geometry = new THREE.CubeGeometry(60, 20, 20);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    obj.add(mesh);
}

function createBall(x, y, z) {
    'use strict';

    ball = new THREE.Object3D();
    ball.userData = { jumping: true, step: 0 };

    material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    geometry = new THREE.SphereGeometry(4, 10, 10);
    mesh = new THREE.Mesh(geometry, material);

    ball.add(mesh);
    ball.position.set(x, y, z);

    scene.add(ball);
}


function createTrailer(x, y, z) {
    'use strict';

    trailor = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0x14EA44, wireframe: true });

    addCargo(trailor, 0, 10, 0);
    /*
    addWheel(trailor, -25, -1, -8);
    addWheel(trailor, -25, -1, 8);
    addWheel(trailor, 25, -1, 8);
    addWheel(trailor, 25, -1, -8);
    */

    scene.add(trailor);

    trailor.position.x = x;
    trailor.position.y = y;
    trailor.position.z = z;
}

function createScene() {
    'use strict';

    scene = new THREE.Scene();


    scene.add(new THREE.AxisHelper(10));

    createTrailer(0, 8, 0);
    createBall(0, 0, 15);
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
            ball.userData.jumping = !ball.userData.jumping;
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

    if (ball.userData.jumping) {
        ball.userData.step += 0.04;
        ball.position.y = Math.abs(30 * (Math.sin(ball.userData.step)));
        ball.position.z = 15 * (Math.cos(ball.userData.step));
    }


    // Normalizado
    var newX = trailor_velX[0] + trailor_velX[1];
    var newZ = trailor_velZ[0] + trailor_velZ[1];

    if (newX != 0 && newZ != 0) {
        newX = newX / Math.sqrt(2);
        newZ = newZ / Math.sqrt(2);
    }

    trailor.position.x += newX * SPEED;
    trailor.position.z += newZ * SPEED;

    render();

    requestAnimationFrame(animate);
}
