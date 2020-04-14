/**
 * @author Adam Alsegård / http://www.adamalsegard.se
 */

// Make sure that we cannot use undeclared variables etc.
('use strict');

/**
 * GET STUFF
 */
var isWebglEnabled = require('detector-webgl');
var THREE = require('three');
var Navigation = require('./logic/navigation');
var Reader = require('./logic/reader_browser');
var Tree = require('./logic/tree');

// Check if browser supports WebGL before rendering anything.
if (!isWebglEnabled) {
  alert('WebGL is not supported on this browser! \n Please try another!');
}


/**
 * DECLARE VARIABLES
 */
var camera,
    scene,
    renderer,
    treeGroup;

// Set up listeners.
document.addEventListener('DOMContentLoaded', onDocumentLoaded, false);
window.addEventListener('resize', onWindowResize, false);


/**
 * MAIN (RENDER) LOOP
 */
function renderLoop() {
    // Render scene and call render loop again.
    renderer.render(scene, camera);
    requestAnimationFrame(renderLoop);
}


/**
 * MAIN (LOAD) FUNCTION
 */
function onDocumentLoaded() {
    // Set up the Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color("rgb(150, 80, 80)");

    // Add some ambient light
    var light = new THREE.AmbientLight(0x404040);
    scene.add(light);

    // Create camera
    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 300;
    scene.add(camera);

    // Set up the Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Create root tree object that will be used for transforms.
    treeGroup = new THREE.Group();
    Navigation.setupNavigation(treeGroup, camera, window);

    // Read Google spreadsheet
    let readFunc = new Promise((resolve, reject) => {
        try {
            var res = Reader.readSpreadSheet();
            resolve(res);
        } catch (error) {
            reject(error);
        }
    });
    readFunc.then((result) => {
        Tree.constructFamilyTree(result, treeGroup);
    }, (error) => {
        console.log("Error while reading spreadsheet: " + error);
    });

    // Add object group to scene
    scene.add(treeGroup);

    // Start render
    requestAnimationFrame(renderLoop);
}

/**
 * CALLBACK FUNCTIONS
 */
function onWindowResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    Navigation.update(window);

    requestAnimationFrame(renderLoop);
}