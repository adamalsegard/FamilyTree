var THREE = require('three');
var Utils = require('./utils');

// Global variables
var transformGroup,
    textContainer,
    camera,
    window,
    oldWorldPos,
    oldScreenPos,
    dragIsActive = false;

exports.setupNavigation = function (rootGroup, cam, win) {
    // Store transform group and set up event listeners
    transformGroup = rootGroup;
    camera = cam;
    window = win;
    textContainer = document.querySelector("#textContainer");
    document.addEventListener('wheel', onDocumentMouseWheel, false);
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);
};

exports.update = function (win) {
    // Update window properties
    window = win
};

function onDocumentMouseWheel(event) {
    updateDepth(event.wheelDeltaY * 0.05);
}

function onDocumentMouseDown(event) {
    // Left button was pressed, store initial mouse pos
    if (event.button == 0) {
        dragIsActive = true;
        oldScreenPos = new THREE.Vector2(event.clientX, event.clientY);
        oldWorldPos = Utils.screenPosToWorldPos(oldScreenPos, camera, transformGroup.position.z);
    }
}

function onDocumentMouseMove(event) {
    // Compute translation
    if (dragIsActive) {
        // Get drag difference in world space
        var newScreenPos = new THREE.Vector2(event.clientX, event.clientY);
        var screenDiff = newScreenPos.clone().sub(oldScreenPos);
        var newWorldPos = Utils.screenPosToWorldPos(newScreenPos, camera, transformGroup.position.z);
        var worldDiff = newWorldPos.clone().sub(oldWorldPos);
        worldDiff.z = 0;

        // Update content
        updateTranslation(worldDiff, screenDiff);

        // Store new position
        oldScreenPos.copy(newScreenPos);
        oldWorldPos.copy(newWorldPos);
    }
}

function onDocumentMouseUp() {
    // Deactivate drag
    if (dragIsActive) {
        dragIsActive = false;
    }
}

function updateDepth(deltaZ) {
    // Update the position and size of the card container after zoom.

    transformGroup.translateZ(-deltaZ);
    var depth = camera.position.z - transformGroup.position.z;
    var percentage = depth / camera.position.z;
    var transformValue = "scale(" + percentage + ")";

    var cardContainer = document.querySelector("#textContainer");
    cardContainer.style.WebkitTransform = transformValue;
    cardContainer.style.MozTransform = transformValue;
    cardContainer.style.OTransform = transformValue;
    cardContainer.style.transform = transformValue;
}

function updateTranslation(worldDiff, screenDiff) {
    // Translate card container element. It will cause all cards to move as well.
    var cardContainer = document.querySelector("#textContainer");
    var oldTopLeftScreen = new THREE.Vector2(cardContainer.offsetLeft, cardContainer.offsetTop);
    oldTopLeftScreen.add(screenDiff);

    cardContainer.style.left = oldTopLeftScreen.x + "px";
    cardContainer.style.top = oldTopLeftScreen.y + "px";

    // Move scene content in world space
    transformGroup.translateX(worldDiff.x);
    transformGroup.translateY(-worldDiff.y);
}