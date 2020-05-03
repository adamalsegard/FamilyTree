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
    var baseSize = new THREE.Vector3(100, 40, 0);
    var textContainerElement = document.querySelector("#textContainer");

    // Traverse tree and create graphic elements
    for (i = 0; i < tree.length; i++) {
        // Add rectangular container for each person
        var geometry = new THREE.BoxGeometry(baseSize.x, baseSize.y, baseSize.z);
        var color = new THREE.Color("rgb(" + baseRedColor + ", " + i*5 + ", 0)");
        var material = new THREE.MeshBasicMaterial( {color: color} );
        var rect = new THREE.Mesh(geometry, material);
        rect.position.copy(pos);
        pos.add(new THREE.Vector3(120, 0, 0));
        baseRedColor -= 15;

        var cardDiv = tree[i].createVisualElement();
        textContainerElement.appendChild(cardDiv);

        // Convert containers world space placement to screen space
        var halfSize = baseSize.clone().divideScalar(2);
        var topLeftWorldPos = rect.position.clone();
        var bottomRightWorldPos = rect.position.clone();
        topLeftWorldPos.sub(halfSize);
        bottomRightWorldPos.add(halfSize);
        var topleftScreenPos = Utils.worldPosToScreenPos(topLeftWorldPos, camera);
        var screenSpaceSize = Utils.worldPosToScreenPos(bottomRightWorldPos, camera);
        screenSpaceSize.sub(topleftScreenPos);

        // Set the placement of the div
        cardDiv.style.left = topleftScreenPos.x + "px";
        cardDiv.style.top = topleftScreenPos.y + "px";
        cardDiv.style.width = screenSpaceSize.x + "px";
        cardDiv.style.height = screenSpaceSize.y + "px";

        // Add to group
        treeGroup.add(rect);
    }
};
