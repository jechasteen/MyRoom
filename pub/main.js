import { weather } from './widgets/weather.js';
import clock from './widgets/clock.js';
import date from './widgets/date.js';
import Widget from './widgets/widget.js';

function createWidgets () {
    let widgets = {
        weather: weather(),
        clock: clock(),
        date: date()
    }

    widgets.updateAll = function () {
        for (var w in widgets) {
            console.log(w);
            if (typeof widgets[w] != 'function') {
                widgets[w].update();
            }
        }
    }

    return widgets;
}

window.onload = function() {
    const widgets = createWidgets();
    widgets.updateAll();
    const container = document.getElementById('container');
    container.appendChild(widgets.date.ref);
    container.appendChild(widgets.clock.ref);
    container.appendChild(widgets.weather.temp.ref);
    container.appendChild(widgets.weather.skytext.ref);
    container.appendChild(widgets.weather.details.ref);
    setInterval(() => {
        widgets.clock.update();
    }, 1000);
    setInterval(() => {
        widgets.weather.updateAll();
    }, 900000);
}