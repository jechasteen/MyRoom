class Widget {
    constructor(id, x = 1, y = 1, z, updateCallback) {
        this.id = id;
        this.ref = document.createElement('div');
        this.ref.id = id;
        this.ref.classList.add('widget');

        this.x = x;
        this.y = y;
        this.z = z || this.count++;
        this.update = function() {
            updateCallback(this);
        }
    }

    static count = 0;
}

const setupWidgets = function () {
    let weather = (function () {
        let data = {
            temp: undefined,
            feelslike: undefined,
            skytext: undefined,
            humidity: undefined,
            wind: undefined,
            place: undefined,
            image: undefined
        }

        function handleWeatherData () {
            const w = JSON.parse(this.responseText)[0].current;
    
            data.temp = w.temperature;
            data.feelslike = w.feelslike;
            data.skytext = w.skytext;
            data.humidity = w.humidity;
            data.wind = w.winddisplay;
            data.place = w.observationpoint;
            data.image = w.imageUrl;
            temp.update();
            details.update();
            skytext.update();
        }
    
        function fetchWeather () {
            var xhttp = new XMLHttpRequest();
            xhttp.addEventListener('load', handleWeatherData);
            xhttp.open("GET", "/weather", true);
            xhttp.send();
        }

        const temp = (function() {
            const t = new Widget('temp', 0, 0, null, (widget) => {
                t.ref.textContent = data.temp || "--";
            });
            t.ref.id = 'temp';
            return t;
        })();

        const details = (function () {
            const d = new Widget('details', 0, 0, null, (widget) => {
                feelslike.textContent = data.feelslike;
                humidity.textContent = data.humidity;
                wind.textContent = data.wind;
            });

            const ul = document.createElement('ul');
            ul.id = 'details';
            ul.classList.add('list');
            
            const feelslike = document.createElement('li');
            const humidity = document.createElement('li');
            const wind = document.createElement('li');

            ul.appendChild(feelslike);
            ul.appendChild(humidity);
            ul.appendChild(wind);
            d.ref.appendChild(ul);
            d.update();

            return d;
        })();

        const skytext = (function () {
            const s = new Widget('skytext', 0, 0, null, (widget) => {
                s.textContent = data.skytext;
            });
            s.id = 'skytext';
            s.update();
            return s;
        })();

        return {
            temp: temp,
            details: details,
            skytext: skytext,
            updateAll: fetchWeather
        }
    })();

    const time = (function () {
        const t = new Widget('time', 0, 0, null, (widget) => {
            widget.ref.textContent = ( new Date() ).toTimeString().split(' ')[0].split(":").slice(0, 2).join(":");
        });
        t.ref.id = 'time';
        t.update();
        return t;
    })();

    const date = (function () {
        const d = new Widget('date', 0, 0, null, (widget) => {
            widget.ref.textContent = (new Date()).toLocaleDateString();
        });
        d.ref.id = 'date';
        d.update();
        return d;
    })();

    function updateAll() {
        weather.updateAll();
        time.update();
        date.update();
    }

    return {
        updateAll: updateAll,
        weather: weather,
        time: time,
        date: date
    }
}

window.onload = function() {
    const widgets = setupWidgets();
    widgets.updateAll();
    const container = document.getElementById('container');
    container.appendChild(widgets.date.ref);
    container.appendChild(widgets.time.ref);
    container.appendChild(widgets.weather.temp.ref);
    container.appendChild(widgets.weather.skytext.ref);
    container.appendChild(widgets.weather.details.ref);
    setInterval(() => {
        widgets.time.update();
    }, 1000);
    setInterval(() => {
        widgets.weather.updateAll();
    }, 900000);
}