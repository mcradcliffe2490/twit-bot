const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

var twit = require("twit");
var config = require("./twit-config");
var Twitter = new twit(config);


exports.helloWorld = functions.https.onRequest((request, response) => {
  Twitter.post('statuses/update', {status :'hello world!'}, function(err,data,response) {
      if (err) {
          console.log("something went wrong")
      } else {
          console.log("You have tweeted!")
      }
  });

  response.send('Check twitter for succesful tweet!');

});
