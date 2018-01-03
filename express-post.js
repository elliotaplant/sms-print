'use strict'

const express = require('express')
const bodyParser = require('body-parser')
console.log(
  'env variables',
  process.env.PWINTY_ENV,
  process.env.PWINTY_MERCHANT_ID,
  process.env.PWINTY_API_KEY
);

const environment = process.env.PWINTY_ENV;

const pwinty = require('pwinty')(
  process.env.PWINTY_MERCHANT_ID,
  process.env.PWINTY_API_KEY,
  `https://${environment || 'sandbox'}.pwinty.com/v2.5/`
);

// Create a new instance of express
const app = express()

// Tell express to use the body-parser middleware and to not parse extended bodies
app.use(bodyParser.urlencoded({extended: false}))

// Route that receives a POST request to /
app.post('/', function(req, res) {
  res.set('Content-Type', 'text/plain');
  if (req.body.MediaUrl0) {
    createPwintyOrder(req.body.MediaUrl0)
      .then(getPwintyOrderStatus)
      .then(updatePwintyOrderStatus)
      .then(() => {
        res.send(`Got it! We'll print that picture out and mail it to ${mailingAddress().address1}`);
      })
      .catch(error => {
        res.send(
          `I'm sorry, but something went wrong. Could you tell me more about the issue at  elliotaplant@mgail.com?`
        );
      })
    } else {
    res.send(`Hmm we couldn't find the picture in that message. Sorry!`);
  }
});

app.get('/', (req, res) => {
  res.set('Content-Type', 'text/html; charset=utf-8');
  res.send(`<head></head><body> Found you at ${new Date().toString()} </body>`)
});

app.static

// Tell our app to listen on port 3000
app.listen(3000, function(err) {
  if (err) {
    throw err
  }

  console.log('Server started on port 3000')
});

function createPwintyOrder(photoUrl) {
  return new Promise((resolve, reject) => {
    pwinty.createOrder(mailingAddress(), function(err, order) {

      var photo = Object.assign({type: "4x6", url: photoUrl, copies: "1", sizing: "Crop"});

      pwinty.addPhotoToOrder(order.id, photo, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(order.id)
        }
      });
    })
  })
}

function getPwintyOrderStatus(orderId) {
  return new Promise((resolve, reject) => {
    pwinty.getOrderStatus(orderId, (err, status) => {
      if (err || !status.isValid) {
        reject(err);
      } else {
        resolve(orderId);
      }
    })
  });
}

function updatePwintyOrderStatus(orderId) {
  return new Promise((resolve, reject) => {
    pwinty.updateOrderStatus({
      id: orderId,
      status: 'Submitted',
    }, (err, status) => {
      if (err) {
        reject(err);
      } else {
        resolve(status);
      }
    })
  });
}

function mailingAddress() {
  return {
    countryCode: 'US',
    qualityLevel: 'Standard',
    recipientName: 'Amber Fearon',
    address1: '3705 Florida Ct. Unit E',
    addressTownOrCity: 'North Chicago',
    stateOrCounty: 'IL',
    postalOrZipCode: '60088'
  }
}
