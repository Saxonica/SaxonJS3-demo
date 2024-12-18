const SaxonJS = require('../js/SaxonJS3N.js');

SaxonJS.transform({
  "stylesheetLocation": "squares.sef.json",
  "initialTemplate": "Q{http://www.w3.org/1999/XSL/Transform}initial-template",
  "destination": "serialized",
  "stylesheetParams": {
    "Q{}a": 2,
    "Q{}b": 3,
    "Q{}c": 4
  }
}, "async")
.then(result => {
  console.log(result.principalResult)
});
