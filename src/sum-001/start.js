window.onload = function() {
  SaxonJS.transform({
    "stylesheetLocation": "sum.sef.json",
    "initialTemplate": "Q{http://www.w3.org/1999/XSL/Transform}initial-template"
  }, "async");
}