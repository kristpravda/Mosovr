let filterCbx;
let audio;
let src;
let filter;
let stereoPanner;
let audioCtx;
let audioSrfc;

function initA() {
    filterCbx = document.getElementById('filterCbx');
    audio = document.getElementById('audioCtx');

    audio.addEventListener('play', () => {
        if (!audioCtx) {
            audioCtx = new AudioContext();
            src = audioCtx.createMediaElementSource(audio);
            stereoPanner = audioCtx.createPanner();
            filter = audioCtx.createBiquadFilter();

            src.connect(stereoPanner);
            stereoPanner.connect(filter);
            filter.connect(audioCtx.destination);

            filter.type = 'bandpass';
            filter.frequency.value = 10000;
            filter.Q.value = 1;
            // filter.gain.value = 1; // not used for bandpass filter according to the documentation
            audioCtx.resume();
        }
    })
    audio.addEventListener('pause', () => {
        console.log('pause');
        audioCtx.resume();
    })
    filterCbx.addEventListener('change', function () {
        if (filterCbx.checked) {
            stereoPanner.disconnect();
            stereoPanner.connect(filter);
            filter.connect(audioCtx.destination);
        } else {
            stereoPanner.disconnect();
            stereoPanner.connect(audioCtx.destination);
        }
    });
    audio.play();
}

function CreateSphere(radius) {
    let vertexList = [];
    let lon = -Math.PI; // longitude from -PI to PI
    let lat = -Math.PI * 0.5; // latitude from -PI/2 to PI/2
    const STEP = 0.1;
    while (lon < Math.PI) {
        while (lat < Math.PI * 0.5) {
            let v1 = getVFromLonLat(radius, lon, lat);
            let v2 = getVFromLonLat(radius, lon + STEP, lat);
            let v3 = getVFromLonLat(radius, lon, lat + STEP);
            let v4 = getVFromLonLat(radius, lon + STEP, lat + STEP);
            vertexList.push(v1.x, v1.y, v1.z);
            vertexList.push(v2.x, v2.y, v2.z);
            vertexList.push(v3.x, v3.y, v3.z);
            vertexList.push(v3.x, v3.y, v3.z);
            vertexList.push(v4.x, v4.y, v4.z);
            vertexList.push(v2.x, v2.y, v2.z);
            lat += STEP;
        }
        lat = -Math.PI * 0.5
        lon += STEP;
    }
    return vertexList;
}

function getVFromLonLat(radius, u, v) {
    let x = radius * Math.sin(u) * Math.cos(v);
    let y = radius * Math.sin(u) * Math.sin(v);
    let z = radius * Math.cos(u);
    return { x: x, y: y, z: z };
}