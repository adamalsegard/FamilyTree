var THREE = require('three');

// Global variables
var groupDepth,
    camera,
    oldScreenPos,
    zoomCenter,
    transformOrigin,
    translation,
    dragIsActive = false;

exports.setupNavigation = function (defaultDepth, cam) {
    // Store stuff and set up event listeners
    groupDepth = defaultDepth;
    camera = cam;
    zoomCenter = new THREE.Vector2(0, 0);
    transformOrigin = new THREE.Vector2(0, 0);
    translation = "translate(0px, 0px)";
    document.addEventListener('wheel', onDocumentMouseWheel, false);
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);
};

function onDocumentMouseWheel(event) {
    var pos = new THREE.Vector2(event.clientX, event.clientY);
    updateDepth(event.wheelDeltaY * 0.05, pos);
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

// Update the position and size of the card container after zoom.
function updateDepth(deltaZ, mouseOffset) {
    // Calculate translation depending on mouse offset
    var cardContainer = document.querySelector("#textContainer");
    var topLeft = new THREE.Vector2(cardContainer.offsetLeft, cardContainer.offsetTop);

    // Find relative point where to center the scaling (screen space)
    mouseOffset.sub(topLeft);

    // Check if the mouse has moved and we should set a new transform origin.
    if (!zoomCenter.equals(mouseOffset)) {
        // Get current scale factor
        var currentScale = (camera.position.z - groupDepth) / camera.position.z;

        // Get diff from previous transform origin in local space
        var zoomCenterDiff = mouseOffset.clone();
        zoomCenterDiff.sub(zoomCenter);
        zoomCenterDiff.divideScalar(currentScale);

        // Update transform origin (local space)
        transformOrigin.add(zoomCenterDiff);
        cardContainer.style.transformOrigin = transformOrigin.x + "px " + transformOrigin.y + "px";

        // Store new screen space position for future checks.
        zoomCenter = mouseOffset.clone();

        // Get relative translation to compensate for origin shift
        if (!transformOrigin.equals(new THREE.Vector2(0, 0))) {
            var localPos = transformOrigin.clone();
            var scaledPos = zoomCenter.clone();
            var relativeDiff = scaledPos.sub(localPos).clone();
            translation = "translate(" + Math.floor(relativeDiff.x) + "px, " + Math.floor(relativeDiff.y) + "px)";
        }
    }

    // Clamp scaling to avoid flip with negative values.
    groupDepth -= deltaZ;
    if (groupDepth > camera.position.z * 0.95)
        groupDepth = camera.position.z * 0.95;

    // Calculate scale factor
    var depth = camera.position.z - groupDepth;
    var percentage = depth / camera.position.z;

    // Perform transform
    var transformValue = translation + " scale(" + percentage + ")";
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