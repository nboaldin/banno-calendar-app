const express = require('express');
const router = express.Router();
const {google} = require('googleapis');
const auth = require('./auth');
const moment = require('moment');
const axios = require('axios');

axios.defaults.headers.common['Authorization'] = 'Bearer ' + process.env.BOT_TOKEN;
axios.defaults.headers.post['Content-Type'] = 'application/json';



router.get('/', (req, res) => {
  res.render('home', {
    title: "Banno Appointments",
    subTitle: "You have 5 minutes"
  });
});

router.get('/google/auth', (req, res) => {
  res.redirect(auth.urlGoogle());
});

router.get('/google/auth/callback', (req, res) => {
  const code = req.query.code;

  async function getGoogleAccountFromCode(code) {

    const oauth = auth.createConnection();

    // get the auth "tokens" from the request
    const data = await oauth.getToken(code);
    const tokens = data.tokens;

    // add the tokens to the google api so we have access to the account
    await oauth.setCredentials(tokens);

    return oauth;

  }

  getGoogleAccountFromCode(code)
    .then((result) => {
      req.app.locals.auths['req.session.auth'] = result;
      // console.log(req.app.locals.auths);
      res.render('makeAppointment', {
        title: 'Welcome!',
        subTitle: 'Click below to create a 5 minute appointment.'
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get('/create-event', (req, res) => {

  const client = req.app.locals.auths['req.session.auth'];
  const cal = google.calendar({
    version: 'v3',
    client
  });

  const startTime = moment();
  const endTime = moment().add(5, 'minutes');

  const event = {
    'summary': '5 Min Appt',
    'description': 'Your Five Minute Appointment',
    'start': {
      'dateTime': startTime,
      'timeZone': 'America/Chicago',
    },
    'end': {
      'dateTime': endTime,
      'timeZone': 'America/Chicago',
    }
  };


  cal.events.insert({
    auth: client,
    calendarId: 'primary',
    resource: event,
  }, function (err, event) {
    if (err) {
      console.log('There was an error contacting the Calendar service: ' + err);
      res.redirect('/');
    }
    console.log('Event created!');

    axios.post('https://slack.com/api/chat.postMessage', {
        "channel": "CH815EK52",
        "text": `5 min appointment was made for ${event.data.start.dateTime}`
      })
      .then((result) => {
        if (result.data.error) {
          console.error('Error ', result.data.error);
        } else {
          console.log('Posted, YAY!');
        }
      })
      .catch((err) => {
        console.log(err);
      });

    res.render('congrats', {
      eventTime: event.data.start.dateTime,
      title: 'Congrats',
      subTitle: 'You have created an event for the following time:'
    });

  });


});

router.get('/test', (req, res) => {
  res.sendStatus(200);
});


module.exports = router;