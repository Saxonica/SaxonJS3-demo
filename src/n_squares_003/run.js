const SaxonJS = require('../js/SaxonJS3N.js');

let func = function*(seq) {
  let squares = []
  for (item of seq) {
    squares.push(item * item);
  }
  yield* squares;
}

// This is the API description that we need to
// register to make our function available.
signatures = {
  "namespace": "https://saxonica.com/ns/example/functions",
  "signatures": {
    "squares-array-sequence": {
      "as": "xs:decimal*",
      "param": ["array(xs:decimal)"],
      "impl": func,
      "arity": [1]
    }
  }
}

// Register the function.
SaxonJS["registerExtensionFunctions"](signatures);

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
