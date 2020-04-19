var THREE = require('three');
var Utils = require('./utils');

// Global variables
var transformGroup,
    textContainer,
    camera,
    window,
    oldWorldPos,
    dragIsActive = false;

exports.setupNavigation = function (rootGroup, cam, win) {
    // Store transform group and set up event listeners
    transformGroup = rootGroup;
    camera = cam;
    window = win;
    textContainer = document.querySelector("#textContainer");
    document.addEventListener('mousewheel', onDocumentMouseWheel, false);
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);
};

exports.update = function (win) {
    // Update window properties
    window = win
};

function onDocumentMouseWheel(event) {
    transformGroup.position.z += event.wheelDeltaY * 0.05;
}

function onDocumentMouseDown(event) {
    // Left button was pressed, store initial mouse pos
    if (event.button == 0) {
        dragIsActive = true;
        var screenPos = new THREE.Vector2(event.clientX, event.clientY);
        var rootPos = transformGroup.position.clone();
        oldWorldPos = Utils.screenPosToWorldPos(screenPos, camera, rootPos);
    }
}

function onDocumentMouseMove(event) {
    // Compute translation
    if (dragIsActive) {
        var screenPos = new THREE.Vector2(event.clientX, event.clientY);
        var rootPos = transformGroup.position.clone();
        var newWorldPos = Utils.screenPosToWorldPos(screenPos, camera, rootPos);
        var diff = newWorldPos.clone().sub(oldWorldPos);
        // Move scene content in world space
        transformGroup.position.x += diff.x;
        transformGroup.position.y += diff.y;
        // Move text overlays in screen space
        textContainer.style.left = textContainer.offsetLeft + event.movementX + "px";
        textContainer.style.top = textContainer.offsetTop + event.movementY + "px";
        oldWorldPos.copy(newWorldPos);
    }
}

function onDocumentMouseUp() {
    // Deactivate drag
    if (dragIsActive) {
        dragIsActive = false;
    }
}