'use strict';

var path = require('path');
var express = require('express');
var request = require('request');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var app = express();

var multer  = require('multer')
var upload = multer({ dest: './uploads/' })


app.use(favicon(__dirname + '/public/img/clementine_150.png'));
require('dotenv').load();


app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

//app.post('/api/fileanalyse', upload.single('the-file'), function(req,res){
app.post('/api/fileanalyse', upload.array('the-file'), function(req,res){
	//console.log(req.body); //form fields
	/* example output:
	{ title: 'abc' }
	 */
	//console.log(req.files); //form files
	/* example output:
            { fieldname: 'the-file',
              originalname: 'grumpy.png',
              encoding: '7bit',
              mimetype: 'image/png',
              destination: './uploads/',
              filename: '436ec561793aa4dc475a88e84776b1b9',
              path: 'uploads/436ec561793aa4dc475a88e84776b1b9',
              size: 277056 }
	 */
	   res.json(req.files);
});


app.get('/works', function(req, res) {

    res.sendFile(path.join(__dirname, 'public' + '/index2.html'));
  
});


app.get('*', function(req, res) {

    res.sendFile(path.join(__dirname, 'public' + '/index.html'));
  
});


var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});

