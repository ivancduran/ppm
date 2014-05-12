#!/usr/bin/env node

'use strict'

var fs      = require('fs');
var http   = require('http');
var https   = require('https');
// var request = require('request');
// var unzip   = require('unzip');
var exec    = require('child_process').exec;

// Start executeThis
function executeThis() {

// var child;
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
				printError(err);
				var jObj1 = JSON.parse(data);
				var errorlibs = Object.keys(jObj1.dependencies);
				var fObj = Array();
				var eArr = Array();

				var req = http.request(url, function(res) {
				  res.setEncoding('utf8');
				  res.on('data', function (data) {

			       var jObj = JSON.parse(data);

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

					eArr.forEach(function(item){
						var off = errorlibs.indexOf(item);
						errorlibs.splice(off,1);
					});

					var	pkg = new Object();
					pkg['pkg'] = fObj;

					// install packages
					fn.install(pkg,true);

				  });
				});

				req.end();

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
		  // print('Problem with request: ' + e.message);
			printError(e.message);
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
				print('+ '+item.name);
			});
	  });
	});

	req.on('error', function(e) {
		printError(e.message);
	  // print('Problem with request: ' + e.message);
	});

	req.end();
break;

// UPDATE ****************************************
case '-u': case 'update':

	// if (fs.existsSync('ppm.json')) {
	// 	fs.readFile('ppm.json', 'utf8', function (err,data) {
	// 		printError(err);
	// 		var jObj = JSON.parse(data);
	// 		print(jObj.file);
	// 	});
	// }


	var jsonfile = { "dependencies" :
					  { "foo" : "1.0.0 - 2.9999.9999"
					  , "bar" : ">=1.0.2 <2.1.2"
					  , "baz" : ">1.0.2 <=2.3.4"
					  , "boo" : "2.0.1"
					  , "qux" : "<1.0.0 || >=2.3.1 <2.4.5 || >=2.5.2 <3.0.0"
					  , "asd" : "http://asdf.com/asdf.tar.gz"
					  , "til" : "~1.2"
					  , "elf" : "~1.2.3"
					  , "two" : "2.x"
					  , "thr" : "3.3.x"
					  }
					}

	var data = JSON.stringify(jsonfile,null,4);

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

// ERROR ****************************************
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
			print('install "something", check the list with "ppm list" or create your ppm.json file');
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
					'-i, --install        install packages,     example : ppm install crypt \n'+
					'-u, --update         update packages,      example : ppm update crypt \n'+
					'-ui, --uninstall     uninstall packages,   example : ppm uninstall crypt \n';

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

var printError = function(err){
	if (err) return print(err);
}

var removeA = function(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}

var fn = {
	install : function(jObj,options){

		var check = 0;

		jObj.pkg.forEach(function(item) {
       		if (item.name===process.argv[3] || options === true){
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

	  				var child = exec('git clone '+json.repository+' '+folder+'/'+nf[nf.length-1], function (err, stdout, stderr) {

					 	deleteFolderRecursive(folder+'/'+nf[nf.length-1]+'/.git');

					 	printError(err);
					  	view.complete();
					});

				  });

				});
				req.end();
		}});
		
		if (check===0){ error(2); }

	}
}

start();

// End executeThis
}

exports.execute = executeThis;