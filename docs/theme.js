(function () {
  var mq = window.matchMedia('(prefers-color-scheme: dark)');
  document.documentElement.setAttribute('data-theme', mq.matches ? 'dark' : 'light');
  if (mq.addEventListener) {
    mq.addEventListener('change', function (e) {
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    });
  } else {
    mq.addListener(function (e) {
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    });
  }
}());
