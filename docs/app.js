(function () {
  // Guard: Temporal API is required. Show a clear in-page message for unsupported browsers
  // rather than crashing silently with a ReferenceError.
  if (typeof Temporal === 'undefined') {
    var quoteEl = document.getElementById('quote');
    if (quoteEl) {
      quoteEl.innerHTML = '<span>Your browser does not support the Temporal API required by this app. Please upgrade to a modern browser.</span>';
    }
    return;
  }

  var clockData = [];
  var daysData = [];
  var monthsData = [];
  var datesData = [];
  var currentMode = 'clock';
  var loadedCount = 0;
  var TOTAL_FILES = 4;

  // Navigation order derived from the DOM so button order in index.html stays
  // the single source of truth for both visual position and swipe direction.
  var MODES = (function () {
    var btns = document.querySelectorAll('.mode-btn[data-mode]');
    var result = [];
    for (var i = 0; i < btns.length; i++) {
      var mode = btns[i].getAttribute('data-mode');
      if (mode) { result.push(mode); }
    }
    return result.length ? result : ['clock', 'day', 'date', 'month', 'info'];
  }());
  var SWIPE_THRESHOLD = 50;
  var ANIM_MS = 220;
  var isAnimating = false;
  var touchStartX = 0;
  var touchStartY = 0;
  var touchId = null;

  function shuffleArray(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  }

  function pickRandom(arr) {
    if (!arr.length) { return undefined; }
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function buildQuoteResult(item, fallbackLabel) {
    var quote = item.quote;
    var label = item.label || fallbackLabel || '';
    var quoteLower = quote.toLowerCase();
    var labelLower = label.toLowerCase();
    var idx = labelLower ? quoteLower.indexOf(labelLower) : -1;
    var quoteFinal;
    if (idx !== -1) {
      var before = quote.substring(0, idx);
      var matched = quote.substring(idx, idx + labelLower.length);
      var after = quote.substring(idx + labelLower.length);
      quoteFinal = (before ? '<span>' + before + '</span>' : '') +
                   '<strong>' + matched + '</strong>' +
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
    var now = Temporal.Now.zonedDateTimeISO();
    var hour = now.hour;
    var min = ('0' + now.minute).slice(-2);
    var time = hour + ':' + min;
    var matches = data.filter(function (item) {
      return item.timecode === time;
    });
    var item = pickRandom(matches);
    if (item) {
      return buildQuoteResult(item, time);
    }
    return { quote: '<strong>' + time + '</strong>', rawLength: time.length, book: '', author: '', biblio_link: null };
  }

  function getDayOfWeek(data) {
    var now = Temporal.Now.zonedDateTimeISO();
    var dayName = now.toLocaleString('en-US', { weekday: 'long' });
    var matches = data.filter(function (item) {
      return item.day === dayName;
    });
    var item = pickRandom(matches);
    if (item) {
      return buildQuoteResult(item, dayName);
    }
    // Fallback: show day name as bold text
    return { quote: '<strong>' + dayName + '</strong>', rawLength: dayName.length, book: '', author: '', biblio_link: null };
  }

  function getDate(data) {
    var today = Temporal.Now.plainDateISO();
    var dateKey = today.month + '/' + today.day;
    var matches = data.filter(function (item) {
      return item.date === dateKey;
    });
    var item = pickRandom(matches);
    if (item) {
      return buildQuoteResult(item, item.label);
    }
    // Fallback: show the date as bold text
    var fallbackLabel = today.toLocaleString('en-US', { month: 'long', day: 'numeric' });
    return { quote: '<strong>' + fallbackLabel + '</strong>', rawLength: fallbackLabel.length, book: '', author: '', biblio_link: null };
  }

  function getMonth(data) {
    var now = Temporal.Now.zonedDateTimeISO();
    var monthName = now.toLocaleString('en-US', { month: 'long' });
    var matches = data.filter(function (item) {
      return item.month === monthName;
    });
    var item = pickRandom(matches);
    if (item) {
      return buildQuoteResult(item, monthName);
    }
    // Fallback: show month name as bold text
    return { quote: '<strong>' + monthName + '</strong>', rawLength: monthName.length, book: '', author: '', biblio_link: null };
  }

  function renderQuoteResult(litTime) {
    var quoteEl = document.getElementById('quote');
    var authorEl = document.getElementById('author');
    var bookContainerEl = document.getElementById('book-container');

    quoteEl.innerHTML = litTime.quote;

    var hasAuthor = typeof litTime.author === 'string' && litTime.author.trim() !== '';
    authorEl.textContent = hasAuthor ? litTime.author : '';
    authorEl.hidden = !hasAuthor;

    bookContainerEl.innerHTML = '';
    if (litTime.biblio_link) {
      var linkEl = document.createElement('a');
      linkEl.href = litTime.biblio_link;
      linkEl.target = '_blank';
      linkEl.rel = 'noopener noreferrer';
      linkEl.className = 'book-btn';
      var titleSpan = document.createElement('span');
      titleSpan.textContent = litTime.book;
      linkEl.appendChild(titleSpan);
      bookContainerEl.appendChild(linkEl);
    } else if (litTime.book) {
      var titleEl = document.createElement('span');
      titleEl.className = 'book-title-plain';
      titleEl.textContent = litTime.book;
      bookContainerEl.appendChild(titleEl);
    }

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

  function activateNavButton(mode) {
    var buttons = document.querySelectorAll('.mode-btn');
    for (var i = 0; i < buttons.length; i++) {
      var isActive = buttons[i].getAttribute('data-mode') === mode;
      if (isActive) {
        buttons[i].classList.add('active');
        buttons[i].setAttribute('aria-pressed', 'true');
      } else {
        buttons[i].classList.remove('active');
        buttons[i].setAttribute('aria-pressed', 'false');
      }
    }
  }

  function getActiveEl(mode) {
    return mode === 'info'
      ? document.getElementById('info-panel')
      : document.getElementById('clock-content');
  }

  // ── Shake to toggle nav bar ──────────────────────────────────────────────
  function toggleNavBar() {
    var navBar = document.querySelector('.nav-bar');
    if (!navBar) { return; }
    var willHide = !navBar.hidden;
    navBar.hidden = willHide;
    document.body.classList.toggle('nav-hidden', willHide);
  }

  // Initialises shake detection using the DeviceMotion API.
  // On iOS 13+ the API requires an explicit user permission grant; the request
  // is deferred to the first tap/click so it fires from within a user gesture.
  function initShakeDetection() {
    if (typeof DeviceMotionEvent === 'undefined') { return; }

    var SHAKE_THRESHOLD = 15;     // sum of |Δaccel| per axis (m/s²); 15 is sensitive enough for a deliberate shake but ignores ordinary handling/walking
    var SHAKE_COOLDOWN_MS = 1000; // minimum ms between registered shakes
    var lastX = 0, lastY = 0, lastZ = 0;
    var lastShakeTime = 0;
    var firstSample = true;

    function onMotion(e) {
      var acc = e.acceleration;
      // Fall back to accelerationIncludingGravity when acceleration is absent or null
      if (!acc || (acc.x === null && acc.y === null && acc.z === null)) {
        acc = e.accelerationIncludingGravity;
      }
      if (!acc) { return; }

      var x = acc.x || 0;
      var y = acc.y || 0;
      var z = acc.z || 0;

      // Seed the previous-value variables on the first sample without triggering
      if (firstSample) {
        lastX = x; lastY = y; lastZ = z;
        firstSample = false;
        return;
      }

      var delta = Math.abs(x - lastX) + Math.abs(y - lastY) + Math.abs(z - lastZ);
      lastX = x; lastY = y; lastZ = z;

      if (delta > SHAKE_THRESHOLD) {
        var now = Temporal.Now.instant().epochMilliseconds;
        if (now - lastShakeTime > SHAKE_COOLDOWN_MS) {
          lastShakeTime = now;
          toggleNavBar();
        }
      }
    }

    function attachListener() {
      window.addEventListener('devicemotion', onMotion, false);
    }

    // iOS 13+ requires explicit permission before reading DeviceMotionEvent.
    // Keep the click listener active until permission is granted so the user
    // can retry after dismissing or denying the first prompt.
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      var motionPermissionGranted = false;
      var isRequestingMotionPermission = false;

      function requestPermOnClick() {
        if (motionPermissionGranted || isRequestingMotionPermission) { return; }
        isRequestingMotionPermission = true;
        DeviceMotionEvent.requestPermission()
          .then(function (state) {
            isRequestingMotionPermission = false;
            if (state === 'granted') {
              motionPermissionGranted = true;
              document.removeEventListener('click', requestPermOnClick);
              attachListener();
            }
          })
          .catch(function () {
            isRequestingMotionPermission = false;
          });
      }

      document.addEventListener('click', requestPermOnClick);
    } else {
      attachListener();
    }
  }

  function navigateSwipe(direction) {
    if (isAnimating) { return; }
    var idx = MODES.indexOf(currentMode);
    var nextIdx = direction === 'left' ? idx + 1 : idx - 1;

    if (nextIdx < 0 || nextIdx >= MODES.length) {
      var bounceClass = direction === 'left' ? 'swipe-bounce-left' : 'swipe-bounce-right';
      var bounceEl = getActiveEl(currentMode);
      // Remove first + force reflow so re-adding the class always restarts the animation,
      // even if a previous bounce is still in progress (e.g. rapid repeated edge swipes).
      bounceEl.classList.remove(bounceClass);
      void bounceEl.offsetWidth;
      bounceEl.classList.add(bounceClass);
      bounceEl.addEventListener('animationend', function cleanup() {
        bounceEl.classList.remove(bounceClass);
        bounceEl.removeEventListener('animationend', cleanup);
      });
      return;
    }

    isAnimating = true;
    var nextMode = MODES[nextIdx];
    var outClass = direction === 'left' ? 'slide-out-left' : 'slide-out-right';
    var inClass  = direction === 'left' ? 'slide-in-right' : 'slide-in-left';
    var outEl = getActiveEl(currentMode);

    outEl.classList.add(outClass);
    setTimeout(function () {
      outEl.classList.remove(outClass);
      currentMode = nextMode;
      activateNavButton(currentMode);
      showMode(currentMode);
      var inEl = getActiveEl(currentMode);
      inEl.classList.add(inClass);
      setTimeout(function () {
        inEl.classList.remove(inClass);
        isAnimating = false;
      }, ANIM_MS);
    }, ANIM_MS);
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
          if (isAnimating) { return; }
          currentMode = btn.getAttribute('data-mode');
          activateNavButton(currentMode);
          showMode(currentMode);
        });
      }(buttons[i]));
    }

    // Wire up swipe gestures — track a single touch identifier to ignore multi-touch
    // gestures (pinch-zoom etc.) that would produce spurious large deltas.
    var container = document.querySelector('.clock-container');
    container.addEventListener('touchstart', function (e) {
      if (e.touches.length !== 1) { touchId = null; return; }
      touchId = e.touches[0].identifier;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });
    container.addEventListener('touchend', function (e) {
      if (touchId === null) { return; }
      var touch = null;
      for (var i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchId) {
          touch = e.changedTouches[i];
          break;
        }
      }
      touchId = null;
      if (!touch) { return; }
      var deltaX = touch.clientX - touchStartX;
      var deltaY = touch.clientY - touchStartY;
      if (Math.abs(deltaX) >= SWIPE_THRESHOLD && Math.abs(deltaX) > Math.abs(deltaY)) {
        navigateSwipe(deltaX < 0 ? 'left' : 'right');
      }
    }, { passive: true });

    // ── Timing helpers ──────────────────────────────────────────────────
    function msUntilNextMinute() {
      var now = Temporal.Now.zonedDateTimeISO();
      var nextMinute = now.add({ minutes: 1 }).with({ second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 });
      return Math.max(1, Math.ceil(now.until(nextMinute).total('milliseconds')));
    }

    function msUntilMidnight() {
      var now = Temporal.Now.zonedDateTimeISO();
      var tomorrow = now.add({ days: 1 }).with({ hour: 0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 });
      return Math.max(1, Math.ceil(now.until(tomorrow).total('milliseconds')));
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

    // ── Day of Week + Date + Month: refresh at midnight (new day) ────────
    // Note: month updates are piggybacked here rather than using a separate
    // month timer because a full-month delay (28–31 days in ms) exceeds the
    // 32-bit integer limit used by setTimeout internally (~24.8 days max),
    // which would cause the timer to fire immediately and loop continuously.
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
        } else if (currentMode === 'month') {
          renderQuoteResult(getMonth(monthsData));
        }
        scheduleDayUpdate();
      }, msUntilMidnight());
    }
    scheduleDayUpdate();

    // ── Page Visibility API: re-sync when the tab becomes visible ────────
    // Browsers throttle background timers and device sleep skips them
    // entirely. Re-render and reschedule all chains on visibility restore
    // so the display is never stale when the user returns to the tab.
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible') {
        showMode(currentMode);
        scheduleClockUpdate();
        scheduleDayUpdate();
      }
    });

    initShakeDetection();
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
