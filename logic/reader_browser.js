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
exports.readSpreadSheet = async () => {
    // Init Google API client
    const loadGapiClient = new Promise((resolve, reject) => {
        gapi.load('client:auth2', resolve);
    });
    return loadGapiClient.then(async () => {
        return await initClient();
    })
};

/**
 *  Initializes the API client library and sets up sign-in state listeners.
 */
async function initClient() {
    var res;
    await gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(async () => {
        // Sign in if needed
        if (!gapi.auth2.getAuthInstance().isSignedIn.get()) {
            gapi.auth2.getAuthInstance().signIn();
        }

        // Read entries into global var
        res = await getEntries();

        // Sign out when we got all we need
        gapi.auth2.getAuthInstance().signOut();
    }, (error) => {
        console.log(JSON.stringify(error, null, 2));
    });
    return res;
}

/**
 * Read the content of the spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1K18hdrbI2Ge7I4X6MKJLN46lDbVLPaCYBlwDwIoiyYs/edit
 */
async function getEntries() {
    var res;
    await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: '1K18hdrbI2Ge7I4X6MKJLN46lDbVLPaCYBlwDwIoiyYs',
        range: 'Family!A2:G',
    }).then((response) => {
        var range = response.result;
        if (range.values.length > 0) {
            // Store the result
            res = range.values;
        } else {
            console.log('No data found.');
        }
    }, (response) => {
        console.log('Error: ' + response.result.error.message);
    });
    return res;
}