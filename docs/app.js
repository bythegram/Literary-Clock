(function () {
  var clockData = [];

  function shuffleArray(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  }

  function getTime(data) {
    var date = new Date();
    var hour = date.getHours();
    var min = ('0' + date.getMinutes()).slice(-2);
    var time = hour + ':' + min;
    var matches = data.filter(function (item) {
      return item.timecode === time;
    });
    var item = matches[0];
    if (item) {
      var quote = item.quote.toLowerCase();
      var label = item.label.toLowerCase();
      return {
        quote: quote.replace(label, '<strong>' + label + '</strong>'),
        author: '-' + item.author,
        book: item.book,
        biblio_link: item.biblio_link || null
      };
    }
    return { quote: time, book: '', author: '', biblio_link: null };
  }

  function updateDisplay(data) {
    var litTime = getTime(data);
    var quoteEl = document.getElementById('quote');
    var bookEl = document.getElementById('book');
    var authorEl = document.getElementById('author');

    quoteEl.innerHTML = litTime.quote;
    if (litTime.biblio_link) {
      var linkEl = document.createElement('a');
      linkEl.href = litTime.biblio_link;
      linkEl.target = '_blank';
      linkEl.rel = 'noopener noreferrer';
      linkEl.textContent = litTime.book;
      bookEl.innerHTML = '';
      bookEl.appendChild(linkEl);
    } else {
      bookEl.textContent = litTime.book;
    }
    authorEl.textContent = litTime.author;

    if (litTime.quote.length > 300) {
      quoteEl.classList.add('smaller');
    } else {
      quoteEl.classList.remove('smaller');
    }
  }

  fetch('litclock.json')
    .then(function (res) { return res.json(); })
    .then(function (data) {
      clockData = shuffleArray(data);
      updateDisplay(clockData);

      var now = new Date();
      var msToNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
      setTimeout(function () {
        updateDisplay(clockData);
        setInterval(function () {
          updateDisplay(clockData);
        }, 60000);
      }, msToNextMinute);
    });
}());
