const SaxonJS = require('../js/SaxonJS3N.js');

// Seq will be a JavaScript iterator
let func = function(seq) {
  let sum = 0;
  for (item of seq) {
    sum += item;
  }
  return sum;
}

// This is the API description that we need to
// register to make our function available.
signatures = {
  "namespace": "https://saxonica.com/ns/example/functions",
  "signatures": {
    "sum-sequence": {
      "as": "xs:decimal",
      "param": ["xs:decimal*"],
      "impl": func,
      "arity": [1]
    }
  }
}

// Register the function.
SaxonJS["registerExtensionFunctions"](signatures);

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
