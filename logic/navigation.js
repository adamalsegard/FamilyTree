// Global variables
var transformGroup,
    camDepth,
    winWidth
    dragIsActive = false;

exports.setupNavigation = function (rootGroup, depth, width) {
    // Store transform group and set up event listeners
    transformGroup = rootGroup;
    camDepth = depth;
    winWidth = width;
    document.addEventListener('mousewheel', onDocumentMouseWheel, false);
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);
};

exports.update = function (depth, width) {
    // Update transform scaling
    camDepth = depth;
    winWidth = width;
};

function onDocumentMouseWheel(event) {
    transformGroup.position.z += event.wheelDeltaY * 0.05;
}

function onDocumentMouseDown(event) {
    // Left button was pressed
    if (event.button == 0) {
        dragIsActive = true;
    }
}

function onDocumentMouseMove(event) {
    if (dragIsActive) {
        var depth = (transformGroup.position.z - camDepth) / -1130;// -winWidth;
        transformGroup.position.x += (event.movementX * depth);
        transformGroup.position.y -= (event.movementY * depth);
    }
}

function onDocumentMouseUp(event) {
    if (dragIsActive) {
        dragIsActive = false;
    }
}