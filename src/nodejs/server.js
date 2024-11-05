require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const timers = require('timers');
const SaxonJS = require('saxon-js');

const favicon = Buffer.from(
`iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAIGNIUk0AAHomAACAhAAA+gAA
AIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAFfUExURefw8eTu8OXv8Obw8d/q7sXR4MLP3sHO
3uXv8eDr7tfi6c7a5MPQ3rC+1LLB1rjG2b/M3eHs7sDO3ZaoxoKWvHyRuX2RuXuPuHqPuH+T
uo2fwqm50ePt77C/1HmNt4GVu6W1zr7M3K++1Ka2z5OlxXiMtpytysDN3ejw8tbh6MTR39/p
7cLP33eMtujx8tTf54CUu3mOt+Pu8MTR4L7L3KOzzZ+wy7fF2OHr7qe3z3aLtn6SupyuyrXD
17vJ27/N3cPP37zK2nyQuIOWvIyfwZ2uyrHA1eDq7sbT4JSmxoibv3WKtbrH2ubv8d3n7N7o
7cTQ36W1z4GUu3OJtJeox8DN3uTt8KS0za69093o7cPQ36CwzHOItL3K3LbF17vI24+iw3qO
t5Wnxq++07nH2au60qa1z5mqyISYvXaLtcPR3n6SuZ+wzMLO3tvm69Xg6MrX4rPC1rPC173L
3P///1ySRL4AAAABYktHRHTfbahtAAAAB3RJTUUH6AsEDgMbZaciLAAAAPVJREFUGNNjYGAE
AiZmFlY2NnYQYAAKcHBycfPw8vELsEEEBIWERUTFxCUkpaQFQAIysnLyCopsSsoqEqpq6uwM
GpoicloczNqsOuzKuhJ8Ogx6+gaGbEbM2sbs7CamZuZsDAwWllbWNrZs/Hb2Og46YEO1HVUM
VHWdnF1c3cCGMnIwu+t7uHl6WXtLqPiwM/j6cfkzcTCzBJjwBwYFh4QyhIVLRjAxMkZGsbNF
Rcd4xTJoxHnLs1kAna7DFp8Qo6LOwKBtKZeYlJySmpaekellC7SW0SLL1UtSVFwi2yvHJxfi
OZm8/ILCIv5iqOdA3ufQhnkfAORRJHR9EZsNAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDI0LTEx
LTA0VDEzOjU5OjQ2KzAwOjAwfJQzmwAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyNC0xMS0wNFQx
Mzo1ODoxMyswMDowMPjTwdoAAAAodEVYdGRhdGU6dGltZXN0YW1wADIwMjQtMTEtMDRUMTQ6
MDM6MjcrMDA6MDAhwpIYAAAAAElFTkSuQmCC`, "base64")

const app = express();

app.disable('x-powered-by');

app.use("/favicon.ico", (request, response, next) => {
  response.type("image/png");
  response.status(200).send(favicon);
});

app.use('/date-now', (request, response, next) => {
  response.type("xml");
  response.status(200).send(`<doc>${Date.now()}</doc>`);
});

app.use("/pages", (request, response, next) => {
  let page = parseInt(request.query.page || "1", 10);

  console.log(`Request: /pages?page=${page}`);

  let error = null
  if (isNaN(page)) {
    error = "Page must be a decimal number"
  } else if (page <= 0) {
    error = "Page must be greater than 0"
  } else if (page > 10) {
    error = "Page must be less than or equal to 10"
  }

  if (error != null) {
    console.log(`    Response: 400, ${error}`)
    return response.status(400).send(error)
  }

  let first = ((page - 1) * 10) + 1
  let resp = {"page": page}
  if (page < 10) {
    resp["nextPage"] = page + 1
  } else {
    resp["lastPage"] = true
  }
  resp["data"] = []
  for (let count = first; count < first+10; count++) {
    resp["data"][count - first] = `Item ${count}`;
  }

  console.log(`    Response: items ${first} to ${first + 9}`)
  return response.status(200).send(resp);
});

function constructDirectoryPage(url, data) {
  let root = `/${url}`;
  if (!root.endsWith("/")) {
    root += "/";
  }

  // OMG. This is such a hack.
  let html = `<!DOCTYPE html><html><head><title>${root}</title></head><body>`;
  html += `<h1>Path: ${root}</h1>`;

  let parts = root.split("/");
  // The first and last elements of the split are always the empty string
  parts = parts.splice(1, parts.length - 2);

  if (parts.length > 0) {
    parts = parts.splice(0, parts.length - 1);
    if (parts.length === 0) {
      html += `<p><a href="/">Up</a></p>`;
    } else {
      html += `<p><a href="/">Root</a>, <a href="/${parts.join("/")}/">Up</a></p>`;
    }
  }

  html += "<ul>";
  data.forEach(ent => {
    let link = ent.name;
    if (ent.isDirectory()) {
      link += "/";
    }
    html += `<li><a href="${root}${link}">${link}</a></li>`;
  });
  html += "</ul>";

  html += "</body></html>";
  return html;
}

app.get(/.*/, (request, response, next) => {
  const url = request.url.substring(1);
  let path = url
  let pos = path.indexOf("?")
  if (pos >= 0) {
    path = path.substring(0, pos)
  }

  console.log(`Request: ${url}`)

  fs.readFile(path, null, (error, data) => {
    if (error) {
      // Maybe it's a directory
      if (path === "") {
        path = ".";
      }
      fs.readdir(path, {"withFileTypes": true}, (error, data) => {
        if (error) {
          if (url === "favicon.ico") {
            // I don't *care*
          } else {
            console.log(`Failed to read ${url}`);
            console.log(error);
          }
          response.set({"content-type": "text/plain"});
          response.status(404).send("Not found.");
          return;
        }
        
        fs.readFile(`${path}/index.html`, null, (error, index) => {
          if (error) {
            response.status(200).send(constructDirectoryPage(url, data));
            return
          }
          let contentType = "text/html"
          console.log(`    Response: ${index.length} bytes of ${contentType}`);
          response.set({'Content-type': contentType});
          let buf = null;
          buf = Buffer.from(index, "utf-8");
          response.status(200).send(buf);
          return
        });
      });
    } else {
      // Hack: assume the extension will have the right content Type
      let ext = "bin";
      if (url.lastIndexOf(".") >= 0) {
        ext = url.substring(url.lastIndexOf(".")+1);
      }

      // Does the URL tell us to fuss with the encoding?
      let contentType = "application/octet-stream";
      let encoding = null;

      switch (ext) {
        case "txt":
        case "text":
          contentType = "text/plain";
          break;
        case "xsl":
        case "xml":
          contentType = "application/xml";
          break;
        case "json":
          contentType = "application/json";
          break;
        case "js":
          contentType = "application/javascript";
          break;
        case "md":
          contentType = "application/markdown";
          break;
        case "html":
          contentType = "text/html";
          break;
        case "xhtml":
          contentType = "application/xhtml+xml";
          break;
        case "pdf":
          contentType = "application/pdf";
          break;
        case "jpg":
        case "jpeg":
          contentType = "image/jpeg";
          break;
        case "png":
          contentType = "image/png";
          break;
        case "gif":
          contentType = "image/gif";
          break;
        case "css":
          contentType = "text/css";
          break;
        default:
          break;
      }

      let pos = Math.max(url.indexOf("iso-"), url.indexOf("utf-"));
      if (pos > 0) {
        encoding = url.substring(pos);
        pos = encoding.indexOf(".");
        if (pos >= 0) {
          encoding = encoding.substring(0, pos);
        }

        // Okay, now we have the encoding, iso-8859-1-other-stuff
        // But we only want the iso-8859-1 part. I think it's sufficient
        // to simply take the first three "-" delimited parts...
        const matches = encoding.match(/^([^-]+-[^-]+-[^-]+).*$/);
        encoding = matches ? matches[1] : encoding;
        if (encoding.endsWith("-bom")) {
          encoding = encoding.substring(0, encoding.length - 4);
        }
      }

      if (encoding) {
        contentType = `${contentType}; charset=${encoding}`;
      }

      console.log(`    Response: ${data.length} bytes of ${contentType}`);
      response.set({'Content-type': contentType});

      // The documentation suggests that this should send the response
      // without automatically adding a charset. But that's not the
      // result I'm seeing...

      let buf = null;
      if (encoding == null) {
        buf = Buffer.from(data, "binary");
      } else {
        buf = Buffer.from(data, encoding);
      }
      response.status(200).send(buf);
    }
  });
});

app.use((request, response, next) => {
  response.status(400).send(`Bad request: ${request.method} ${request.url}`);
});

app.listen(process.env.PORT, () => {
  console.log(`Server listening on ${process.env.PORT}`);
});
