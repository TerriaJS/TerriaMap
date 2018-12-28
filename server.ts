'use strict';

const http = require('http'); // HTTP Module
const url = require('url'); // URL Library
const fs = require('fs'); // File System
const express = require('express'); // ExpressJS Framework  - https://expressjs.com/ - Mainly for its minimalistic attribute.

require('./app/lib/Styles/variables.scss');

var configureDatabase = require('./app/backend/configureDatabase'); // Start backend database configuration



const app = express();
const port = 3000;

// Start backend webapp using express. We'll be using ReactJS on the frontend side pages that communicates with this server using express http and routes.
app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Terria framework running on ${port}!`))

// Run configuration for the backend content management framework
var db = configureDatabase();






