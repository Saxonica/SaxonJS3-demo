const SaxonJS = require('../js/SaxonJS3N.js');

let func = function(arr) {
  let sum = 0;
  for (let index = 0; index < arr.length; index++) {
    sum += arr[index];
  }
  return sum;
}

// This is the API description that we need to
// register to make our function available.
signatures = {
  "namespace": "https://saxonica.com/ns/example/functions",
  "signatures": {
    "sum-array": {
      "as": "xs:decimal",
      "param": ["array(xs:decimal)"],
      "arity": [1],
      "impl": func
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
