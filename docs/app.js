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
      var idx = quote.indexOf(label);
      var quoteFinal;
      if (idx !== -1) {
        var before = quote.substring(0, idx);
        var after = quote.substring(idx + label.length);
        quoteFinal = (before ? '<span class="fade-text">' + before + '</span>' : '') +
                     '<strong>' + label + '</strong>' +
                     (after ? '<span class="fade-text">' + after + '</span>' : '');
      } else {
        quoteFinal = '<span class="fade-text">' + quote + '</span>';
      }
      return {
        quote: quoteFinal,
        rawLength: item.quote.length,
        author: '-' + item.author,
        book: item.book,
        biblio_link: item.biblio_link || null
      };
    }
    return { quote: '<span class="fade-text">' + time + '</span>', rawLength: time.length, book: '', author: '', biblio_link: null };
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

    if (litTime.rawLength > 300) {
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

      function scheduleNextUpdate() {
        var now = new Date();
        var msToNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
        var fadeDelay = msToNextMinute - 2000;
        var contentEl = document.getElementById('clock-content');

        /* The fade timer always fires before the minute-change timer
           (fadeDelay < msToNextMinute), so by the time scheduleNextUpdate()
           is called again there is no outstanding fade timer to clear. */
        if (fadeDelay > 0) {
          setTimeout(function () {
            contentEl.classList.add('fading');
          }, fadeDelay);
        }

        setTimeout(function () {
          updateDisplay(clockData);
          /* Two animation frames let the browser paint the new content at
             opacity:0 (the .fading rule is still active on the container)
             before we remove the class to trigger the CSS fade-in transition.
             This is a standard double-rAF technique for forcing a style
             recalculation between two paint frames. */
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              contentEl.classList.remove('fading');
            });
          });
          scheduleNextUpdate();
        }, msToNextMinute);
      }
      scheduleNextUpdate();
    });
}());
