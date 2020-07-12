//
// Global Name Variables
const appName = 'MyRoom';
const appNameNice = 'MyRoom';
const hostName = 'localhost';
const PORT = process.env.PORT || 1337;
const IP = process.env.IP || '127.0.0.1';

//
// Includes
const child_process = require('child_process');
const fs = require('fs');
const path = require('path');
const weather = require('weather-js');

//
// Set up express, body-parser and mongodb
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { runInNewContext } = require('vm');

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
    res.render('index', { state: JSON.stringify(widgetState) });
});

let widgetState = {};

app.post('/', (req, res) => {
    widgetState = JSON.parse(req.body.state);
    fs.writeFile('state.json', JSON.stringify(widgetState), (err) => {
        if (err) throw err;
        console.log('saved');
    })
    res.redirect('/');
})

//
// Listen
app.listen(PORT, IP, () => {
    if (fs.existsSync('state.json')) {
        fs.readFile('state.json', (err, data) => {
            widgetState = JSON.parse(data);
        });
    }
    child_process.spawn(
        'firefox.exe',
        ['-new-window', 'http://localhost:1337'],
        { detached: true }
    );
    console.log([appNameNice,
                ' server listening at \n',
                '-->http://', hostName, ':', PORT].join(''))
});
