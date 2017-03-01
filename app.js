var express = require('express');
var fs = require("fs");
var app = express();
var config = require('./config.json');

var ABSOLUTE_IMAGE_PATH = "./images/";

app.set('view engine', 'jade');

app.use(express.static("/home/tommijama/jamabot/images"));

var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(express.static('styles'));

//headers
app.use(function (req, res, next){
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

var db = require("./data.js");


function readFolder(dir, onReady, onError) {
	/* Parse .json files in dir and pass the information to onReady-callback.
	Expected file format: {"path" : "asdsad/asdsa", "caption" : "text"} */

	fs.readdir(dir, function(err, filenames) {
		if (err){
			onError(err);
			return;
		}
		var items = 0;
		var data = {};
		data.images = [];

		filenames.forEach(function(filename){
			fs.readFile(dir + filename, "utf-8", function(err, content){
				if (err){
					onError(err);
					return;
				}
				l = filename.split(".");
				if (l[l.length-1] == "json"){
					console.log(content);
					data.images.push(content);
				}
				items++;
				if (items == filenames.length){
					console.log(data);
					onReady(data);
				}
			})
;		});
	});
}

app.get("/", function(req, res){
	db.allMessages(function(imagelist){
		res.send("moi");
		//res.render(imagelist);
	});
});

app.get("/api/images/", function(req, res){
	db.allMessages(function(err, results){
		console.log(err);
		if (!err)
			res.json(results);
	});
});

app.post("/api/images", function(req, res){
	console.log(req.body);
	db.saveMessage(req.body.msg, req.body.fname, function(err){
		if (err)
			console.log(err);
		console.log("done");
	});
});

app.listen(8000, function(){});
