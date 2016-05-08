'use strict';


var mongoose = require('mongoose');

var searchSchema = new mongoose.Schema({
  term: { type: String }
  , when: {type: Date, default: Date.now}
});
        
var Search = mongoose.model('Search', searchSchema);

/*
var mongo = require('mongodb').MongoClient;
var validator = require('validator');
var shortid = require('shortid');
*/
var path = require('path');
var express = require('express');
var request = require('request');
var favicon = require('serve-favicon');
var app = express();


app.use(favicon(__dirname + '/public/img/clementine_150.png'));
require('dotenv').load();

app.get('/api/imagesearch/:param1', function(req, resp) {
  
  var queryParam = "'" + req.params.param1 + "'";
  var offset = 0;
  if (req.query.offset != undefined) {
    offset = req.query.offset;
  }

  var url = 'https://api.datamarket.azure.com/Bing/Search/v1/Image?Query=' + encodeURIComponent(queryParam).replace(/[!'()*]/g, escape) + '&$format=JSON&$top=10&$skip=' + offset;
  //console.log("url: " + url);

  var results = [];

  request({
    url:url,
    method: 'POST',
    auth: {
      user: '',
      pass: 'AwKXhomzhnC4Li7oGe98+FH2RzDSp1Qc5mqyB40iNWM'
    },
    form: {
      'grant_type': 'client_credentials'
    }
  }, function(err, res) {

    var json = JSON.parse(res.body).d.results;
    var resultItem = {};

    json.forEach(function (entry) {
  
      resultItem.url = entry.MediaUrl;
      resultItem.snippet = entry.Title;
      resultItem.context = entry.DisplayUrl;
      
      results.push(resultItem);
        
    });
  
    resp.end(JSON.stringify(results));
    
    mongoose.connect(process.env.MONGO_URI);
    var db = mongoose.connection;
    
    db.on('error', console.error);
    db.once('open', function() {

      var search = new Search({
        term: req.params.param1
      });
  
      search.save(function(err, result) {
        if (err) return console.error(err);
        //console.dir(result);
        mongoose.disconnect();
      });

    });

  });
  

});


app.get('/api/latest/imagesearch', function(req, resp) {
    
    mongoose.connect(process.env.MONGO_URI);
    var db = mongoose.connection;
    
    db.on('error', console.error);
    db.once('open', function() {

      Search.find({}, null, { limit:10,sort:{"when":-1} }, function(err, results) {
      if (err) return console.error(err);
        //console.dir(results);
        
        var jsonArray = [];
        
        results.forEach(function(result) {
            jsonArray.push({"term":result.term,
              "when": result.when
            });
        });

        resp.end(JSON.stringify(jsonArray));
        
        mongoose.disconnect();
      });

    });
});

app.get('*', function(req, res) {

    res.sendFile(path.join(__dirname, 'public' + '/index.html'));
  
});


var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});

