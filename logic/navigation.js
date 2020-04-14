var THREE = require('three');

// Global variables
var transformGroup,
    camera,
    window,
    oldWorldPos,
    dragIsActive = false;

exports.setupNavigation = function (rootGroup, cam, win) {
    // Store transform group and set up event listeners
    transformGroup = rootGroup;
    camera = cam;
    window = win;
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
        oldWorldPos = getMousePosInWorldCoord(event);
    }
}

function onDocumentMouseMove(event) {
    // Compute translation
    if (dragIsActive) {
        var newWorldPos = getMousePosInWorldCoord(event);
        var diff = newWorldPos.clone().sub(oldWorldPos);
        transformGroup.position.x += diff.x;
        transformGroup.position.y += diff.y;
        oldWorldPos.copy(newWorldPos);
    }
}

function onDocumentMouseUp() {
    // Deactivate drag
    if (dragIsActive) {
        dragIsActive = false;
    }
}

function getMousePosInWorldCoord(mouseEvent) {
    // Get mouse pos in [-0.5, 0.5]
    var mouseX = (mouseEvent.clientX / window.innerWidth) * 2 - 1;
    var mouseY = -(mouseEvent.clientY / window.innerHeight) * 2 + 1;
    var vec = new THREE.Vector3(mouseX, mouseY, 0.5);

    // 'Unproject' vector from NDC screen space to world space
    vec.unproject(camera);

    // Project to correct depth
    var direction = vec.sub(camera.position).normalize();
    var distance = transformGroup.position.clone().sub(camera.position).length()
    var scaled = direction.multiplyScalar(distance);
    return camera.position.clone().add(scaled);
}