'use strict';

class Person {
    constructor(row) {
        this.myId               = row[0];
        this.lastName           = row[1];
        this.birthLastName      = row[2];
        this.firstName          = row[3];
        this.middleNames        = row[4];
        this.gender             = row[5];
        this.dateOfBirth        = row[6];
        this.dateOfDeath        = row[7];
        this.father             = row[8];
        this.mother             = row[9];
        this.birthPlace         = row[10];
        this.residence          = row[11];
    }

    get id() {
        return this.myId;
    }

    get fullName() {
        var mid = this.middleNames.length > 0 ? mid = this.middleNames + " " : "";
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

    constructId() {
        var dob = this.dateOfBirth.split("-");
        this.myId = this.lastName.charAt(0) + this.firstName + dob[0];
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
        // Create a clone of the card template
        var cardDiv = document.querySelector("#cardTemplate").cloneNode(true);
        cardDiv.className = "card";
        cardDiv.setAttribute("id", this.id);

        /**** Set all person attributes ****/
        // Gender icon
        var genderElement = cardDiv.querySelector("#genderIcon");
        if (this.gender == "M") {
            genderElement.innerHTML = "<use xlink:href='#mars'/>";
        }
        else if (this.gender == "F") {
            genderElement.innerHTML = "<use xlink:href='#venus'/>";
        }

        // Name label
        var nameElement = cardDiv.querySelector("#nameLabel");
        var textNode = document.createTextNode(this.fullName);
        nameElement.appendChild(textNode);

        return cardDiv;
    }
}

module.exports = {
    Person: Person
}