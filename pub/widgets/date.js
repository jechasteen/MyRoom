import { Widget } from './widget.js'

export default function date () {
    const d = new Widget('date', 0, 0, null, (widget) => {
        widget.ref.textContent = (new Date()).toLocaleDateString();
    });
    d.ref.id = 'date';
    d.update();
    return d;
}