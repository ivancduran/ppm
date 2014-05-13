var error = function(num){
	switch(num){
		case 0:
			console.log('| (• ◡•)| <( NOPE!, the parameter does not exist! )');
		break;
		
		case 1:
			console.log('install "something", check the list with "ppm list" or create your ppm.json file');
		break;

		case 2:
			console.log('Library was not found');
		break;

		case 3:
			console.log('No arguments, please see the list of commands: "ppm help" or "ppm -h"');
		break;
	}
}

module.exports = error;