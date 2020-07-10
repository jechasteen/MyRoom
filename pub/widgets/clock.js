import Widget from './widget.js';

export default function clock () {
    const t = new Widget('time', 0, 0, null, (widget) => {
        widget.ref.textContent = ( new Date() ).toTimeString().split(' ')[0].split(":").slice(0, 2).join(":");
    });
    t.ref.id = 'time';
    t.update();
    return t;
}