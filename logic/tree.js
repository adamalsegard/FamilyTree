var THREE = require('three');
var Utils = require('./utils');
var Person = require('./person');

/**
 * Export funciton to read spreadsheet
 */
exports.constructFamilyTree = (values, groupDepth, camera) => {
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
    var pos = new THREE.Vector3(0, -200, groupDepth);
    var baseSize = new THREE.Vector3(120, 60, 0);
    var cardContainer = document.querySelector("#textContainer");

    // Traverse tree and create graphic elements
    for (i = 0; i < tree.length; i++) {

        var cardDiv = tree[i].createVisualElement();
        cardContainer.appendChild(cardDiv);

        // Convert containers world space placement to screen space
        var halfSize = baseSize.clone().divideScalar(2);

        var topLeftWorldPos = pos.clone();
        var bottomRightWorldPos = pos.clone();
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

        //console.log("Add " + tree[i].fullName + " at (" + topleftScreenPos.x + ", " + topleftScreenPos.y + ")"
        //    + " with size (" + screenSpaceSize.x + ", " + screenSpaceSize.y + ")");

        pos.add(new THREE.Vector3(0, 70, 0));
    }
};
