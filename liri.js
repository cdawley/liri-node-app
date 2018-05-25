require("dotenv").config();
let keys = require("./keys.js");

let Twitter = require('twitter');
let Spotify = require('node-spotify-api');

let spotify = new Spotify(keys.spotify);
let client = new Twitter(keys.twitter);

// begin example npm spotify api / request

/*
var Spotify = require('node-spotify-api');

var spotify = new Spotify({
  id: <your spotify client id>,
  secret: <your spotify client secret>
});

spotify
  .request('https://api.spotify.com/v1/tracks/7yCPwWs66K8Ba5lFuU2bcx')
  .then(function(data) {
    console.log(data);
  })
  .catch(function(err) {
    console.error('Error occurred: ' + err);
  });

  /* end example

  */



switch (process.argv[2]) {

case "sn-test":





break;

// retrieves user's screen name, then retrieves up to 20 tweets from user's timeline
// screen name is retrieved first to avoid displaying tweets from user's followers (i.e statuses/home_timeline)
case "my-tweets":

client.get('account/settings', function(error, settings, response) {
  if (!error) {

    let params = {screen_name: settings.screen_name, count: 20}; // current user's screen name & count (20 tweets)
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
      if (!error) {
        let tweetCount = tweets.length;
        console.log(`tweets: ${tweets.length}\n\n`);
        for (i = 0; i < tweets.length; i++) {
          console.log(`${i+1} - tweeted: ${tweets[i].created_at}\n${tweets[i].text}\n\n`);
        }
      }
    });

  }
});

break;

case "spotify-this-song":


  if (process.argv[3] && process.argv[4]) {
    console.log("please enclose song title in single quotes,\nnode liri.js spotify-this-song 'the honesty of constant human error'");
    break;

  } else {

    let songTitle = '';
      if (!process.argv[3]) {
        songTitle = 'The Sign';
      } else {
        songTitle = process.argv[3];
      }

    spotify.search({ type: 'track', query: songTitle }, function(err, data) {
  if (err) {
    return console.log('Error occurred: ' + err);
  }
  // logs spotify data to console
console.log(data.tracks.items[0]);
// console.log(data);
});

  }
break;

case "movie-this":
console.log("movie this");
break;

case "do-what-it-says":
console.log("do what it says");
break;

default:
console.log("command not recognized");
break;
}
// console.log(`Command was: ${process.argv[2]}\n`);
