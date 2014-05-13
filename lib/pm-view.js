var view = {
	install : function(pkg){
		console.log('Package: '+pkg);
		console.log('----------------');
	},
	complete : function(){
		console.log('Complete!');
	},
	line : function(){
		console.log('----------------');
	},
	rename : function(){
		var text = '----------------'+
					'Move and Rename'+
					'----------------';
		console.log(text);
	},
	pkg : function(options){
		console.log('Name        : '+options.nam);
		console.log('Version     : '+options.ver);
		console.log('Author      : '+options.auth);
		console.log('Description : '+options.desc);
		console.log('----------------');
	},
	help : function(){
		var	text = 'Commands: \n'+
					'-v, --version        print version \n'+
					'-l, --list           listing packages \n'+
					'-i, --install        install packages,     example : ppm install crypt \n'+
					'-u, --update         update packages,      example : ppm update crypt \n'+
					'-ui, --uninstall     uninstall packages,   example : ppm uninstall crypt \n';

		console.log(text);
	},
	notfound : function(arr){
		arr.forEach(function(item){
			console.log('*** Library not found: '+item);
		});
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
		console.log(text);
	}
}

module.exports = view;