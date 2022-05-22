class Frame {
    constructor(img, frame, cb) {
        this.index = 0;
        this.paused = true;
        this.updateTime = 0;
        this.loop = true;
        this.nextFrame = () => {
            const x = this.index % this.column;
            const y = (this.index - x) / this.column;
            this.sprite.material.map.offset.set(this.offsetX * x, -this.offsetY * y);
        };
        this.update = () => {
            if (this.paused)
                return;
            if (!this.loop && this.index >= this.count)
                return;
            if (++this.updateTime >= this.duration * (this.index + 1) / this.count) {
                if (++this.index >= this.count) {
                    if (this.loop) {
                        this.updateTime = 0;
                        this.index = 0;
                    }
                    else {
                        this.cb && this.cb();
                    }
                }
                this.nextFrame();
            }
        };
        this.play = (reset = false) => {
            this.paused = false;
            if (reset) {
                this.updateTime = 0;
                this.index = 0;
            }
        };
        this.pause = () => {
            this.paused = true;
        };
        this.cb = cb;
        this.loop = frame.loop;
        this.count = img.count;
        this.column = img.width / img.fWidth;
        this.duration = frame.duration * 60;

        this.offsetX = img.fWidth / img.width;
        this.offsetY = img.fHeight / img.height;

        const geometry = new THREE.PlaneBufferGeometry(frame.width, frame.height, 1, 1);
        geometry.setAttribute('uv', new THREE.Float32BufferAttribute([0, 1, this.offsetX, 1, 0, 1 - this.offsetY, this.offsetX, 1 - this.offsetY], 2));

        const material = new THREE.SpriteMaterial({
            color: 0xffffff,
            map: img.map,
        });

        this.sprite = new THREE.Sprite(material);
        this.sprite.geometry = geometry;

    }
}
