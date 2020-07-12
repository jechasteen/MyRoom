import { Widget } from './widget.js'

export default function date (state) {
    const d = new Widget(
        'date',
        state.x,
        state.y,
        state.z,
        (widget) => {
            widget.ref.textContent = (new Date()).toLocaleDateString();
        }
    );
    d.ref.id = 'date';
    d.update();
    return d;
}