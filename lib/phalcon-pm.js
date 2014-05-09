#!/usr/bin/env node

'use strict'

var fs      = require('fs');
var https   = require('https');
var request = require('request');
var unzip   = require('unzip');
var exec    = require('child_process').exec;

// Start executeThis
function executeThis() {

var child;
var folder = 'app/library';
var url  = 'https://raw.githubusercontent.com/ivancduran/ppm/master/pkg.json';

// if (fs.existsSync(path)) {
//     // Do something
//     console.log('exist');
// }

// // Or

// fs.exists(path, function(exists) {
//     if (exists) {
//         console.log(exists);
//     }
// });

var error = function(num){
	switch(num){
		case 0:
			console.log('| (• ◡•)| <( NOPE!, the parameter does not exist! )');
		break;
		
		case 1:
			console.log('install "something", check the list with "ppm list"');
		break;

		case 2:
			console.log('library was not found');
		break;
	}
}

var view = {
	install : function(pkg){
		console.log('Package: '+pkg);
		console.log('----------------');
		console.log('Installing');
		console.log('----------------');
	},
	complete : function(){
		console.log('Complete!');
	},
	line : function(){
		console.log('----------------');
	},
	rename : function(){
		console.log('----------------');
		console.log('Move and Rename');
		console.log('----------------');
	},
	pkg : function(options){
		console.log('Name        : '+options.nam);
		console.log('Version     : '+options.ver);
		console.log('Author      : '+options.auth);
		console.log('Description : '+options.desc);
		console.log('----------------');
	}
}

var deleteFolderRecursive = function(path) {
    var files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

var gitSplithttp = function(git){
	var g = git.split('/');
	var src = 'https://raw.githubusercontent.com/'+g[3]+'/'+g[4]+'/master/package.json';
	return src;
}

if(process.argv[2]!==undefined){
switch(process.argv[2]){
case 'install':
	if(process.argv[3]===undefined){
		// Error 1
		error(1);
	}else{
		var req = https.request(url, function(res) {
		  res.setEncoding('utf8');
		  res.on('data', function (data) {
		       var jsonObject = JSON.parse(data);
		       var check = 0;
		       	jsonObject.pkg.forEach(function(item) {
		       		if(item.name===process.argv[3]){
		       			check = 1;

		       			view.install(item.name);

		       			var req = https.request(gitSplithttp(item.src), function(res) {
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


			  				child = exec('git clone '+json.repository+' '+folder+'/'+nf[nf.length-1], function (error, stdout, stderr) {
							  if (error !== null) {
							    console.log('exec error: ' + error);
							  }else{
							  	view.complete();
							  	// console.log(stdout);	
							  }
							});
	
						  });

						});
						req.end();


		       		}
				});

		       	if(check===0){error(2);}
		  });
		});
		req.end();
	}
break;

case 'list':
	var req = https.request(url, function(res) {
	  res.setEncoding('utf8');
	  res.on('data', function (data) {
	       var jsonObject = JSON.parse(data);
			jsonObject.pkg.forEach(function(item) {
				console.log('+ '+item.name);
			});
	  });
	});
	req.end();
break;

case 'update':
var jsonfile = {
	"test" : "json",
	"file" : "dos",
	"prueba" : "json"
}

var data = JSON.stringify(jsonfile);

fs.writeFile('ppm.json', data, function (err) {
  if (err) return console.log(err);
});

break;

case 'uninstall':

break;

default:
	// Error 0, no params
	error(0);
break;
}
}

// End executeThis
}

exports.execute = executeThis;