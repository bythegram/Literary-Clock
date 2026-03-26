// Conditionally load the Temporal polyfill only when the native API is absent
// (e.g. iOS PWA standalone mode). document.write is safe here because this
// script is loaded as a synchronous <script> tag during initial HTML parsing,
// so the injected <script> is fully fetched and executed before app.js runs.
if (typeof Temporal === 'undefined') {
  document.write('<script src="temporal-polyfill.js"><\/script>');
}
