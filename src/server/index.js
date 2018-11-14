require("@babel/register")({
	"plugins": [ "dynamic-import-node" ]
});

require('require-ensure');
require("@babel/polyfill");
require('./server.js');