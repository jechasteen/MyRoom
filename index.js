//
// Global Name Variables
const appName = 'MyRoom';
const appNameNice = 'MyRoom';
const hostName = 'localhost';
const PORT = process.env.PORT || 1337;
const IP = process.env.IP || '127.0.0.1';

//
// Includes
const path = require('path');
const https = require('https');
const weather = require('weather-js');

//
// Set up express, body-parser and mongodb
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Include Routes
// var routeName = require('./path/to/file')

// Bind Routes
// app.use('URI', routeName)

//
// Express properties
app.set('views', path.join(__dirname, 'pub'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'pub')));

//
// Routes
app.get('/weather', (req, res) => {
    weather.find({ search: 'Dayton, OH', degreeType: 'F' },
        (err, result) => {
            if (err) {
                res.send(err);
            }
            res.send(result);
        });
});

app.get('/', (req, res) => {
    res.render('index');
});

//
// Listen
app.listen(PORT, IP, () => {
  console.log([appNameNice, ' server listening at \n',
    '-->http://', hostName, ':', PORT].join(''))
});
