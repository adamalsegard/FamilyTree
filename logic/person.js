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
        return this.firstName + " " + this.lastName;
    }

    get extraNames() {
        var mid = this.middleNames.length > 0 ? this.middleNames : "";
        var unmarried = this.birthLastName.length > 0 ? "(" + this.birthLastName + ")" : "";
        var dash = mid.length > 0 && unmarried.length > 0 ? " - " : "";
        return mid + dash + unmarried;
    }

    get birth() {
        return this.dateOfBirth + ",\xa0\xa0\xa0\xa0" + this.birthPlace;
    }

    get death() {
        return typeof this.dateOfDeath !== "undefined" ? this.dateOfDeath : "";
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
        var nameText = document.createTextNode(this.fullName);
        nameElement.appendChild(nameText);

        // Middle names and unmarried last name labels
        var extraNamesElement = cardDiv.querySelector("#extraNames");
        var extraNamesText = document.createTextNode(this.extraNames);
        extraNamesElement.appendChild(extraNamesText);

        // Date of birth label
        var birthElement = cardDiv.querySelector("#birthLabel");
        var birthText = document.createTextNode(this.birth);
        birthElement.appendChild(birthText);

        // Date of death label
        var deathElement = cardDiv.querySelector("#deathLabel");
        var deathText = document.createTextNode(this.death);
        deathElement.appendChild(deathText);

        // Location label
        var locationElement = cardDiv.querySelector("#locationLabel");
        var locationText = document.createTextNode(this.residence);
        locationElement.appendChild(locationText);

        return cardDiv;
    }
}

module.exports = {
    Person: Person
}