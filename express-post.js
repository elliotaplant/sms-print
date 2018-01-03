'use strict'

const express = require('express')
const bodyParser = require('body-parser')

const mailingAddress = '7304 W Florida Ave\nGreat Lakes, IL 60088';

// Create a new instance of express
const app = express()

// Tell express to use the body-parser middleware and to not parse extended bodies
app.use(bodyParser.urlencoded({ extended: false }))

// Route that receives a POST request to /
app.post('/', function (req, res) {
  res.set('Content-Type', 'text/plain');
  if (req.body.MediaUrl0) {
    res.send(`Got it! We'll print that picture out and mail it to ${mailingAddress}`);
  } else {
    res.send(`Hmm we couldn't find the picture in that message. Sorry!`);
  }
})

// Tell our app to listen on port 3000
app.listen(3000, function (err) {
  if (err) {
    throw err
  }

  console.log('Server started on port 3000')
})
