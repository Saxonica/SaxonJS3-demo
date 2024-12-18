# SaxonJS 3.0.0-beta1 demo

This repository contains a number of small examples designed to highlight
specific new features of SaxonJS 3.0.

## Prerequisites

To use this repository, you have to have Node.js version 18 installed. The build
script uses Gradle and consequently relies on Java. You don’t actually need
Java, but you’ll have to setup the build environment and compile the XSLT files
in some other way.

You also need to install the SaxonJS 3.0 release in `src/nodejs/saxonjs3`.

## TL;DR

Run `./gradlew server` to configure and install the demo.

Open `http://localhost:3002/` in your browser.

The source code for the demos is in `src`.

## More details

There are four sets of demos for the browser and Node.js:

### Browser demos

The demo page at `http://localhost:3002/` contains links to several demos.

1. The smoke test demo just makes sure that everything is working
2. The “paged data” demo uses `ixsl:promise` to read from a “paged” web service API.
3. The “sum” and “squares” demos show how various kinds of arguments and return
   types are handled when calling JavaScript functions from XSLT.
4. The “promise” demo shows how to return a promise from a JavaScript extension
   function and process the result in XSLT.

### Node.js demos

After running setup, there are directories under `build` that contain the corresponding
demos for Node.js.

1. The `n_sum-*` demos are the sum demos for Node.js
2. The `n_squares_*` demos are the squares demos for Node.js

In each case, the demo can be run by changing to the demo directory
and running `node run.js`.

