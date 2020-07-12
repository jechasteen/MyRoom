import { Widget } from './widget.js';

export default function clock (state) {
    const t = new Widget('time', state.x, state.y, state.z, (widget) => {
        widget.ref.textContent = ( new Date() ).toTimeString().split(' ')[0].split(":").slice(0, 2).join(":");
    });
    t.ref.id = 'time';
    t.update();
    return t;
}