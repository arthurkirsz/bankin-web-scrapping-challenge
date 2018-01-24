var fs = require('fs');
var casper = require('casper').create({ verbose: true, logLevel: 'info' });


var s, e;
//we use casper events to calculate the time between a http request and its response
casper.on('page.resource.requested', function(requestData, request) {
  //console.log("request url " + requestData.url);
  s = new Date().getTime();
});

casper.on('page.resource.received', function(response) {
  //console.log("response url " + response.url);
  e = new Date().getTime();
  casper.echo("Time between HTTP request and HTTP response : " + (e-s) + "ms","INFO");
});

// Extend casper with some custom functions
casper.saveJSON = function(json) {
  fs.write('json/bankin-'+Date.now()+'.json', JSON.stringify(json, null, '  '), 'w');
};

casper.renderJSON = function(json) {
  return this.echo(JSON.stringify(json, null, '  '));
};

// Close alert popup when it occurs
casper.on('remote.alert', function(message) {
  return true;
  this.echo('ALERT: ' + message);
});

// Go fetch that !
casper.start('https://web.bankin.com/challenge/index.html');
var results = [];

// Fun fact : we can set up the page to not disturb us
function setup () {
  window.alert = function () {};
  window.failmode = false;
  window.hasiframe = false;
  window.slowmode = false;
  window.btGen = false;
}

// Just get each row from the table, and parse each child
function scrape() {
  var rows = document.querySelectorAll('tr:not(:first-child)');
  return Array.prototype.map.call(rows, function (row) {
    var Account = row.childNodes[0].innerText;
    var Transaction = row.childNodes[1].innerText.match(/\S+\s(.+)/i)[1];
    var Amount = row.childNodes[2].innerText.substr(0, row.childNodes[2].innerText.length - 1);
    var Currency = row.childNodes[2].innerText.slice(-1);
    return { "Account": Account, "Transaction": Transaction, "Amount": Amount, "Currency": Currency };
  });
}

// We set our environement properly
casper.then(function () {
  this.echo('Setting up remote page...');
  this.evaluate(setup);
});

// Load results 50 by 50, using the for
for(var i = 0; i < 5000; i += 50){
  (function(i){
    casper.then(function () {
      // Before scraping, make the page load the results from the right offset
      this.evaluate(function(offset) {
        window.start = offset;
        window.doGenerate();
      }, i);
      // casper.wait(100, function(){
        this.echo('Scraping for offset ' + i);
        // Extract data from DOM and concat to results
        results = results.concat(this.evaluate(scrape));
        // var length = results.length;
        // this.echo('length');
        // this.echo(length);
        // this.renderJSON(results);
      // });
    });
  })(i);
}

casper.run(function () {
  // Saves our results in the file system
  this.renderJSON(results);
  casper.exit();
});