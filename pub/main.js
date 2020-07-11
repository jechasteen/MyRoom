import { weather } from './widgets/weather.js';
import clock from './widgets/clock.js';
import date from './widgets/date.js';
import { Widget } from './widgets/widget.js';
import { Point } from './util.js';

function createWidgets () {
    let widgets = {
        weather: weather(),
        clock: clock(),
        date: date()
    }

    widgets.updateAll = function () {
        for (var w in widgets) {
            if (widgets[w] instanceof Widget) {
                widgets[w].update();
            }
        }
    }

    return widgets;
}

function findParentWidget (el) {
    if (el.classList.contains('widget')) {
        return el;
    }

    let parentElement = undefined;
    while (!parentElement) {
        if (el.parentNode.classList.contains('widget')) {
            parentElement = el.parentNode;
        } else {
            el = el.parentNode;
        }
    }
    return parentElement;
}

function createWidgetEventListeners (widgets) {
    for (let w in widgets) {
        if (w == 'updateAll') { continue; }
        let widget = widgets[w];
        widget.ref.addEventListener('mousedown', (e) => {
            if (lockState) return;
            const el = findParentWidget(e.target);
            console.log(el);
            if (!widget.clickStart && e.button == 0) {
                el.style.border = '2px dotted black';
                widget.clickStart = new Point(e.clientX, e.clientY);
            }
        });
        widget.ref.addEventListener('mouseup', (e) => {
            const el = findParentWidget(e.target);
            el.style.border = 'none';
            widget.clickStart = false;
        });
        widget.ref.addEventListener('mousemove', (e) => {
            if (widget.clickStart) {
                const el = findParentWidget(e.target);
                const move = new Point(e.clientX - widget.clickStart.x, e.clientY - widget.clickStart.y);
                const prevTop = parseInt(el.style.top.replace('px', '')) || 0;
                const prevLeft = parseInt(el.style.left.replace('px', '')) || 0;
                el.style.top = (prevTop + move.y) + 'px';
                el.style.left = (prevLeft + move.x) +  'px';
                widget.clickStart = new Point(e.clientX, e.clientY);
            }
        });
        widget.ref.addEventListener('mouseout', (e) => {
            const el = findParentWidget(e.target);
            el.style.border = "none";
            widget.mousedown = false;
            widget.clickStart = undefined;
        });
        widget.ref.addEventListener('mouseenter', (e) => {
            widget.mousedown = false;
            widget.clickStart = undefined;
        });
    }
}

let lockState = true;

function createLockButton () {
    function toggleVisibility (e) {
        let el = e.target;
        if (el.style.opacity == '1') {
            el.style.opacity = '0';
        } else {
            el.style.opacity = '1';
        }
    }

    function toggleLockState (e) {
        if (lockState) {
            lockState = false;
            lockImage.src = 'img/unlock.png';
        } else {
            lockState = true;
            lockImage.src = 'img/lock.png';
        }
    }

    let el = document.createElement('div');
    el.classList.add('lock-button');
    el.addEventListener('mouseenter', toggleVisibility);
    el.addEventListener('mouseleave', toggleVisibility);
    el.addEventListener('click', toggleLockState);
    let lockImage = document.createElement('img');
    lockImage.classList.add('lock-img')
    lockImage.src = 'img/lock.png';
    el.appendChild(lockImage);
    return el;
}

window.onload = function() {
    const widgets = createWidgets();
    createWidgetEventListeners(widgets);
    widgets.updateAll();
    const lockButton = createLockButton();
    const container = document.getElementById('container');
    container.appendChild(widgets.date.ref);
    container.appendChild(widgets.clock.ref);
    container.appendChild(widgets.weather.ref);
    container.appendChild(lockButton);
    setInterval(() => {
        widgets.clock.update();
    }, 1000);
    setInterval(() => {
        widgets.weather.updateAll();
    }, 900000);
}