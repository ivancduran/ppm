#!/usr/bin/env node
'use strict'

// requiere libraries
var fs         = require('fs');
var path       = require('path');
var http       = require('http');
var https      = require('https');
var exec       = require('child_process').exec;

// local libraries
var view       = require('./pm-view');
var error      = require('./pm-error');

// Start executeThis
function executeThis() {

var folder = 'app/library';
var url    = 'http://phalconpm.com/api/pkg';
var cache  = path.join(path.dirname(fs.realpathSync(__filename)), '../cache/');
var requesting = 'http';

var start = function(){

fn.start();

if (process.argv[2]!==undefined){

switch(process.argv[2]){

// INSTALL ****************************************
case '-in': case 'install':
	if (process.argv[3]===undefined){
		if (fs.existsSync('ppm.json')) {
			fs.readFile('ppm.json', 'utf8', function (err,data) {
				fn.printError(err);
				// get and convert json list to install
				fn.installDir(data);
			});
		}else{
			error(1);
		}
	}else{

		if(requesting=='http'){
			var req = http.request(url, function(res) {
				res.setEncoding('utf8');
				res.on('data', function (data) {
					var jObj = JSON.parse(data);
					//install packages
					fn.install(jObj);
				});
			});

			req.on('error', function(e) {
				fn.printError(e.message);
			});

			req.end();
		}else{
			fs.readFile(cache+'pkg.json', 'utf8', function (err,data) {
				fn.printError(err);
				var jObj = JSON.parse(data);
				//install packages
				fn.install(jObj);
			});
		}

	}
break;

// INFO ****************************************
case '-i': case 'info':
	fn.getJson(function(obj){
		fn.search(obj);
	});
break;

// LIST ****************************************
case '-l': case 'list':
	if(requesting=='http'){
		var req = http.request(url, function(res) {
			res.setEncoding('utf8');
			res.on('data', function (data) {
				var jObj = JSON.parse(data);
				jObj.pkg.forEach(function(item) {
					console.log('+ '+item.name);
				});
			});
		});

		req.on('error', function(e) {
			fn.printError(e.message);
		});
		
		req.end();
	}else{
		fs.readFile(cache+'pkg.json', 'utf8', function (err,data) {
			fn.printError(err);
				var jObj = JSON.parse(data);
				jObj.pkg.forEach(function(item) {
					console.log('+ '+item.name);
				});
		});
	}
break;

// UPDATE ****************************************
case '-u': case 'update':
	fn.update();
	view.update();
break;

// UNINSTALL ****************************************
case '-uni': case 'uninstall':
break;

// NO-CACHE ****************************************
case '-nc': case 'no-cache':
	fn.delCache();
	view.delcache();
break;

// VERSION ****************************************
case '-v': case 'version':
	console.log('Version: 0.0.4');
break;

// HELP ****************************************
case '-h': case 'help':
	view.phalcon();
	view.line();
	view.help();
break;

// ERROR ****************************************
default:
	// Error 0, no params
	error(0);
break;

}} else{
	error(3);
}

// End start function();
}

var fn = {
	start : function()
	{
		if (!fs.existsSync(cache+'pkg.json')) {
			fn.update();
		}else{
			requesting = 'file';
		}
	},
	printError : function(err)
	{
		if (err) return console.log(err);
	},
	install : function(jObj,options)
	{
		var check = 0;
		jObj.pkg.forEach(function(item) {
			if (item.name===process.argv[3] || options === true){
				check = 1;

				view.install(item.name);
				var req = https.request(fn.gitSplithttp(item.src), function(res) {
					res.on('data', function(d) {
						var json = JSON.parse(d);

						var params = {
							"nam" : json.name,
							"ver"  : json.version,
							"auth" : json.author,
							"desc" : json.description
						}

						view.pkg(params);

						var nf = item.src.split('/');
						var child = exec('git clone '+json.repository+' '+folder+'/'+nf[nf.length-1], function (err, stdout, stderr) {
							fn.deleteFolderRecursive(folder+'/'+nf[nf.length-1]+'/.git');
							fn.printError(err);
							view.complete();
						});

					});

				});

				req.end();
		}});
		
		if (check===0){ error(2); }
	},
	installDir : function(data)
	{

		var that = this.initFormat(data);

		if(requesting=='http'){
			var req = http.request(url, function(res) {
				res.setEncoding('utf8');
				res.on('data', function (data) {
					var jObj = JSON.parse(data);
					var pkg = fn.format(jObj,that);
					// install packages
					fn.install(pkg,true);
				});
			});
			req.end();
		}else{
			fs.readFile(cache+'pkg.json', 'utf8', function (err,data) {
				fn.printError(err);
				var jObj = JSON.parse(data);
				var pkg = fn.format(jObj,that);
				// install packages
				fn.install(pkg,true);
			});
		}
	},
	initFormat : function(data)
	{
		var that = new Object;
		that.jObj1 = JSON.parse(data);
		that.errorlibs = Object.keys(that.jObj1.dependencies);
		that.fObj = Array();
		that.eArr = Array();
		return that;
	},
	format : function(jObj,that)
	{
		// create list of dependencies in repo
		jObj.pkg.forEach(function(key){
			Object.keys(that.jObj1.dependencies).forEach(function(item){
			if (key.name===item){
				var nobj = new Object();

				nobj['name'] = key.name;
				nobj['src'] = key.src;
				that.fObj[that.fObj.length++] = nobj;
				that.eArr.push(item);
			}
			});
		});

		// Errors to display
		that.eArr.forEach(function(item){
			var off = that.errorlibs.indexOf(item);
			that.errorlibs.splice(off,1);
		});

		// format pkg to install
		var	pkg = new Object();
		pkg['pkg'] = that.fObj;

		// Error packages
		if (that.errorlibs.length>0) view.notfound(that.errorlibs);

		return pkg;

	},
	deleteFolderRecursive : function(path)
	{
		var files = [];
		if (fs.existsSync(path)) {
			files = fs.readdirSync(path);
			files.forEach(function(file,index){
				var curPath = path + "/" + file;
				if(fs.lstatSync(curPath).isDirectory()) { // recurse
					fn.deleteFolderRecursive(curPath);
				} else { // delete file
					fs.unlinkSync(curPath);
				}
			});
			fs.rmdirSync(path);
		}
	},
	gitSplithttp : function(git)
	{
		var g = git.split('/');
		var src = 'https://raw.githubusercontent.com/'+g[3]+'/'+g[4]+'/master/package.json';
		return src;
	},
	getJson : function(func)
	{
		if(requesting=='http'){	
			var req = http.request(url, function(res) {
				res.setEncoding('utf8');
				res.on('data', function (data) {
					var jObj = JSON.parse(data);
					func(jObj);
				});
			});

			req.on('error', function(e) {
				fn.printError(e.message);
			});

			req.end();
		}else{
			fs.readFile(cache+'pkg.json', 'utf8', function (err,data) {
				fn.printError(err);
				var jObj = JSON.parse(data);
				func(jObj);
			});
		}
	},
	search : function(jObj,options)
	{

		var check = 0;
		jObj.pkg.forEach(function(item) {
			if (item.name===process.argv[3] || options === true){
				check = 1;
				view.install(item.name);
				var req = https.request(fn.gitSplithttp(item.src), function(res) {
					res.on('data', function(d) {
						var json = JSON.parse(d);

						var params = {
							"nam" : json.name,
							"ver"  : json.version,
							"auth" : json.author,
							"desc" : json.description
						}

						view.pkg(params);
					});
				});
				req.end();
		}});
		
		if (check===0){ error(2); }

	},
	update : function()
	{
		fn.getJson(function(obj){
			var data = JSON.stringify(obj,null,4);

			fs.writeFile(cache+'pkg.json', data, function (err) {
				fn.printError(err);
			});
		});
	},
	delCache : function()
	{
		fs.unlinkSync(cache+'pkg.json');
	}

}

// Start App
start();
// End executeThis
}

exports.execute = executeThis;