if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(function (err) {
    console.error('Service worker registration failed:', err);
  });
}
