import { Widget, WidgetWithChildren } from './widget.js';

/*
    example state:
    const state = {
        temp: { x: 1000, y, 50, x 1 },
        details: { x: 100, y: 50, z: 0 },
        skytext: { x: 150, y: 50, z: 0}
    }
*/
export function weather (state) {
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
        const t = new Widget(
            'temp',
            state.temp.x,
            state.temp.y,
            state.temp.z,
            (widget) => {
                widget.ref.textContent = data.temp || "--";
            }
        );
        t.ref.id = 'temp';
        return t;
    })();

    const details = (function () {
        const d = new Widget(
            'details',
            state.details.x,
            state.details.y,
            state.details.z,
            (widget) => {
                feelslike.textContent = data.feelslike;
                humidity.textContent = data.humidity;
                wind.textContent = data.wind;
            }
        );

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
        const s = new Widget(
            'skytext', 
            state.skytext.x,
            state.skytext.y,
            state.skytext.z,
            (widget) => {
                s.textContent = data.skytext;
            }
        );
        s.id = 'skytext';
        s.update();
        return s;
    })();

    return new WidgetWithChildren("weather", [temp, details, skytext], 0, 0, null, fetchWeather);
}