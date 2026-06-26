// Runs before React hydration to set the correct theme class on <html>.
// Kept in a separate static file so index.html doesn't need
// dangerouslySetInnerHTML to inline it.
(function () {
  try {
    var t = localStorage.getItem("theme");
    var d = t === "dark";
    var r = document.documentElement;
    r.classList.remove("light", "dark");
    r.classList.add(d ? "dark" : "light");
    r.style.colorScheme = d ? "dark" : "light";
  } catch (e) {
    /* quota / private-browsing — ignore */
  }
})();
