var error = function(num){
	switch(num){
		case 0:
			console.log('| '.blue+'(• ◡•)'+'|'.blue+' <( NOPE!, the parameter does not exist! )');
		break;

		case 1:
			console.log('install "something", check the list with "ppm list" or create your ppm.json file'.red);
		break;

		case 2:
			console.log('Library was not found'.red);
		break;

		case 3:
			console.log('No arguments, please see the list of commands: "ppm help" or "ppm -h"'.red);
		break;
	}
};

module.exports = error;
