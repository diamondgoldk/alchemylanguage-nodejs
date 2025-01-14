/**
 * Copyright 2016 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var express = require('express');
var app = express();
var watson = require('watson-developer-cloud');

// Bootstrap application settings
require('./config/express')(app);

// if bluemix credentials exists, then override local
var alchemyLanguage = watson.alchemy_language({
  api_key: process.env.API_KEY || '<api-key>'
});

app.post('/api/:method', function(req, res, next) {
  var method = req.params.method;
  if (typeof alchemyLanguage[method] === 'function') {
    alchemyLanguage[method](req.body, function(err, response) {
      if (err) {
        return next(err);
      }
      return res.json(response);
    });
  } else {
    next({code: 404, error: 'Unknown method: ' + method });
  }
});

app.get('/', function(req, res) {
  res.render('index', {
    ga: process.env.GOOGLE_ANALYTICS,
    ct: req._csrfToken
  });
});

module.exports = app;
