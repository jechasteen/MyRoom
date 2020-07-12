import { weather } from './widgets/weather.js';
import clock from './widgets/clock.js';
import date from './widgets/date.js';
import { Widget, WidgetWithChildren } from './widgets/widget.js';
import { Point } from './util.js';

function createWidgets (state) {
    const defaultState = {
        weather: {
            temp: { x: 100, y: 100, z: 0 },
            details: { x: 200, y: 200, z: 1},
            skytext: { x: 300, y: 300, z: 2}
        },
        clock: { x: 400, y: 400, z: 3 },
        date: { x: 500, y: 500, z: 4 }
    }

    state = state.weather ? state : defaultState;

    console.log(state);

    let widgets = {
        weather: weather(state.weather),
        clock: clock(state.clock),
        date: date(state.date)
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

function saveWidgets () {
    function sendState (s) {
        var xhttp = new XMLHttpRequest();
        xhttp.open('POST', '/', true);
        xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhttp.send(`state=${s}`);
    }

    let state = {};
    for (var w in widgets) {
        const widget = widgets[w];
        if (widget instanceof WidgetWithChildren) {
            state[w] = {};
            for (var i in widget.children) {
                const child = widget.children[i];
                state[w][child.id] = { x: child.x, y: child.y, z: child.z };
            }
        } else if (widget instanceof Widget) {
            state[w] = { x: widget.x, y: widget.y, z: widget.z };
        }
    } 
    sendState(JSON.stringify(state));
}

function loadState () {
    const el = document.getElementById('state');
    const state = el.getAttribute('data-json');
    return JSON.parse(state);
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

function findSelectedWidget () {
    for (var w in widgets) {
        const widget = widgets[w];
        if (widget instanceof WidgetWithChildren) {
            for (var i in widget.children) {
                if (widget.children[i].selected) {
                    return widget.children[i];
                }
            }
        } else {
            if (widget.selected) {
                return widget;
            }
        }
    }
    return null;
}

let lockState = true;

function deselectAll () {
    for (var w in widgets) {
        const widget = widgets[w];
        if (typeof widget == 'function' || !(widget instanceof Widget)) continue;
        if (widget instanceof WidgetWithChildren) {
            for (var i = 0; i < widget.children.length; i++) {
                if (widget.children[i].selected) {
                    widget.children[i].selected = false;
                    widget.children[i].ref.style.border = 'none';
                }
            }
        } else {
            if (widget.selected) {
                widget.selected = false;
                widget.ref.style.border = 'none';
            }
        }
    }
}

function toggleSelection(widget) {
    if (widget.selected) {
        widget.selected = false;
        widget.ref.style.border = 'none';
    } else {
        widget.selected = true;
        widget.ref.style.border = '2px dotted black';
    }
}

function addWidgetEventListeners (widget) {
    let mousedownTime = 0;

    widget.ref.addEventListener('mousedown', (e) => {
        if (lockState) return;
        mousedownTime = Date.now();
        if (!widget.clickStart && e.button == 0) {
            widget.clickStart = new Point(e.clientX, e.clientY);
            deselectAll();
            toggleSelection(widget);
        }
    });

    widget.ref.addEventListener('mouseup', (e) => {
        widget.clickStart = false;
        const currentTime = Date.now();
        const diff = currentTime - mousedownTime;
        if (currentTime - mousedownTime < 150) {
            if (widget.selected) {
                toggleSelection(widget);
            }
        }
        mousedownTime = 0;
        widget.x = widget.ref.style.left.replace('px', '');
        widget.y = widget.ref.style.top.replace('px', '');
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
}

function createAllWidgetEventListeners (widgets) {
    for (let w in widgets) {
        if (w == 'updateAll') { continue; }
        let widget = widgets[w];

        if (widget instanceof WidgetWithChildren) {
            for (let c in widget.children) {
                addWidgetEventListeners(widget.children[c]);
            }
        } else {
            addWidgetEventListeners(widget);
        }
    }
}

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
            saveWidgets();
            deselectAll();
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

function addDocumentListeners () {
    let ctrlDown = false;
    
    document.addEventListener('keydown', (e) => {
        const w = findSelectedWidget();
        if (!w) return;

        const coef = ctrlDown ? 10 : 1;
        const prevLeft = parseInt(w.ref.style.left.replace('px', ''));
        const prevTop = parseInt(w.ref.style.top.replace('px', ''));

        switch (e.key) {
        case 'Control':
            ctrlDown = true;
            break;
        case 'ArrowLeft':
            w.ref.style.left = (prevLeft - coef) + 'px';
            w.x -= coef;
            break;
        case 'ArrowRight':
            w.ref.style.left = (prevLeft + coef) + 'px';
            w.x += coef;
            break;
        case 'ArrowUp':
            w.ref.style.top = (prevTop - coef) + 'px';
            w.y -= coef;
            break;
        case 'ArrowDown':
            w.ref.style.top = (prevTop + coef) + 'px';
            w.y += coef;
            break;
        default:
            break;
        }
    });

    document.addEventListener('keyup', (e) => {
        switch (e.key) {
        case 'Control':
            ctrlDown = false;
            break;
        }
    });
}

let widgets;

window.onload = function() {
    widgets = createWidgets(loadState());
    createAllWidgetEventListeners(widgets);
    widgets.updateAll();
    addDocumentListeners();

    const lockButton = createLockButton();
    const container = document.getElementById('container');

    container.appendChild(widgets.date.ref);
    container.appendChild(widgets.clock.ref);
    container.appendChild(widgets.weather.ref);
    container.appendChild(lockButton);
    
    setInterval(() => {
        widgets.clock.update();
        widgets.date.update();
    }, 1000);
    setInterval(() => {
        widgets.weather.updateAll();
    }, 900000);
}