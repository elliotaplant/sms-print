const twilio = require('twilio')
const { accountSid, authToken } = require('twilio-keys.json');

const client = new twilio(accountSid, authToken);

client.messages.create({
    body: 'Hello from Node',
    to: '+5109175552',  // Personal number
    from: '14155793449' // My twilio number
})
.then((message) => console.log(message.sid))
.catch(error => console.error('No good', error));
