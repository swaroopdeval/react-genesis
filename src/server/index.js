require( "babel-register" )({
	"plugins": [ "dynamic-import-node" ]
});
require('require-ensure')
require('./server.js');