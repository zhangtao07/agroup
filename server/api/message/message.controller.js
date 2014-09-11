'use strict';

var _ = require('lodash');
var fs = require('fs');
var crypto = require('crypto');

var Message = require('./message.model');
var observe = require('../../components/group.observe');
var config = require('../../config/environment');
exports.list = function(req, res) {

	Message.find(function(err, messages) {
		if (err)
			return console.error(err);
		var datas = [];
		messages.forEach(function(message) {
			datas.push(message.getMessage());
		});
		return res.jsonp({
			err : 0,
			data : datas
		});
	});

};

var user = {
	_id : "540ec253323a62a0179a215f",
	avartar : "http://tp4.sinaimg.cn/2129028663/180/5684393877/1",
	nickname : "张自萌"
}

var Busboy = require('busboy');
var path = require('path');
var temp = require("temp");

function upload(tempFile,sha1, filename, mimetype, group, size,encoding) {
	var date = new Date();
	var upload_dir = config.upload_dir;
	var saveFile = upload_dir+"/"+group+"/"+sha1.substring(0,1)+"/"+sha1.substring(2)+path.extname(filename);
	
	fs.renameSync(tempFile,saveFile);

}

exports.upload = function(req, res) {
	var shasum = crypto.createHash('sha1');
	var busboy = new Busboy({
		headers : req.headers
	});
	var fields = {};
	busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
		fields[fieldname] = val;
	});
	busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
		file.on('data', function(data) {
			shasum.update(data);
		});

		file.on('end', function() {
			var d = shasum.digest('hex');

			var stat = fs.statSync(tempPath);

			upload(tempPath,d, filename, mimetype, fields['groupId'], stat['size'],encoding);

		});
		
		var dir = temp.openSync({
			dir:config.upload_temp_dir,
			suffix:".tmp"
		})
	

		var tempPath = dir.path;
		file.pipe(fs.createWriteStream(tempPath));

	});

	busboy.on('finish', function() {
		res.writeHead(200, {
			'Connection' : 'close'
		});
		res.end("ok");
	});
	req.pipe(busboy);
}

exports.post = function(req, res) {
	//todo:save mongodb

	//get mime info

	var message = new Message({
		'content' : req.body['message'],
		'type' : req.body['type'],
		'user' : user._id
	});

	message.save(function(err, message) {
		if (err)
			return console.error(err);
		var data = message.getMessage();
		observe.groupBroadcast("group1", data);
		return res.jsonp({
			err : 0
		});
	})
}

