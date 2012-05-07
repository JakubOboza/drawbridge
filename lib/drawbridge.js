var jsdom       = require('jsdom');
var html5       = require('html5');
var path        = require('path');
window          = jsdom.jsdom(null, null, {parser: html5}).createWindow();
var jquery_path = "./jquery-1.7.2.min.js";

function Drawbridge(body, callback){
	var document = jsdom.jsdom(body);
	var window = document.createWindow();
	jsdom.jQueryify(window, jquery_path, function(){
		callback(window);
	});

}

module.exports = Drawbridge;