export class Widget {
    constructor (id, x = 1, y = 1, z, updateCallback = () => {}) {
        this.id = id;
        this.ref = document.createElement('div');
        this.ref.id = id;
        this.ref.classList.add('widget');

        this.x = x;
        this.y = y;
        this.z = z || this.count++;

        // position element
        this.ref.style.left = this.x + "px";
        this.ref.style.top = this.y + "px";
        this.ref.style.zIndex = this.z;

        this.clickStart = undefined;
        this.selected = false;

        this.update = function() {
            if (typeof updateCallback == 'function') {
                updateCallback(this);
            }
        }
    }

    static count = 0;

    get state () {
        return {
            x: this.x.replace('px', ''),
            y: this.y.replace('px', ''),
            z: this.z.replace('px', '')
        }
    }
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

    get state () {
        const childStates = {};
        for (var i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            const s = {
                x: child.x,
                y: child.y,
                z: child.z
            }
            childStates[child.id] = s;
        }
        return childStates;
    }
}