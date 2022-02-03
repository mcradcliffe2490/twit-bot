const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

var twit = require("twit");
var config = require("./twit-config");
var Twitter = new twit(config);

const API_KEYS = require('./API_KEYS.js');

// SDK Config // 
const {Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    organization: API_KEYS.openaiOrganization,
    apiKey: API_KEYS.openaiKey
});

const openai = new OpenAIApi(configuration);

// PUPETEER set up for scraping from twitter

const puppeteer = require('puppeteer')

async function scrape(pageURL) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(pageURL, {
        waitUntil: 'networkidle2'
    });

    await page.waitForTimeout(3000);

    await page.screenshot({path: `test${pageURL}.png`});

    const twitterUserPage = await page.evaluate(async () => {
        return document.body.innerText + " ";
    });

    await browser.close();
    return twitterUserPage;
}


exports.helloWorld = functions.https.onRequest( async (request, response) => {
    var twitterUserData = "";
    // twitterUserData += await scrape("https://twitter.com/badbanana");
    // twitterUserData += await scrape("https://twitter.com/SparkNotes");
    // twitterUserData += await scrape("https://twitter.com/david8hughes");
    // twitterUserData += await scrape("https://twitter.com/harriweinreb");
    // twitterUserData += await scrape("https://twitter.com/simoncholland");
    // twitterUserData += await scrape("https://twitter.com/CaucasianJames");
    // twitterUserData += await scrape("https://twitter.com/XplodingUnicorn");
    console.log("function started!");

    const gptCompletion = await openai.createCompletion("text-davinci-001", {
        prompt: ` Make a funny tweet`,
        temperature: 0.7,
        max_tokens: 32,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      });
      console.log("openai response generated");

    // Send tweet
  Twitter.post('statuses/update', {status :gptCompletion.data.choices[0].text}, function(err,data,response) {
      if (err) {
          console.log("something went wrong")
      } else {
          console.log("You have tweeted!")
      }
  });

  // get twitter users
//   Twitter.get('users/suggestions/:slug', {slug:'funny'}, function(err,data,response) {
//       console.log(data)
//   });

  response.send('Check twitter for succesful tweet!');

});
