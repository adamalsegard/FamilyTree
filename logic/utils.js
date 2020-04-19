var THREE = require('three');

// Converts a Vector2 screen position to Vector3 world position
exports.screenPosToWorldPos = (screenPos, camera, rootPos) => {
    // Map screenPos to NDC [-1, 1]
    var mouseX = (screenPos.x / window.innerWidth) * 2 - 1;
    var mouseY = -(screenPos.y / window.innerHeight) * 2 + 1;
    var vec = new THREE.Vector3(mouseX, mouseY, 0.5);

    // 'Unproject' vector from NDC screen space to world space
    vec.unproject(camera);

    // Project to correct depth
    var direction = vec.sub(camera.position).normalize();
    var distance = rootPos.sub(camera.position).length()
    var scaled = direction.multiplyScalar(distance);

    //Return world space coordinate as Vector3
    return camera.position.clone().add(scaled);
}

// Converts a Vector3 world position to Vector2 screen position
exports.worldPosToScreenPos = (worldPos, camera) => {
    // Project world position into camera's normalized device coordinate (NDC)
    worldPos.project(camera);

    // Map NDC [-1, 1] to screen pixels
    var screenX = (worldPos.x + 1) / 2 * window.innerWidth;
    var screenY = (worldPos.y + 1) / 2 * window.innerHeight;

    // Return as Vector2
    return new THREE.Vector2(screenX, screenY);
}