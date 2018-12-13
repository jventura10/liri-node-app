require("dotenv").config();

var x = require("./keys.js");
var Spotify = require('node-spotify-api');
const request = require('request');
var fs = require("fs");

var spotify = new Spotify(x.spotify);
var cmd = process.argv[2];

if (cmd === 'concert-this') {
    var artist = "";
    for (var i = 3; i < process.argv.length; i++) {
        if(i===3){
            artist = process.argv[i];
        }
        else{
            artist+= " ";
            artist += process.argv[i];
        }
    }

    concertCall(artist);
}
else if (cmd === 'spotify-this-song') {
    var song;
    for (var i = 3; i < process.argv.length; i++) {
        if(i===3){
            song = process.argv[i];
        }
        else{
            song += " ";
            song += process.argv[i];
        }
    }

    spotifyCall(song);

}
else if (cmd === 'movie-this') {
    var movie = "";

    for (var i = 3; i < process.argv.length; i++) {
        if(i===3){
            movie = process.argv[i];
        }
        else{
            movie += " ";
            movie += process.argv[i];
        }
    }

    movieCall(movie);
}
else if (cmd === 'do-what-it-says') {
    

    fs.readFile("random.txt", "utf8", function (error, data) {
        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }

        var dataArr = data.split(",");

        //console.log(dataArr);

        if(dataArr[0]==='spotify-this-song'){
            spotifyCall(dataArr[1]);
        }
        else if(dataArr[0]==='concert-this'){
            concertCall(dataArr[1]);
        }
        else if(dataArr[0]==='movie-this'){
            movieCall(dataArr[1]);
        }
        else{
            console.log("Error Reading File");
        }

    });

}
else {
    console.log("Valid Commands: concert-this <artist>, spotify-this-song <song>, movie-this <movie>, do-what-it-says");
}



function concertCall(artist) {
    if (artist === undefined) {
        console.log("Please Supply Artist");
    }
    else {
        var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
        //console.log(artist);
        //console.log(queryURL);

        request(queryURL, { json: true }, (err, res, body) => {
            if (err) {
                return console.log(err);
            }


            if (body.length > 0) {
                console.log("For Concerts This is What I Found: ");
                for (var i = 0; i < body.length; i++) {
                    var month = body[i].datetime.slice(5, 7);
                    var day = body[i].datetime.slice(8, 10);
                    var year = body[i].datetime.slice(0, 4);

                    console.log("-------------------------");
                    console.log("Venue: " + body[i].venue.name);
                    if (body[i].venue.country === 'United States') {
                        console.log("Location: " + body[i].venue.city + ", " + body[i].venue.region);
                    }
                    else {
                        console.log("Location: " + body[i].venue.city + ", " + body[i].venue.country);
                    }

                    console.log("When: " + month + "/" + day + "/" + year);
                }
            }
            else {
                console.log("No Concerts Found");
            }


        });
    }
}

function spotifyCall(song) {
    if (song === undefined) {
        spotify.search({ type: 'track', query: "The Sign" }, (err, data) => {
            if (err) {
                return console.log('Error occurred: ' + err);
            }

            if (data.tracks.items.length > 0) {
                console.log("This is What I Found for Default Search: ");
                for (var i = 0; i < data.tracks.items.length; i++) {
                    console.log("-------------------------");
                    console.log("Song: " + data.tracks.items[i].name);
                    console.log("Artist: " + data.tracks.items[i].artists[0].name);
                    console.log("Album: " + data.tracks.items[i].album.name);
                    if (data.tracks.items[i].preview_url === null) {
                        console.log("No Preview URL");
                    }
                    else {
                        console.log("Preview URL: " + data.tracks.items[i].preview_url);
                    }

                }
            }
            else {
                console.log("No Results Found");
            }

        });
    }
    else {

        spotify.search({ type: 'track', query: song }, (err, data) => {
            if (err) {
                return console.log('Error occurred: ' + err);
            }

            if (data.tracks.items.length > 0) {
                console.log("This is What I Found: ");
                for (var i = 0; i < data.tracks.items.length; i++) {
                    console.log("-------------------------");
                    console.log("Song: " + data.tracks.items[i].name);
                    console.log("Artist: " + data.tracks.items[i].artists[0].name);
                    console.log("Album: " + data.tracks.items[i].album.name);
                    if (data.tracks.items[i].preview_url === null) {
                        console.log("No Preview URL");
                    }
                    else {
                        console.log("Preview URL: " + data.tracks.items[i].preview_url);
                    }

                }
            }
            else {
                console.log("No Results Found");

            }

        });

    }
}

function movieCall(movie) {
    //console.log(movie);
    var movieURL;

    //Default Case Because no Movie Was Passed in
    if (movie === "") {
        movie = "Mr.Nobody";
        movieURL = "http://www.omdbapi.com/?apikey=trilogy&t=" + movie;

        request(movieURL, { json: true }, (err, res, body) => {
            if (err) {
                return console.log(err);
            }

            //console.log(body);
            console.log("-------------------------");
            console.log("Movie: " + body.Title);
            console.log("Release Year: " + body.Year);
            for (var i = 0; i < body.Ratings.length; i++) {
                console.log(body.Ratings[i].Source + " Rating: " + body.Ratings[i].Value);
            }
            console.log("Country: " + body.Country);
            console.log("Language: " + body.Language);
            console.log("Plot: " + body.Plot);
            console.log("Main Actors: " + body.Actors);

        });
    }
    else {
        movieURL = "http://www.omdbapi.com/?apikey=trilogy&t=" + movie;

        request(movieURL, { json: true }, (err, res, body) => {
            if (err) {
                return console.log(err);
            }

            //console.log(body);
            console.log("-------------------------");
            console.log(body.Title);
            console.log(body.Year);
            for (var i = 0; i < body.Ratings.length; i++) {
                console.log(body.Ratings[i].Source + " Rating: " + body.Ratings[i].Value);
            }
            console.log(body.Country);
            console.log(body.Language);
            console.log(body.Plot);
            console.log(body.Actors);
        });

    }
}