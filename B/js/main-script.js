/*global THREE, requestAnimationFrame, console*/

var camera, scene, renderer;
var cameras = [];
var geometry, material, mesh;

var ball;

function addTableLeg(obj, x, y, z) {
    'use strict';

    geometry = new THREE.CubeGeometry(2, 6, 2);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y - 3, z);
    obj.add(mesh);
}

function addTableTop(obj, x, y, z) {
    'use strict';
    geometry = new THREE.CubeGeometry(60, 2, 20);
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


function createTable(x, y, z) {
    'use strict';

    var table = new THREE.Object3D();

    material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

    addTableTop(table, 0, 0, 0);
    addTableLeg(table, -25, -1, -8);
    addTableLeg(table, -25, -1, 8);
    addTableLeg(table, 25, -1, 8);
    addTableLeg(table, 25, -1, -8);

    scene.add(table);

    table.position.x = x;
    table.position.y = y;
    table.position.z = z;
}

function createScene() {
    'use strict';

    scene = new THREE.Scene();


    scene.add(new THREE.AxisHelper(10));

    createTable(0, 8, 0);
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

    camera = cameras[0];

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
    }

    switch (e.keyCode) {
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
    window.addEventListener("resize", onResize);
}

function animate() {
    'use strict';

    if (ball.userData.jumping) {
        ball.userData.step += 0.04;
        ball.position.y = Math.abs(30 * (Math.sin(ball.userData.step)));
        ball.position.z = 15 * (Math.cos(ball.userData.step));
    }
    render();

    requestAnimationFrame(animate);
}
