var Person = require('./person');
var THREE = require('three');

/**
 * Export funciton to read spreadsheet
 */
exports.constructFamilyTree = (values, treeGroup) => {
    var tree = [];

    // Create Family Tree nodes
    for (i = 0; i < values.length; i++) {
        var row = values[i];
        // Skip empty entries
        if (!Array.isArray(row) || !row.length) {
            continue;
        }

        // Create person node
        var person = new Person.Person(row);

        // Insert node in tree
        tree.push(person);
    }
    var pos = new THREE.Vector3(-120, 0, treeGroup.position.z);

    // Traverse tree and create graphic elements
    for (i = 0; i < tree.length; i++) {
        // Add rectangular container for each person
        var geometry = new THREE.BoxGeometry(30, 10, 1);
        var material = new THREE.MeshBasicMaterial( {color: 0x0000ff} );
        var rect = new THREE.Mesh(geometry, material);
        rect.position.copy(pos);
        pos.add(new THREE.Vector3(40, 0, 0));

        // Add to group
        treeGroup.add(rect);
    }
};
