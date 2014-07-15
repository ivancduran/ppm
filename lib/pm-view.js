var view = {
	item : function(item){
		console.log('├── '.grey+item.name.yellow);
	},
	install : function(pkg){
		console.log('Package: '+pkg.bold.yellow);
		console.log('----------------');
	},
	complete : function(){
		console.log('Complete!'.green);
	},
	line : function(){
		console.log('----------------');
	},
	rename : function(){
		var text = '----------------\n'+
					'Move and Rename\n'+
					'----------------\n';
		console.log(text.blue);

	},
	pkg : function(options){
		console.log('Name        : '+options.nam.underline);
		console.log('Version     : '+options.ver.underline);
		console.log('Author      : '+options.auth.underline);
		console.log('Description : '+options.desc.underline);
		console.log('----------------');
	},
	help : function(){
		var	text = 'Commands: \n'+
					'-v, --version       print version \n'+
					'-l, --list          listing packages \n'+
					'-in, --install      install packages,     example : ppm install crypt \n'+
					'-nc, --no-cache     clean cache,          example : ppm -nc \n'+
					'-u, --update        update packages,      example : ppm update \n'+
					'-i, --info          install packages,     example : ppm info crypt \n'+
					'-uni, --uninstall   uninstall packages,   example : ppm uninstall crypt \n';

		console.log(text.white);
	},
	notfound : function(arr){
		arr.forEach(function(item){
			console.log('*** Library not found: '.red+item.red);
		});
	},
	update : function(){
		var text = 'Package file has been updated';
		console.log(text.green);
	},
	delcache : function(){
		var text = 'Cache has been cleaned';
		console.log(text.green);
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
					" ''--..__      `\              Phalcon Package Manager  \n"+
					"         ``''---'`\      .'    Version: 0.0.6           \n"+
					"                   `'. '      By: @ivancduran			 \n"+
					"                     `'. 								 \n"+
					"Site: http://phalconpm.com								 \n"+
					"Project: https://github.com/ivancduran/ppm";
		console.log(text.cyan);
	}
};

module.exports = view;
