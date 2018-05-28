require("dotenv").config();
let keys = require("./keys.js");

let Twitter = require('twitter');
let Spotify = require('node-spotify-api');
let request = require("request");
let fs = require('fs');

let spotify = new Spotify(keys.spotify);
let client = new Twitter(keys.twitter);

let myTweets = function() {

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

  };

let spotifySong = function(songTitle) {

      spotify.search({ type: 'track', query: songTitle }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }

  response = data.tracks.items[0];

  console.log(`
  artist: ${response.album.artists[0].name}
  song title: ${response.name}
  preview url: ${response.preview_url}
  album: ${response.album.name}\n`)
  });

};

let movieThis = function(movieTitle) {



  // run an OMDB request with the movie title from process args
  request(`http://www.omdbapi.com/?t=${movieTitle}&y=&plot=short&apikey=trilogy`, function(error, response, body) {

    // If the request is successful (i.e. if the response status code is 200)
    if (!error && response.statusCode === 200) {
      console.log(`
      Title: ${JSON.parse(body).Title}
      Released: ${JSON.parse(body).Released}
      Rating (IMDB): ${JSON.parse(body).imdbRating}
      Rating (Rotten Tomatoes): ${JSON.parse(body).Ratings[1].Value}
      Produced in: ${JSON.parse(body).Country}
      Language: ${JSON.parse(body).Language}

      Plot: ${JSON.parse(body).Plot}
      Actors: ${JSON.parse(body).Actors}\n`);
    }
  });
};

let runCmd = function(theCmd, input) {

  let fromArgv;


    if (process.argv[2] == "do-what-it-says" && theCmd != "do-what-it-says") {
      fromArgv = false;
    } else if (process.argv) {
      fromArgv = true;
    }

  switch (theCmd) {


  case "my-tweets":
    myTweets();
    fs.appendFile('log.txt', `${theCmd}\n`, function (err) {
      if (err) throw err;
      console.log(`\tCommand ${theCmd} saved to log!`);
    });
  break;

  // retrieves song info from spotify and logs to console.
  // if no argument is provided, info for "All That She Wants" is displayed.
  case "spotify-this-song":

  if (!fromArgv && input) {
    spotifySong(input);
  } else if (!fromArgv || !input || input == "(none)") {
    spotifySong("All That She Wants");
    fs.appendFile('log.txt', `${theCmd} - ${input}\n`, function (err) {
      if (err) throw err;
      console.log(`\tCommand ${theCmd} saved to log!`);
    });
  } else if (fromArgv && !process.argv[4]) {
    input = process.argv[3]
    spotifySong(input);
    fs.appendFile('log.txt', `${theCmd} - ${input}\n`, function (err) {
      if (err) throw err;
      console.log(`\tCommand ${theCmd} saved to log!`);
    });
  } else {
      console.log("please enclose song title in single or double quotes, examples:\nnode liri.js spotify-this-song 'the honesty of constant human error'");
  };

  break;


  // retrieves movie info from OMDB
  // if no movie is provided, log info for Mr. Nobody
  case "movie-this":

  if (!fromArgv && input) {
    movieThis(input);
  } else if (!fromArgv || !input || input == "(none)") {
    movieThis("Mr. Nobody");
    fs.appendFile('log.txt', `${theCmd} - ${input}\n`, function (err) {
      if (err) throw err;
      console.log(`\tCommand ${theCmd} saved to log!`);
    });
  } else if (fromArgv && !process.argv[4]) {
    input = process.argv[3]
    movieThis(input);
    fs.appendFile('log.txt', `${theCmd} - ${input}\n`, function (err) {
      if (err) throw err;
      console.log(`\tCommand ${theCmd} saved to log!`);
    });
  } else {
    console.log("please enclose movie title in single quotes, for example:\nnode liri.js movie-this 'im a cyborg, but thats ok'");
  };
  break;

  // run commands contained in file "random.txt"
  case "do-what-it-says":

  if (!fromArgv) {
    // if command came from random.txt, you probably don't want to start this over
    console.log("I'm sorry Dave, I'm afraid I can't do that");
    break;
  } else {
  fs.readFile("random.txt", "utf8", function(err, data) {
    if (err) {
      return console.log(err);
    }

  // split on new line after trimming whitespace (or final newline char)
  let output = data.trim().split("\n");

    // Loop Through the newly created output array
    for (var i = 0; i < output.length; i++) {
      let splitCmdArg = output[i].split(",", 2) // split on comma
      let command = splitCmdArg[0];
      let argument = splitCmdArg[1];

      console.log(`\trunning command from random.txt: ${command} ${argument}...`);
      fs.appendFile('log.txt', `${theCmd}\n`, function (err) {
        if (err) throw err;
        console.log(`\tCommand ${theCmd} saved to log!`);
      });
 let checkedArg;
      if (!argument) {
        checkedArg = "(none)";
      } else {
          checkedArg = argument;
        }

      if (command == "do-what-it-says") {
        console.log("I'm sorry Dave, I'm afraid I can't do that");
      } else if (!argument || argument.length == 0) {
        runCmd(command, "(none)");
      } else {
        runCmd(command, argument);
        fs.appendFile('log.txt', `${i}. ${command} - ${checkedArg}\n`, function (err) {
          if (err) throw err;
          console.log(`\tCommand from random.txt: ${command} ${argument} saved to log!`);
  });
      }
    }

  });
  }
  break;

  default:
  console.log(`sorry, this was command not recognized. please use one of these commands:

    my-tweets\t\t\t\treturn your most recent tweets
    spotify-this-song '<song title>'\tsearch spotify for song
    movie-this '<movie-title>'\t\tsearch imdb for movie info
    do-what-it-says\t\t\tread command's from random.txt
    `);
  break;
  }

}

// take input from process.argv

runCmd(process.argv[2], process.argv[3]);
