require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

// const bodyParser = require("body-parser");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

const urlDict = {};
let urlCounter = 1;

app.post("/api/shorturl", (req, res) => {
  const original_url = req.body.url;
  if (!/^https?:\/\//i.test(original_url)) {
    return res.json({ error: "invalid url" });
  }

  const short_url = urlCounter++;
  urlDict[short_url] = original_url;
  res.json({ original_url, short_url });
});

app.get("/api/shorturl/:short_url", (req, res) => {
  const short_url = req.params.short_url;
  const original_url = urlDict[short_url];
  if (original_url) {
    res.redirect(original_url);
    // res.json({ original_url });
  } else {
    res.json({ error: "invalid url" });
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
