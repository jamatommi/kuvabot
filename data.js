var mongoose = require('mongoose');
var config = require("./config.json");

//connect to database
mongoose.connect(config.database);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("connected");
  createModels();
});


var models = {};
var createModels = function(){
  var messageSchema = new mongoose.Schema({
    id: Number,
    caption: String,  //message caption
    from: {
      id: Number,
      name: String
    },
    context: [{text: String}],
    image: String //file name for image (maybe store the image itself to mongodb later?)
  });

  models["Message"] = mongoose.model("Message", messageSchema);
}

exports.saveMessage = function(msg, fname, callback){
  //save the telegram message to database
    var newmsg = new models["Message"]({
      id: msg.message_id,
      from: {
        id: msg.from.id,
        name: msg.from.first_name
      },
      context: [{}], //5 messages before and after, coming soon.
      image: fname,
    });
    newmsg.save(function(err){
      callback(err);
    });
}

exports.allMessages = function(callback){
  //pass a list of all messages to callback
  models["Message"].find({}, function(err, results){
    callback(err, results);
  });
}
