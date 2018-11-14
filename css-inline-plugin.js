'use strict';
var fs = require('fs');
var path = require('path');
require('es6-promise').polyfill();

function CssInlinePlugin(settings) {
	this.settings = settings;
}

CssInlinePlugin.prototype.apply = function(compiler) {
	compiler.plugin('done', function() {
        generate(this.settings).then((cssFileContents) => {
	    });
    }.bind(this));
};

function generate(params) {
	return Promise.all(
		params.files.map(function(item) {
            return new Promise(function (resolve, reject) {
            	var templateFilePath = item.template;
				var cssFilePath = item.css;
				fs.readFile(templateFilePath, 'utf8', function(error, templateFile) {
					if (error) {
		    			return reject(error);
		    		}

		    		return fs.readFile(cssFilePath, 'utf8', function(error, cssFile) {
		    			var cssdata = templateFile.replace('<addinlinestylehere></addinlinestylehere>', '<style type="text/css">'+cssFile+'</style>').replace(/\/\*# sourceMappingURL=(.*)\*\//g, `/*# sourceMappingURL=/dist/$1*/`);
				        fs.writeFile(templateFilePath, cssdata, (err) => {
							if (err) throw err;
								console.log(cssFilePath+ ': Css File Generated');
						});
						resolve(cssdata);
		    		});

				});
            });
        })
	)
}

module.exports = CssInlinePlugin;
