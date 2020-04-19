var THREE = require('three');
var Utils = require('./utils');
var Person = require('./person');

/**
 * Export funciton to read spreadsheet
 */
exports.constructFamilyTree = (values, treeGroup, camera) => {
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
        //person.print();

        // Insert node in tree
        tree.push(person);
    }
    var pos = new THREE.Vector3(-340, 0, treeGroup.position.z);
    var baseRedColor = 255;
    var baseRedColor = 255;
    var textContainerElement = document.querySelector("#textContainer");

    // Traverse tree and create graphic elements
    for (i = 0; i < tree.length; i++) {
        // Add rectangular container for each person
        var geometry = new THREE.BoxGeometry(30, 10, 1);
        var color = new THREE.Color("rgb(" + baseRedColor + ", " + i*5 + ", 0)");
        var material = new THREE.MeshBasicMaterial( {color: color} );
        var rect = new THREE.Mesh(geometry, material);
        rect.position.copy(pos);
        pos.add(new THREE.Vector3(40, 0, 0));
        baseRedColor -= 15;


        // Create text elements
        var labelDiv = document.createElement('div');
        labelDiv.className = 'nameLabel';
        var textNode = document.createTextNode(tree[i].fullName);
        labelDiv.appendChild(textNode);

        // Convert containers world space placement to screen space
        var screenPos = Utils.worldPosToScreenPos(rect.position.clone(), camera);

        // Set the placement of the div
        labelDiv.style.left = screenPos.x + "px";
        labelDiv.style.top = screenPos.y + "px";

        textContainerElement.appendChild(labelDiv);
        //console.log("Add " + tree[i].fullName + " at (" + screenPos.x + ", " + screenPos.y + ")");

        // Add to group
        treeGroup.add(rect);
    }
};
