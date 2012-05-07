var request    = require('superagent');
var drawbridge = require('../lib/drawbridge');
var http       = require('http');

exports.index = function(req, res){
  res.render('index.ejs', { title: 'Scumbag.js' });
};

function performSearch(query, result_callback){

  request.get('http://thepiratebay.se/search/' + query + '/0/7/0').set("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8")
    .set("Accept-Charset", "ISO-8859-1,utf-8;q=0.7,*;q=0.3")
    .set("Accept-Encoding", "gzip,deflate,sdch")
    .set("Connection", "keep-alive")
    .set("User-Agent","Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_3) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.165 Safari/535.19")
    .end(function(res){
    result_callback(res.text);
  });


}

function getTorrents(query, callback){
  performSearch(query, function(result){
    drawbridge(result, function(window){

     var results = [];

      var result_lines = window.$("#searchResult tbody tr");

      for(var i = 0; i < result_lines.length; i ++  ){
        var line = result_lines[i];
        var name = window.$( line ).find("div.detName a").html();
        var torrent_link = window.$(window.$( line ).find('[title="Download this torrent"]')); 
        var magnet_link = window.$(window.$( line).find('[title="Download this torrent using magnet"]') );
        var seeds = window.$(line).find('[align="right"]');
          results.push({
            name: name,
            torrent_link:  torrent_link.attr('href'),
            magnet_link: magnet_link.attr('href'),
            seeds: window.$(seeds[0]).html(),
            leeches: window.$(seeds[1]).html()
          });

      }

      callback(results);

    });
  }); 
}


exports.search = function(req, res){
  var query = req.body["q"];
  if(query){
  
    getTorrents(query, function(results){
      //res.send({body:  results });    
      res.render('search.ejs', {results: results, title: "Results" });
    });
  
  }else{
    res.send({query: req.query, params: req.params, body: req.body});
  }
  //res.render('search.ejs', {title: 'Search Result'})
}