(function(window, document, undefined) {

  function getQuotes(cb) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/javascripts/quotes.json', true);
    xhr.send(null);

    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          cb(JSON.parse(xhr.responseText));
        }
      }
    }
  }

  function insertQuote(text) {
    var quoteContainer = document.getElementById('quote');
    var quoteText = document.getElementById('quoteText');
    var p = document.createElement('p');

    p.textContent = text;
    p.setAttribute('id', 'quoteText');
    quote.replaceChild(p, quoteText);
  }

  var funButton = document.getElementById('clickForFun');

  funButton.addEventListener('click', function(e) {
    var quoteContainer = document.getElementById('quote');
    quoteContainer.classList.remove('visuallyhidden');

    getQuotes(function(data) {
      var quotesCount = data.length;

      var randomQuoteIndex = Math.floor((Math.random() * (quotesCount - 0)) + 0);

      insertQuote(data[randomQuoteIndex]);
    });
  }, false);

}(window, document));
