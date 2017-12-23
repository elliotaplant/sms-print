const twilio = require('twilio')
const { accountSid, authToken } = require('./twilio-keys.json');
const http = require('http');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const app = express();

const client = new twilio(accountSid, authToken);

function sendTwilioText() {
  client.messages.create({
    body: 'Hello from Node',
    to: '+15109175552',  // Personal number
    from: '+14155793449' // My twilio number
  })
  .then((message) => console.log(message.sid))
  .catch(error => console.error('No good', error));
}

// Recieve post requests to the /sms endpoint
app.post('/sms', (req, res) => {
  // Read something from the req object to get the sms, picture?
  // initiate a request to send to the picture api
  // if that goes well, send a text back to the requestor.
  // if that doesn't go well, send them a text saying it didn't go well
  const twiml = new MessagingResponse();

  twiml.message('The Robots are coming! Head for the hills!');

  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

http.createServer(app).listen(1337, () => {
  console.log('Express server listening on port 1337');
});
