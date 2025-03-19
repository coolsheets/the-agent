const TWO_PI = Math.PI * 2;

let images = [],
    imageIndex = 0;

let imageSrc = "./andy-transparent.png";
let imageWidth = 768,
    imageHeight = 485;

let vertices = [],
    indices = [],
    fragments = [];

let container = document.getElementById('container');

let clickPosition = [imageWidth * 0.5, imageHeight * 0.5];

window.onload = function () {
    // images from reddit/r/wallpapers
    let urls = ["./andy-transparent.png"];

    let loaded = 0;
    // very quick and dirty hack to load and display the first image asap
    images[0] = new Image();
    images[0].onload = function () {
        if (++loaded === 1) {
            imagesLoaded();
            for (let i = 1; i < urls.length; i++) {
                images[i] = new Image();
                images[i].src = urls[i];
            }
        }
    };
    images[0].src = urls[0];
};

function imagesLoaded() {
    placeImage(false);
    triangulate();
    shatter();
}

function placeImage(transitionIn) {
    let image = images[imageIndex];

    if (++imageIndex === images.length) imageIndex = 0;

    image.addEventListener('click', imageClickHandler);
    container.appendChild(image);

    if (transitionIn !== false) {
        TweenMax.fromTo(image, 0.75, { y: -1000 }, { y: 0, ease: Back.easeOut });
    }
}

function imageClickHandler(event) {
    let box = event.target.getBoundingClientRect(),
        top = box.top,
        left = box.left;

    clickPosition[0] = event.clientX - left;
    clickPosition[1] = event.clientY - top;

    triangulate();
    shatter();
}

function triangulate() {
    let rings = [
        { r: 50, c: 12 },
        { r: 150, c: 12 },
        { r: 300, c: 12 },
        { r: 1200, c: 12 } // very large in case of corner clicks
    ],
    x, y,
    centerX = clickPosition[0],
    centerY = clickPosition[1];

    vertices.push([centerX, centerY]);

    rings.forEach(function (ring) {
        let radius = ring.r,
            count = ring.c,
            variance = radius * 0.25;

        for (let i = 0; i < count; i++) {
            x = Math.cos(i / count * TWO_PI) * radius + centerX + randomRange(-variance, variance);
            y = Math.sin(i / count * TWO_PI) * radius + centerY + randomRange(-variance, variance);
            vertices.push([x, y]);
        }
    });

    vertices.forEach(function (v) {
        v[0] = clamp(v[0], 0, imageWidth);
        v[1] = clamp(v[1], 0, imageHeight);
    });

    indices = Delaunay.triangulate(vertices);
}

function shatter() {
    let p0, p1, p2, fragment;

    let tl0 = new TimelineMax({ onComplete: shatterCompleteHandler });

    for (let i = 0; i < indices.length; i += 3) {
        p0 = vertices[indices[i + 0]];
        p1 = vertices[indices[i + 1]];
        p2 = vertices[indices[i + 2]];

        fragment = new Fragment(p0, p1, p2);

        let dx = fragment.centroid[0] - clickPosition[0],
            dy = fragment.centroid[1] - clickPosition[1],
            d = Math.sqrt(dx * dx + dy * dy),
            rx = 30 * sign(dy),
            ry = 90 * -sign(dx),
            delay = d * 0.003 * randomRange(0.9, 1.1);
        fragment.canvas.style.zIndex = Math.floor(d).toString();

        let tl1 = new TimelineMax();

        tl1.to(fragment.canvas, 1, {
            z: -500,
            rotationX: rx,
            rotationY: ry,
            ease: Cubic.easeIn
        });

        tl1.to(fragment.canvas, 0.4, { alpha: 0 }, 0.6);

        tl0.insert(tl1, delay);

        fragments.push(fragment);
        container.appendChild(fragment.canvas);
    }

    // Do not remove the image after shattering
    // container.removeChild(images[imageIndex]);
    // images[imageIndex].removeEventListener('click', imageClickHandler);
}

function shatterCompleteHandler() {
    fragments.forEach(function (f) {
        container.removeChild(f.canvas);
    });
    fragments.length = 0;
    vertices.length = 0;
    indices.length = 0;

    // Do not place a new image
    // placeImage();
}

// MATH UTILS

function randomRange(min, max) {
    return min + (max - min) * Math.random();
}

function clamp(x, min, max) {
    return x < min ? min : x > max ? max : x;
}

function sign(x) {
    return x < 0 ? -1 : 1;
}

// FRAGMENT

Fragment = function (v0, v1, v2) {
    this.v0 = v0;
    this.v1 = v1;
    this.v2 = v2;

    this.computeBoundingBox();
    this.computeCentroid();
    this.createCanvas();
    this.clip();
};

Fragment.prototype = {
    computeBoundingBox: function () {
        let xMin = Math.min(this.v0[0], this.v1[0], this.v2[0]),
            xMax = Math.max(this.v0[0], this.v1[0], this.v2[0]),
            yMin = Math.min(this.v0[1], this.v1[1], this.v2[1]),
            yMax = Math.max(this.v0[1], this.v1[1], this.v2[1]);

        this.box = {
            x: xMin,
            y: yMin,
            w: xMax - xMin,
            h: yMax - yMin
        };
    },
    computeCentroid: function () {
        let x = (this.v0[0] + this.v1[0] + this.v2[0]) / 3,
            y = (this.v0[1] + this.v1[1] + this.v2[1]) / 3;

        this.centroid = [x, y];
    },
    createCanvas: function () {
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.box.w;
        this.canvas.height = this.box.h;
        this.canvas.style.width = this.box.w + 'px';
        this.canvas.style.height = this.box.h + 'px';
        this.canvas.style.left = this.box.x + 'px';
        this.canvas.style.top = this.box.y + 'px';
        this.ctx = this.canvas.getContext('2d');
    },
    clip: function () {
        this.ctx.translate(-this.box.x, -this.box.y);
        this.ctx.beginPath();
        this.ctx.moveTo(this.v0[0], this.v0[1]);
        this.ctx.lineTo(this.v1[0], this.v1[1]);
        this.ctx.lineTo(this.v2[0], this.v2[1]);
        this.ctx.closePath();
        this.ctx.clip();
        this.ctx.drawImage(images[imageIndex], 0, 0);
    }
};