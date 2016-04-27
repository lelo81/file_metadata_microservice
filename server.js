'use strict';

var express = require('express');
var favicon = require('serve-favicon');
var mongo = require('mongodb').MongoClient;
var validator = require('validator');
var shortid = require('shortid');
var path = require('path');
var app = express();

app.use(favicon(__dirname + '/public/img/clementine_150.png'));
require('dotenv').load();

app.get('/new/*', function(req, res) {
  
  var originalPath = req.originalUrl.substr(5,req.originalUrl.length);

  var host = req.protocol + '://' + req.get('host');
  var doc = {};
  

  if (validator.isURL(originalPath)){
        doc.original_url = originalPath;
        doc._id = shortid.generate();
        
        
        mongo.connect(process.env.MONGO_URI, function(err, db) {
        if (err) throw err;
        var urls = db.collection('urls');
        urls.insert(doc,function(err, data) {
          if (err) throw err
          doc.short_url = host + '/' + data.insertedIds[0];
          delete doc._id;
          db.close();
          res.end(JSON.stringify(doc));

      });
  });
        
        
        
  } else {
        res.end(JSON.stringify({"error":"Wrong url format, make sure you have a valid protocol and real site."}));
  }

  
});

app.get("/:id", function(req, res) {
  
  if (typeof req.params.id == 'string') {
      
      mongo.connect(process.env.MONGO_URI, function(err, db) {
              if (err) throw err;
              var urls = db.collection('urls');
              urls.find({
                "_id": req.params.id //o_id
            }).toArray(function(err, documents) {
                if (err) throw err
                db.close();
                
                if (documents[0] == undefined) {
                  res.end(JSON.stringify({"error":"This url is not in the database."}));
                }
                else {
                  res.redirect(documents[0].original_url);
                };
            })
      })  
  }
  else
  {
        res.sendFile(path.join(__dirname, 'public' + '/index.html'));
  }
});

app.get('*', function(req, res) {

    res.sendFile(path.join(__dirname, 'public' + '/index.html'));
  
});


var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});