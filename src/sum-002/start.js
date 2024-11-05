window.onload = function() {
  let func = function(a, b) {
    console.log("JavaScript addition...")
    return a + b
  }

  // This is the API description that we need to
  // register to make our function available.
  signatures = {
    "namespace": "https://saxonica.com/ns/example/functions",
    "signatures": {
      "sum-two-integers": {
        "as": "xs:decimal",
        "param": ["xs:decimal", "xs:integer"],
        "impl": func,
        "arity": [2]
      }
    }
  }

  // Register the function.
  SaxonJS["registerExtensionFunctions"](signatures);

  SaxonJS.transform({
    "stylesheetLocation": "sum.sef.json",
    "initialTemplate": "Q{http://www.w3.org/1999/XSL/Transform}initial-template"
  }, "async");
}
