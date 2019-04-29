# Banno Calendar App
To create appointments and post a notfication to slack concerning created appointment.

## Main Functions
- An auth.js file that configured the Oauth2 Client.
    - createConnection() - Creates the Oauth2 client with options clientId, clientSecret and redirect URL.
    - getConnectionUrl() - A method with a set of options attached to it. These options configure the type of access and which google apis will be used.
    - urlGoogle() - This function calls createConnection() and is passed into the getConnectionUrl() function as a parameter. This returns a url with a query param for us to send back to the authorization server to get an access token.
- A routes.js file where most of the buisness logic is located.
    - function getGoogleAccountFromCode(code) - this function is called on a certain 'route' http://localhost:3000/google/auth. It receives the code from the query string above as a parameter. Within this function createConnection() is called and the method '.getToken(code)' finally receives the code from the query string. This returns a data object with tokens and the '.setCredentials()' method is called against the result of 'getToken(code).' WE FINALLY HAVE AN AUTHORIZED OAUTH2 CLIENT!
    - The result of getGoogleAccountFromCode(code) is passed into a google.calendar() method which gives US access to create events in our google calendar. 
    - 'cal' is the stored result of authorizing the Google Calendar api. cal.events.insert() is called to add the event to the Google Calendar. An 'event' object was created to pass into cal.events.insert. A library called moment is used to simplify dates and timestamps in Nodejs. moment() is used in the start and end times of this event object.
    - Within the callback function of cal.events.insert, axios, a promise-based http client is used to post a message to a slack bot showing the start time of the created appointment.

These are the main functions used to create the app. Now, there is a bit more in my app than just this. My app is a nodejs app buit on the expressjs framework using pug as a templating engine. Please let me know if you have any questions about the code.

## Requirements and Versions
- "axios": "^0.18.0",
- "body-parser": "^1.18.3",
- "dotenv": "^7.0.0",
- "express": "^4.16.4",
- "googleapis": "^39.2.0",
- "moment": "^2.24.0",
- "pug": "^2.0.3"
- "node": "10.15.0"

## Tools
- Express is a framework but I believe it is also considered a tool
- Git

## Credentials
- A google developer project Oauth cred
- Slackbot cred

## Example Usage
I did choose to create a web app so it would be pretty straightforward.

1. User would visit the home url and be presented with a button that says 'Go To Appointments.' This would trigger google Oauth consent. 
2. When user 'Allows' google to access their calendar they are redirected to a page with a prompt and a button that says 'Create Event.' The event is immeadiately made for the current time for a duration of five minutes. The user is rerouted to a page that shows the time of the event they just created and another button that says 'Create Another Event Right... Now'
3. The user can proceed to make as many appointments as they like. 