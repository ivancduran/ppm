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
//     print('exist');
// }

var print = console.log;

var start = function(){

if (process.argv[2]!==undefined){

switch(process.argv[2]){

// INSTALL ****************************************
case '-i': case 'install':

	if (process.argv[3]===undefined){
		// Error 1
		error(1);
	}else{
		var req = https.request(url, function(res) {
		  res.setEncoding('utf8');
		  res.on('data', function (data) {

	       var jsonObject = JSON.parse(data);
	       var check = 0;

	       	jsonObject.pkg.forEach(function(item) {
	       		if (item.name===process.argv[3]){
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
						    print('exec error: ' + error);
						  } else {
						  	view.complete();
						  	// print(stdout);	
						  }
						});

					  });

					});
					req.end();

			}});
		       	if (check===0){error(2);}
		  });
		});

		req.on('error', function(e) {
		  print('Problem with request: ' + e.message);
		});

		req.end();
	}
break;

// LIST ****************************************
case '-l': case 'list':
	var req = https.request(url, function(res) {
	  res.setEncoding('utf8');
	  res.on('data', function (data) {
	       var jsonObject = JSON.parse(data);
			jsonObject.pkg.forEach(function(item) {
				print('+ '+item.name);
			});
	  });
	});

	req.on('error', function(e) {
	  print('Problem with request: ' + e.message);
	});

	req.end();
break;

// UPDATE ****************************************
case '-u': case 'update':
	var jsonfile = {
		"test" : "json",
		"file" : "dos",
		"prueba" : "json"
	}

	var data = JSON.stringify(jsonfile);

	fs.writeFile('ppm.json', data, function (err) {
	  if (err) return print(err);
	});
break;

// UNINSTALL ****************************************
case '-ui': case 'uninstall':
	print('hola');
break;

// VERSION ****************************************
case '-v': case 'version':
	print('Version: 0.0.1');
break;

// HELP ****************************************
case '-h': case 'help':
	view.phalcon();
	view.line();
	view.help();
break;

// ERROR
default:
	// Error 0, no params
	error(0);
break;

}} else{
	error(3);
}
// end start = function();
}

var error = function(num){
	switch(num){
		case 0:
			print('| (• ◡•)| <( NOPE!, the parameter does not exist! )');
		break;
		
		case 1:
			print('install "something", check the list with "ppm list"');
		break;

		case 2:
			print('Library was not found');
		break;

		case 3:
			print('No arguments, please see the list of commands: "ppm help" or "ppm -h"');
		break;
	}
}

var view = {
	install : function(pkg){
		print('Package: '+pkg);
		print('----------------');
		print('Installing');
		print('----------------');
	},
	complete : function(){
		print('Complete!');
	},
	line : function(){
		print('----------------');
	},
	rename : function(){
		var text = '----------------'+
					'Move and Rename'+
					'----------------';
		print(text);
	},
	pkg : function(options){
		print('Name        : '+options.nam);
		print('Version     : '+options.ver);
		print('Author      : '+options.auth);
		print('Description : '+options.desc);
		print('----------------');
	},
	help : function(){
		var	text = 'Commands: \n'+
					'-v, --version        print version \n'+
					'-l, --list           listing packages \n'+
					'-i, --install        install packages, example : ppm install crypt \n'+
					'-u, --update         update packages, example : ppm update crypt \n'+
					'-ui, --uninstall     uninstall packages, example : ppm uninstall crypt \n';

		print(text);
	},
	phalcon : function(){
		var text = "                                               _...__..-'\n"+
					"                                             .'		 \n"+
					"    The Fastest                             .'			 \n"+
					"          Php Framework                   .'			 \n"+
					"                                       .'				 \n"+
					"            .------._                 ;				 \n"+
					"      .-''' `-.<')    `-._           .'				 \n"+
					"     (.--. _   `._       `'---.__.-'					 \n"+
					"      `   `;'-.-'         '-    ._ 					 \n"+
					"        .--'``  '._      - '   .   					 \n"+
					"         `''-.    `---'    ,							 \n"+
					" ''--..__      `\              Phalcon Package Manager	 \n"+
					"         ``''---'`\      .'    Version: 0.0.1 			 \n"+
					"                   `'. '      By: @ivancduran			 \n"+
					"                     `'. 								 \n"+
					"Project Url: https://github.com/ivancduran/ppm";
		print(text);
	}
}

var deleteFolderRecursive = function(path) {
    var files = [];
    if (fs.existsSync(path)) {
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

start();

// End executeThis
}

exports.execute = executeThis;