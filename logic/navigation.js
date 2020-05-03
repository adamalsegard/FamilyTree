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
    updateDepth(event.wheelDeltaY * 0.05);
}

function onDocumentMouseDown(event) {
    // Left button was pressed, store initial mouse pos
    if (event.button == 0) {
        dragIsActive = true;
        var oldScreenPos = new THREE.Vector2(event.clientX, event.clientY);
        oldWorldPos = Utils.screenPosToWorldPos(oldScreenPos, camera, transformGroup.position.z);
    }
}

function onDocumentMouseMove(event) {
    // Compute translation
    if (dragIsActive) {
        // Get drag difference in world space
        var newScreenPos = new THREE.Vector2(event.clientX, event.clientY);
        var newWorldPos = Utils.screenPosToWorldPos(newScreenPos, camera, transformGroup.position.z);
        var worldDiff = newWorldPos.clone().sub(oldWorldPos);
        worldDiff.z = 0;

        // Update content
        updateTranslation(worldDiff);

        // Store new position
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
    // Update the position and size of all cards after zoom.
    var cards = document.getElementsByClassName("card");
    for (i = 0; i < cards.length; i++) {
        // Convert card corner positions from screen space to world space
        var oldTopLeftScreen = new THREE.Vector2(cards[i].offsetLeft, cards[i].offsetTop);
        var oldBottomRightScreen = new THREE.Vector2(cards[i].offsetLeft + cards[i].offsetWidth, cards[i].offsetTop + cards[i].offsetHeight);

        var depth = transformGroup.position.z;
        var oldTopLeftWorld = Utils.screenPosToWorldPos(oldTopLeftScreen, camera, depth);
        var oldBottomRightWorld = Utils.screenPosToWorldPos(oldBottomRightScreen, camera, depth);

        // Update depth
        transformGroup.position.z += deltaZ;
        oldTopLeftWorld.z = transformGroup.position.z;
        oldBottomRightWorld.z = transformGroup.position.z;

        // Convert back to screen space
        var newTopLeftScreen = Utils.worldPosToScreenPos(oldTopLeftWorld, camera);
        var newScreenSize = Utils.worldPosToScreenPos(oldBottomRightWorld, camera);
        newScreenSize.sub(newTopLeftScreen);

        cards[i].style.left = newTopLeftScreen.x + "px";
        cards[i].style.top = newTopLeftScreen.y + "px";
        //cards[i].style.width = newScreenSize.x + "px";
        //cards[i].style.height = newScreenSize.y + "px";
    }
}

function updateTranslation(worldDiff) {
    // Update the position and size of all cards after zoom.
    var cards = document.getElementsByClassName("card");
    for (i = 0; i < cards.length; i++) {
        // Convert card corner positions from screen space to world space
        var oldTopLeftScreen = new THREE.Vector2(cards[i].offsetLeft, cards[i].offsetTop);
        var oldBottomRightScreen = new THREE.Vector2(cards[i].offsetLeft + cards[i].offsetWidth, cards[i].offsetTop + cards[i].offsetHeight);

        var depth = transformGroup.position.z;
        var oldTopLeftWorld = Utils.screenPosToWorldPos(oldTopLeftScreen, camera, depth);
        var oldBottomRightWorld = Utils.screenPosToWorldPos(oldBottomRightScreen, camera, depth);

        // Update world positions
        oldTopLeftWorld.add(worldDiff);
        oldBottomRightWorld.add(worldDiff);

        // Convert back to screen space
        var newTopLeftScreen = Utils.worldPosToScreenPos(oldTopLeftWorld, camera);
        var newScreenSize = Utils.worldPosToScreenPos(oldBottomRightWorld, camera);
        newScreenSize.sub(newTopLeftScreen);

        cards[i].style.left = newTopLeftScreen.x + "px";
        cards[i].style.top = newTopLeftScreen.y + "px";
        //cards[i].style.width = newScreenSize.x + "px";
        //cards[i].style.height = newScreenSize.y + "px";
    }
    // Move scene content in world space
    transformGroup.position.x += worldDiff.x;
    transformGroup.position.y -= worldDiff.y;
}