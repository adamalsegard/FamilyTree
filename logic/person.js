'use strict';

class Person {
    constructor(row) {
        this.lastName           = row[0];
        this.birthLastName      = row[1];
        this.firstName          = row[2];
        this.middlename         = row[3];
        this.dateOfBirth        = row[4];
        this.dateOfdeath        = row[5];
        this.father             = row[6];
        this.mother             = row[7];
    }

    get id() {
        return this.firstName + this.lastName + this.dateOfBirth;
    }

    get parentId() {
        return this.father + this.mother;
    }

    get fullName() {
        var mid = this.middlename.length > 0 ? mid = this.middlename + " " : "";
        return this.firstName + " " + mid + this.lastName;
    }

    get unmarriedName() {
        if (this.birthLastName.length > 0) {
            return " (" + this.birthLastName + ")";
        }
        else {
            return "";
        }
    }

    print() {
        console.log(this.fullName + this.unmarriedName + "\n"
        + "DOB: " + this.dateOfBirth + "\n"
        + "DOD: " + this.dateOfDeath + "\n"
        + "Parents: " + this.father + " & " + this.mother);
    }

    equals(other) {
        return this.id.localeCompare(other.id);
    }

    createVisualElement() {
        // Create card container
        var cardDiv = document.createElement('div');
        cardDiv.className = 'card';

        var labelDiv = document.createElement('div');
        labelDiv.className = 'nameLabel';
        var textNode = document.createTextNode(this.fullName);
        labelDiv.appendChild(textNode);

        cardDiv.appendChild(labelDiv);
        return cardDiv;
    }
}

module.exports = {
    Person: Person
}