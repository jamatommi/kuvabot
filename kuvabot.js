/*
Jamabot:
A Telegram bot that collects all images it sees.
*/

var fs = require("fs");
var TelegramBot = require('node-telegram-bot-api');
var config = require("./config.json");
var token = config.bot_token; //insert bot token here

var bot = new TelegramBot(token, {polling:true});
var request = require('request');

/*var options = {
		url: config.server + "/api/images",
		method: 'POST',
		form: "{'fname':'asd'}"
};
console.log(options);*/

// Start the request
request.post(config.server + "/api/images").form({key: "value"});


//absolute path to the image storage
var ABSOLUTE_IMAGE_PATH = "images";	//Insert absolute path. might only work if this is the same as the json_path in app.js

bot.on("message", function(msg){
	//If received message is a photo, save the photo and caption as json to ABSOLUTE_JSON_PATH
	if (msg.photo){
		console.log("Photo received: " + msg.caption);
		bot.downloadFile(msg.photo[0].file_id, ABSOLUTE_IMAGE_PATH).then(function(path){
			console.log("File saved to: " + path);
			var parts = path.split("/");
			var fname = parts[parts.length - 1];
			// Configure the request
			var options = {
					url: config.server + "/api/images",
					method: 'POST',
					json: {
						'fname': fname,
						'msg': msg
					}
			};
			request.post(options, function (error, response, body) {
					console.log(error);
			    if (!error && response.statusCode == 200) {
			        // Print out the response body
			        console.log(body)
			    }else{
						console.log(error);
					}
			});

		});
	}
});
