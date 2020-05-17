var THREE = require('three');

// Global variables
var groupDepth,
    camera,
    oldScreenPos,
    dragIsActive = false;

exports.setupNavigation = function (defaultDepth, cam) {
    // Store stuff and set up event listeners
    groupDepth = defaultDepth;
    camera = cam;
    document.addEventListener('wheel', onDocumentMouseWheel, false);
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);
};

function onDocumentMouseWheel(event) {
    updateDepth(event.wheelDeltaY * 0.05);
}

function onDocumentMouseDown(event) {
    // Left button was pressed, store initial mouse pos
    if (event.button == 0) {
        dragIsActive = true;
        oldScreenPos = new THREE.Vector2(event.clientX, event.clientY);
    }
}

function onDocumentMouseMove(event) {
    // Compute translation in screen space
    if (dragIsActive) {
        var newScreenPos = new THREE.Vector2(event.clientX, event.clientY);
        var screenDiff = newScreenPos.clone().sub(oldScreenPos);

        // Update content
        updateTranslation(screenDiff);

        // Store new position
        oldScreenPos.copy(newScreenPos);
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
    groupDepth -= deltaZ;
    var depth = camera.position.z - groupDepth;
    var percentage = depth / camera.position.z;
    var transformValue = "scale(" + percentage + ")";

    var cardContainer = document.querySelector("#textContainer");
    cardContainer.style.WebkitTransform = transformValue;
    cardContainer.style.MozTransform = transformValue;
    cardContainer.style.OTransform = transformValue;
    cardContainer.style.transform = transformValue;
}

function updateTranslation(screenDiff) {
    // Translate card container element. It will cause all cards to move as well.
    var cardContainer = document.querySelector("#textContainer");
    var oldTopLeftScreen = new THREE.Vector2(cardContainer.offsetLeft, cardContainer.offsetTop);
    oldTopLeftScreen.add(screenDiff);

    cardContainer.style.left = oldTopLeftScreen.x + "px";
    cardContainer.style.top = oldTopLeftScreen.y + "px";
}