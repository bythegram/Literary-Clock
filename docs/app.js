(function () {
  var clockData = [];
  var daysData = [];
  var monthsData = [];
  var datesData = [];
  var currentMode = 'clock';
  var loadedCount = 0;
  var TOTAL_FILES = 4;

  var DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
                     'July', 'August', 'September', 'October', 'November', 'December'];

  function shuffleArray(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  }

  function buildQuoteResult(item, fallbackLabel) {
    var quote = item.quote.toLowerCase();
    var label = (item.label || fallbackLabel || '').toLowerCase();
    var idx = label ? quote.indexOf(label) : -1;
    var quoteFinal;
    if (idx !== -1) {
      var before = quote.substring(0, idx);
      var after = quote.substring(idx + label.length);
      quoteFinal = (before ? '<span>' + before + '</span>' : '') +
                   '<strong>' + label + '</strong>' +
                   (after ? '<span>' + after + '</span>' : '');
    } else {
      quoteFinal = '<span>' + quote + '</span>';
    }
    return {
      quote: quoteFinal,
      rawLength: item.quote.length,
      author: '-' + item.author,
      book: item.book,
      biblio_link: item.biblio_link || null
    };
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
      return buildQuoteResult(item, time);
    }
    return { quote: '<strong>' + time + '</strong>', rawLength: time.length, book: '', author: '', biblio_link: null };
  }

  function getDayOfWeek(data) {
    var dayName = DAY_NAMES[new Date().getDay()];
    var matches = data.filter(function (item) {
      return item.day === dayName;
    });
    var item = matches[0];
    if (item) {
      return buildQuoteResult(item, dayName.toLowerCase());
    }
    // Fallback: show day name as bold text
    return { quote: '<strong>' + dayName.toLowerCase() + '</strong>', rawLength: dayName.length, book: '', author: '', biblio_link: null };
  }

  function getDate(data) {
    var now = new Date();
    var dateKey = (now.getMonth() + 1) + '/' + now.getDate();
    var matches = data.filter(function (item) {
      return item.date === dateKey;
    });
    var item = matches[0];
    if (item) {
      return buildQuoteResult(item, item.label);
    }
    // Fallback: show the date as bold text
    var monthName = MONTH_NAMES[now.getMonth()];
    var day = now.getDate();
    var fallbackLabel = monthName.toLowerCase() + ' ' + day;
    return { quote: '<strong>' + fallbackLabel + '</strong>', rawLength: fallbackLabel.length, book: '', author: '', biblio_link: null };
  }

  function getMonth(data) {
    var monthName = MONTH_NAMES[new Date().getMonth()];
    var matches = data.filter(function (item) {
      return item.month === monthName;
    });
    var item = matches[0];
    if (item) {
      return buildQuoteResult(item, monthName.toLowerCase());
    }
    // Fallback: show month name as bold text
    return { quote: '<strong>' + monthName.toLowerCase() + '</strong>', rawLength: monthName.length, book: '', author: '', biblio_link: null };
  }

  function renderQuoteResult(litTime) {
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

  function showMode(mode) {
    var clockContent = document.getElementById('clock-content');
    var infoPanel = document.getElementById('info-panel');

    if (mode === 'info') {
      clockContent.hidden = true;
      infoPanel.hidden = false;
    } else {
      clockContent.hidden = false;
      infoPanel.hidden = true;
      if (mode === 'clock') {
        renderQuoteResult(getTime(clockData));
      } else if (mode === 'day') {
        renderQuoteResult(getDayOfWeek(daysData));
      } else if (mode === 'date') {
        renderQuoteResult(getDate(datesData));
      } else if (mode === 'month') {
        renderQuoteResult(getMonth(monthsData));
      }
    }
  }

  function updateDisplay() {
    showMode(currentMode);
  }

  function onAllLoaded() {
    loadedCount++;
    if (loadedCount < TOTAL_FILES) { return; }

    clockData = shuffleArray(clockData);

    updateDisplay();

    // Wire up nav buttons
    var buttons = document.querySelectorAll('.mode-btn');
    for (var i = 0; i < buttons.length; i++) {
      (function (btn) {
        btn.addEventListener('click', function () {
          currentMode = btn.getAttribute('data-mode');
          for (var k = 0; k < buttons.length; k++) {
            buttons[k].classList.remove('active');
            buttons[k].setAttribute('aria-pressed', 'false');
          }
          btn.classList.add('active');
          btn.setAttribute('aria-pressed', 'true');
          showMode(currentMode);
        });
      }(buttons[i]));
    }

    // ── Timing helpers ──────────────────────────────────────────────────
    function msUntilNextMinute() {
      var now = new Date();
      return (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
    }

    function msUntilMidnight() {
      var now = new Date();
      var midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      return midnight.getTime() - now.getTime();
    }

    function msUntilNextMonth() {
      var now = new Date();
      var firstOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      return firstOfNextMonth.getTime() - now.getTime();
    }

    // ── Clock: refresh at each minute boundary ───────────────────────────
    var clockTimeoutId = null;
    function scheduleClockUpdate() {
      if (clockTimeoutId !== null) {
        clearTimeout(clockTimeoutId);
        clockTimeoutId = null;
      }
      clockTimeoutId = setTimeout(function () {
        clockTimeoutId = null;
        if (currentMode === 'clock') {
          renderQuoteResult(getTime(clockData));
        }
        scheduleClockUpdate();
      }, msUntilNextMinute());
    }
    scheduleClockUpdate();

    // ── Day of Week + Date: refresh at midnight (new day) ────────────────
    var dayTimeoutId = null;
    function scheduleDayUpdate() {
      if (dayTimeoutId !== null) {
        clearTimeout(dayTimeoutId);
        dayTimeoutId = null;
      }
      dayTimeoutId = setTimeout(function () {
        dayTimeoutId = null;
        if (currentMode === 'day') {
          renderQuoteResult(getDayOfWeek(daysData));
        } else if (currentMode === 'date') {
          renderQuoteResult(getDate(datesData));
        }
        scheduleDayUpdate();
      }, msUntilMidnight());
    }
    scheduleDayUpdate();

    // ── Month: refresh at the start of the next month ────────────────────
    var monthTimeoutId = null;
    function scheduleMonthUpdate() {
      if (monthTimeoutId !== null) {
        clearTimeout(monthTimeoutId);
        monthTimeoutId = null;
      }
      monthTimeoutId = setTimeout(function () {
        monthTimeoutId = null;
        if (currentMode === 'month') {
          renderQuoteResult(getMonth(monthsData));
        }
        scheduleMonthUpdate();
      }, msUntilNextMonth());
    }
    scheduleMonthUpdate();

    // ── Page Visibility API: re-sync when the tab becomes visible ────────
    // Browsers throttle background timers and device sleep skips them
    // entirely. Re-render and reschedule all chains on visibility restore
    // so the display is never stale when the user returns to the tab.
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible') {
        showMode(currentMode);
        scheduleClockUpdate();
        scheduleDayUpdate();
        scheduleMonthUpdate();
      }
    });
  }

  fetch('litclock.json')
    .then(function (res) {
      if (!res.ok) { throw new Error('Failed to load litclock.json: ' + res.status); }
      return res.json();
    })
    .then(function (data) { clockData = data; })
    .catch(function (err) { if (typeof console !== 'undefined' && console.error) { console.error(err); } })
    .then(function () { onAllLoaded(); });

  fetch('litdays.json')
    .then(function (res) {
      if (!res.ok) { throw new Error('Failed to load litdays.json: ' + res.status); }
      return res.json();
    })
    .then(function (data) { daysData = data; })
    .catch(function (err) { if (typeof console !== 'undefined' && console.error) { console.error(err); } })
    .then(function () { onAllLoaded(); });

  fetch('litmonths.json')
    .then(function (res) {
      if (!res.ok) { throw new Error('Failed to load litmonths.json: ' + res.status); }
      return res.json();
    })
    .then(function (data) { monthsData = data; })
    .catch(function (err) { if (typeof console !== 'undefined' && console.error) { console.error(err); } })
    .then(function () { onAllLoaded(); });

  fetch('litdates.json')
    .then(function (res) {
      if (!res.ok) { throw new Error('Failed to load litdates.json: ' + res.status); }
      return res.json();
    })
    .then(function (data) { datesData = data; })
    .catch(function (err) { if (typeof console !== 'undefined' && console.error) { console.error(err); } })
    .then(function () { onAllLoaded(); });
}());
