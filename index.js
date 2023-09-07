require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');

const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.use(express.urlencoded({ extended: true }));

const originalUrl = [];
const shortUrlsArray = [];

app.post('/api/shorturl', function (req, res) {
  const url = req.body.url;
  const indexOfUrl = originalUrl.indexOf(url);
  if (!url.includes("https://") && !url.includes("http://")) {
    return res.json({ error: 'invalid url' });
  }
  if (indexOfUrl < 0) {
    originalUrl.push(url)
    shortUrlsArray.push(shortUrlsArray.length)
    return res.json({
      original_url: url,
      short_url: shortUrlsArray.length - 1
    })
  }
  return res.json({
    original_url: url,
    short_url: shortUrlsArray[indexOfUrl]
  })
  // url - from form  input name = "url"  in index.html
  // res.json(req.body.url)
});

app.get('/api/shorturl/:shorturl', function (req, res) {
  const shorturl = parseInt(req.params.shorturl);
  const indexOfUrl = shortUrlsArray.indexOf(shorturl);
  if (indexOfUrl < 0) {
    return res.json({ "error": "No short URL found for the given input" })
  }
  res.redirect(originalUrl[indexOfUrl]);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
