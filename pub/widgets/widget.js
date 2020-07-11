export class Widget {
    constructor (id, x = 1, y = 1, z, updateCallback = () => {}) {
        this.id = id;
        this.ref = document.createElement('div');
        this.ref.id = id;
        this.ref.classList.add('widget');

        this.x = x;
        this.y = y;
        this.z = z || this.count++;

        this.mousedown = false;
        this.clickStart = undefined;

        this.update = function() {
            if (typeof updateCallback == 'function') {
                updateCallback(this);
            }
        }
    }

    static count = 0;
}

export class WidgetWithChildren extends Widget {
    constructor(id, widgets, x, y, z, updateCallback) {
        super(id, x, y, z, null);
        this.children = new Array();
        for (var i = 0; i < widgets.length; i++) {
            if (!widgets[i] instanceof Widget) {
                throw 'All paramenters to WidgetWithChildren constructor, except for the last, must be instances of the Widget class. The last parameter must be a callback, null, or undefined.';
            }
            this.children.push(widgets[i]);
            this.ref.appendChild(widgets[i].ref);
        }
        this.update = function() {
            updateCallback(this);
        }
    }
}