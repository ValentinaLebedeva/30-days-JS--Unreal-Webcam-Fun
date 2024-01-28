const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then(localMediaStream => {

        video.srcObject = localMediaStream;
        //video.src = window.URL.creatObjectURL(localMediaStream);
        video.play()
    }).catch(error => console.log("camera if off", err));
}

function paintToCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;

    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);
        //take pixals out
        let pixals = ctx.getImageData(0, 0, width, height);
        //change pixals
        //pixals = redEffect(pixals);
        pixals = rgbSplit(pixals);
        ctx.globalAlpha = 0.8;
        //pixals = greenScreen(pixals);
        //put pixals back
        ctx.putImageData(pixals, 0, 0);

    }, 16);
}

function takePhoto() {
    //play the sounds
    snap.currentTime = 0;
    snap.play();

    //take the data out
    const data = canvas.toDataURL("image/jpeg");
    const link = document.createElement("a");
    link.href = data;
    link.setAttribute("download", "handsome");
    //link.textContent = "Download Image";
    link.innerHTML = `<img src="${data}" alt="img" >`
    strip.insertBefore(link, strip.firstChild);

}


function redEffect(pixals) {

    for (let i = 0; i < pixals.data.length; i += 4) {
        // pixals[i] // red
        //pixals[i + 1] // green 
        //pixals[i + 2] //blue 

        pixals.data[i + 0] = pixals.data[i + 0] + 100; //red
        pixals.data[i + 1] = pixals.data[i + 1] - 50; // green
        pixals.data[i + 2] = pixals.data[i + 2] * 0.5; // blue
    }

    return pixals;
}

function rgbSplit(pixals) {
    for (let i = 0; i < pixals.data.length; i += 4) {
        pixals.data[i - 150] = pixals.data[i + 0]; //red
        pixals.data[i + 100] = pixals.data[i + 1]; // green
        pixals.data[i + 150] = pixals.data[i + 2]; // blue
    }

    return pixals;
}

function greenScreen(pixals) {
    const levels = {};

    document.querySelectorAll(".rgb input").forEach((input) => {
        levels[input.name] = input.value;
    });

    for (i = 0; i < pixals.data.length; i = i + 4) {
        red = pixals.data[i + 0];
        green = pixals.data[i + 1];
        blue = pixals.data[i + 2];
        alpha = pixals.data[i + 3];

        if (red >= levels.rmin
            && green >= levels.gmin
            && blue >= levels.bmin
            && red <= levels.rmax
            && green <= levels.gmax
            && blue <= levels.bmax) {
            pixals.data[i + 3] = 0;
        }
    }

    return pixals;
}

getVideo();

video.addEventListener("canplay", paintToCanvas);

