window.onload = function() {
  let func = function() {
    // This is a function that (pointlessly) returns a promise.
    // In the real world, this might be a database update, a
    // web request, or any API that returns a promise.
    return Promise.resolve("Hello, world.")
  }

  // This is the API description that we need to
  // register to make our function available.
  signatures = {
    "namespace": "https://saxonica.com/ns/example/functions",
    "signatures": {
      "returns-promise": {
        "as": "xs:string",
        "param": [],
        "impl": func,
        "arity": [0]
      }
    }
  }

  // Register the function.
  SaxonJS["registerExtensionFunctions"](signatures);

  SaxonJS.transform({
    "stylesheetLocation": "promise.sef.json",
    "initialTemplate": "Q{http://www.w3.org/1999/XSL/Transform}initial-template"
  }, "async");
}
