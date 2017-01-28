/*
Jamabot:
A Telegram bot that collects all images it sees. Images can be
viewed at: http://reilukerho.org/images

Needed packages:
npm install node-telegram-bot-api
npm install express --save
*/

var fs = require("fs");
var TelegramBot = require('node-telegram-bot-api');

var token = ''; //insert bot token here

var bot = new TelegramBot(token, {polling:true});

//absolute path to the image storage
var ABSOLUTE_JSON_PATH = "images";	//Insert absolute path. might only work if this is the same as the json_path in app.js

bot.on("message", function(msg){
	//If received message is a photo, save the photo and caption as json to ABSOLUTE_JSON_PATH
	if (msg.photo){
		console.log("Photo received: " + msg.caption);
		console.log(msg.photo[0].file_id)
		bot.downloadFile(msg.photo[0].file_id, ABSOLUTE_JSON_PATH).then(function(path){
			console.log("File saved to: " + path);	
			var parts = path.split("/");		
			var fname = parts[parts.length - 1];
			var jsonObj = {"path" : fname, "caption" : msg.caption};

			fs.writeFile(ABSOLUTE_JSON_PATH + "/" + fname + ".json", JSON.stringify(jsonObj), function(){
				console.log("Json saved to: " + ABSOLUTE_JSON_PATH + "/" + fname + ".json");
			})
		});
	}
});