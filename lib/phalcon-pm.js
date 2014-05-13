#!/usr/bin/env node
'use strict'

// requiere libraries
var fs         = require('fs');
var http       = require('http');
var https      = require('https');
var exec       = require('child_process').exec;

// local libraries
var view       = require('./pm-view');
var error      = require('./pm-error');

// Start executeThis
function executeThis() {

var folder = 'app/library';
var url  = 'http://107.170.77.172/pkg.json';
var print = console.log;

var start = function(){

if (process.argv[2]!==undefined){

switch(process.argv[2]){

// INSTALL ****************************************
case '-i': case 'install':
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
	}
break;

// LIST ****************************************
case '-l': case 'list':
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
break;

// UPDATE ****************************************
case '-u': case 'update':

	// if (fs.existsSync('ppm.json')) {
	// 	fs.readFile('ppm.json', 'utf8', function (err,data) {
	// 		fn.printError(err);
	// 		var jObj = JSON.parse(data);
	// 		console.log(jObj.file);
	// 	});
	// }

	var jsonfile = { "dependencies" :
					  { 
						"foo": "1.0.0 - 2.9999.9999",
						"bar": ">=1.0.2 <2.1.2",
						"baz": ">1.0.2 <=2.3.4",
						"boo": "2.0.1",
						"test": "<1.0.0 || >=2.3.1 <2.4.5 || >=2.5.2 <3.0.0",
						"asd": "http://asdf.com/asdf.tar.gz",
						"til": "~1.2",
						"elf": "~1.2.3",
						"crypt": "2.x",
						"thr": "3.3.x"
					  }
					}

	var data = JSON.stringify(jsonfile,null,4);

	fs.writeFile('ppm.json', data, function (err) {
		if (err) return console.log(err);
	});

break;

// UNINSTALL ****************************************
case '-ui': case 'uninstall':
	console.log('hola');
break;

// VERSION ****************************************
case '-v': case 'version':
	console.log('Version: 0.0.1');
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
		var jObj1 = JSON.parse(data);
		var errorlibs = Object.keys(jObj1.dependencies);
		var fObj = Array();
		var eArr = Array();

		var req = http.request(url, function(res) {
			res.setEncoding('utf8');
			res.on('data', function (data) {
				var jObj = JSON.parse(data);

				// create list of dependencies in repo
				jObj.pkg.forEach(function(key){
					Object.keys(jObj1.dependencies).forEach(function(item){
					if (key.name===item){
						var nobj = new Object();

						nobj['name'] = key.name;
						nobj['src'] = key.src;
						fObj[fObj.length++] = nobj;
						eArr.push(item);
					}
					});
				});

				// Errors to display
				eArr.forEach(function(item){
					var off = errorlibs.indexOf(item);
					errorlibs.splice(off,1);
				});

				// format pkg to install
				var	pkg = new Object();
				pkg['pkg'] = fObj;

				// Error packages
				if (errorlibs.length>0) view.notfound(errorlibs);
				
				// install packages
				fn.install(pkg,true);
			});
		});

		req.end();
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
	getJson : function()
	{
		var req = http.request(url, function(res) {
			res.setEncoding('utf8');
			res.on('data', function (data) {
				var jObj = JSON.parse(data);
			});
		});

		req.on('error', function(e) {
			fn.printError(e.message);
		});
	}


}

// Start App
start();
// End executeThis
}

exports.execute = executeThis;