/**
 Copyright 2023 fernando.reyes@du.edu

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

'use strict';

if (process.env.NODE_ENV === undefined) {
    require('dotenv').load();
}

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const express = require('./config/express');
const APP = express();
const port = process.env.PORT || 3000;
APP.listen(port);

if (process.env.NODE_ENV === 'production') {
    console.log('Newsddit running at https://' + process.env.PROD_DOMAIN + ' in ' + process.env.NODE_ENV + ' mode.');
} else {
    console.log('Newsddit running at http://' + process.env.APP_HOST + ':' + port + ' in ' + process.env.NODE_ENV + ' mode.');
}

module.exports = APP;