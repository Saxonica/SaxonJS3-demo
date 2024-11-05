window.onload = function() {

  // Very primitive JavaScript "clock"
  function showTime(clock) {
    clock(new Date());
    setTimeout(function() { showTime(clock); }, 1000);
  }

  SaxonJS.transform({
    "stylesheetLocation": "clock.sef.json",
    "initialTemplate": "Q{http://www.w3.org/1999/XSL/Transform}initial-template"
  }, "async")
  .then(result => {
    const clock = SaxonJS["xsltFunctionMapper"].lookup("Q{https://www.saxonica.com/ns/functions}clock")
    showTime(clock);
  })

}
