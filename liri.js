require("dotenv").config();
let Keys = require("./keys.js");

// begin example npm spotify api / request
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

console.log(`Command was: ${process.argv[2]}\n`);
