var credentials = require('../credentials');
var CLIENT_ID = credentials.client_id;
var API_KEY = credentials.client_secret;

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

// Authorization scopes required by the API; multiple scopes can be included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

/**
 * Export funciton to read spreadsheet
 */
exports.readSpreadSheet = function () {
    // Init Google API client
    gapi.load('client:auth2', initClient);
};

/**
 *  Initializes the API client library and sets up sign-in state listeners.
 */
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
        if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
            // Sign in
            gapi.auth2.getAuthInstance().signIn();
        }

        // Read entries
        listEntries();

        // Sign out
        gapi.auth2.getAuthInstance().signOut();

    }, function(error) {
        appendPre(JSON.stringify(error, null, 2));
    });
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
    var pre = document.getElementById('content');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}

/**
 * Print the content of the spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1K18hdrbI2Ge7I4X6MKJLN46lDbVLPaCYBlwDwIoiyYs/edit
 */
function listEntries() {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: '1K18hdrbI2Ge7I4X6MKJLN46lDbVLPaCYBlwDwIoiyYs',
        range: 'Family!A2:B',
    }).then(function(response) {
        var range = response.result;
        if (range.values.length > 0) {
            appendPre('Name:, Date of Birth:');
            for (i = 0; i < range.values.length; i++) {
                var row = range.values[i];
                // Print columns A and B, which correspond to indices 0 and 1.
                appendPre(row[0] + ', ' + row[1]);
            }
        } else {
            appendPre('No data found.');
        }
    }, function(response) {
        appendPre('Error: ' + response.result.error.message);
    });
}