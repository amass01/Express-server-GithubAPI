const express = require('express');
const app = express();
const env = require('env2')('./config.env');
const request = require('request');
const qs = require('querystring');
let path = require('path');

let port = process.env.PORT || 3000;

app.set('view engine', 'jade');

app.set('views', './views');

app.use(express.static('./public'));

app.get('/', (req, res) => {
  res.render('layouts/index')
});

app.get('/login', (req, res) => {
  let client_id = process.env.CLIENT_ID;
  const redirect_uri = 'http://localhost:3000/welcome';
  const url = 'http://github.com/login/oauth/authorize/';
  res.redirect(`${url}?client_id=${client_id}&redirect_uri=${redirect_uri}`)
})

app.get('/welcome', (req, res) => {
  var url = 'https://github.com/login/oauth/access_token'
  var header = {
    accept: 'application/json'
  }
  var form = {
    client_id: process.env.CLIENT_ID,
    code: req.query.code,
    client_secret: process.env.CLIENT_SECRET
  }
  request.post({url:url, headers: header, form:form},(error, response, body) => {
    if (!error && response.statusCode == 200) {
      var body = JSON.parse(body)
      var accessToken = body.access_token;
      res.render('layouts/logged',{accessToken:accessToken})
    }
  })
})

app.listen(port, () => {
  console.log('server is running on http://localhost:%s', port);
});
