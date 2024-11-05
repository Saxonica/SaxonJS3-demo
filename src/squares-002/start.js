window.onload = function() {
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
      "squares-sequences": {
        "as": "xs:decimal*",
        "param": ["xs:decimal*"],
        "impl": func,
        "arity": [1]
      }
    }
  }

  // Register the function.
  SaxonJS["registerExtensionFunctions"](signatures);

  SaxonJS.transform({
    "stylesheetLocation": "squares.sef.json",
    "initialTemplate": "Q{http://www.w3.org/1999/XSL/Transform}initial-template"
  }, "async");
}
