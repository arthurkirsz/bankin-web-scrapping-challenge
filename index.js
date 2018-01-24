var fs = require('fs');
var casper = require('casper').create();

// Extend casper with a nice file saving function
casper.saveJSON = function(json) {
  fs.write('json/bankin-' + Date.now() + '.json', JSON.stringify(json, null, '  '), 'w');
};

// Close alert popup if it occurs
casper.on('remote.alert', function(message) {
  return true;
});

// Just get each row from the table, and parse each child
function scrape () {
  var rows = document.querySelectorAll('tr:not(:first-child)'); // Don't scrap table headings
  return Array.prototype.map.call(rows, function (row) {
    var cells = row.childNodes;
    var Account = cells[0].innerText;
    var Transaction = cells[1].innerText.match(/\S+\s(.+)/i)[1]; // Extract after first space
    var Amount = cells[2].innerText.substr(0, cells[2].innerText.length - 1);
    var Currency = cells[2].innerText.slice(-1);
    return { "Account": Account, "Transaction": Transaction, "Amount": Amount, "Currency": Currency };
  });
}

var results = [];
casper.start('https://web.bankin.com/challenge/index.html');

// Fun fact : we can clean the page from it's deadly traps so it does not disturb us
casper.then(function () {
  this.evaluate(function () {
    window.failmode = false;
    window.hasiframe = false;
    window.slowmode = false;
  });
});

// Load rows to scrap, 50 per iteration
for(var i = 0; i < 5000; i += 50) {
  (function(i) {
    casper.then(function () {
      // Before extraction, make the page load the results from the right offset
      this.evaluate(function (offset) {
        window.start = offset;
        window.doGenerate();
      }, i);
      // Extract data from DOM and concat to results
      results = results.concat(this.evaluate(scrape));
    });
  })(i);
}

casper.run(function () {
  // Saves our results in the file system before exit
  this.saveJSON(results);
  casper.exit();
});