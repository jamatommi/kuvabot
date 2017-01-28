var express = require('express');
var fs = require("fs");
var app = express();

var ABSOLUTE_IMAGE_PATH = "/home/jamabot/images";
var ABSOLUTE_JSON_PATH = "/home/jamabot/json/";

app.set('view engine', 'jade');

app.use(express.static(ABSOLUTE_IMAGE_PATH));

function readFolder(dir, onReady, onError) {
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


app.get("/images/", function(req, res){
		
		var images = {};
		readFolder(ABSOLUTE_JSON_PATH, function(data){
			console.log(data);
			for (i = 0; i < data.images.length; i++){
				data.images[i] = JSON.parse(data.images[i]);
			}
			res.render("home",  {"images":data.images});
		}, function(err){throw err;});
});

app.listen(8000, function(){});