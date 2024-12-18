const SaxonJS = require('../js/SaxonJS3N.js');

SaxonJS.transform({
  "stylesheetLocation": "sum.sef.json",
  "initialTemplate": "Q{http://www.w3.org/1999/XSL/Transform}initial-template",
  "destination": "serialized",
  "stylesheetParams": {
    "Q{}a": 4,
    "Q{}b": 5
  }
}, "async")
.then(result => {
  console.log(result.principalResult)
});
