export default class {
    constructor (id, x = 1, y = 1, z, updateCallback) {
        this.id = id;
        this.ref = document.createElement('div');
        this.ref.id = id;
        this.ref.classList.add('widget');

        this.x = x;
        this.y = y;
        this.z = z || this.count++;
        this.ref.addEventListener('mousedown', (e) => {
            let tgt = e.target;
            console.log(tgt);
        });
        this.update = function() {
            updateCallback(this);
        }
    }

    static count = 0;
}