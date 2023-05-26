const messages = [
    'Cara batatinha reformed...',
    'Venho através desta breguice',
    'Celebrar nosso primeiro ano juntos',
    'Agora curta esse visual...'
]
const ending_message = 'Feliz aniversário de namoro! 28/05/2023'
const slide_show = document.getElementById('slideshow')
const message_container = document.getElementById('message-container')
const play_button = document.getElementById('play-button')
const replay_button = document.getElementById('replay-button')
const audio_button_icon = document.getElementById('audio-button-icon')
const audio_button = document.getElementById('audio-button')
const audio_song = document.getElementById("audio-song");
let playing_audio = false
let audio
let slide_show_interval
let heart_container
let first_pop = true

function startProgram() {
    audio = new Audio('audio/background.mp3')
    audio.loop = true
    play_button.style.display = 'none'
    audio_button.style.display = 'flex'
    replay_button.style.display = 'flex'
    toggleAudio()
    playSlides()
}

function playAudio(play = true) {
    play ? audio.play() : audio.pause()
}

function playSlides() {
    const slideDirectory = 'images/slide/'
    let images = []
    let current_image = 0
    let current_message_index = 0
    fetchSlideImages(slideDirectory).then(imageUrls => {
        images = imageUrls
        startSlideshow()
    }).catch(error => {
        console.error('Failed to fetch slide images:', error)
    })

    function fetchSlideImages(directory) {
        return fetch(directory).then(response => response.text()).then(html => {
            const parser = new DOMParser()
            const doc = parser.parseFromString(html, 'text/html')
            const links = Array.from(doc.getElementsByTagName('a'))
            const imageUrls = links
                .map(link => link.getAttribute('href'))
                .filter(href => isImageFile(href))
                .map(href => `${directory}${href}`)
            return imageUrls
        })
    }

    function isImageFile(filename) {
        return /\.(jpe?g|png|gif|bmp)$/i.test(filename)
    }

    function startSlideshow() {
        slide_show_interval = setInterval(() => { changeSlide(), current_message_index < messages.length ? showMessages() : popParty() }, 8000)
        changeSlide()
        showMessages()

        /*slide_show_interval = setInterval(() => { current_message_index < messages.length ? showMessages() : (changeSlide(), popParty()) }, 8000)
        //changeSlide()
        */

        function changeSlide() {
            const next_image = (current_image + 1) % images.length
            const next_image_url = `url('${images[next_image]}')`
            slide_show.style.backgroundImage = next_image_url
            current_image = next_image
        }

        function showMessages(fadeaway = true, timer = 7000) {
            message_container.textContent = messages[current_message_index]
            current_message_index++
            message_container.style.opacity = 1
            fadeaway && setTimeout(() => {
                    message_container.style.opacity = 0
            }, timer)
        }
    }
}

function popParty() {
    first_pop && (() => {
        message_container.textContent = ending_message
        message_container.classList.add('pulse-text-animation')
        message_container.style.opacity = 1
        timerTotal = 30
        first_pop = false
    })()
    heart_container && heart_container.remove()
    heart_container = document.createElement('div')
    heart_container.className = 'heart-container'
    for (let i = 0; i < 50; i++) {
        const heart = document.createElement('img')
        heart.src = 'images/heart.png'
        heart.className = 'heart'
        const size = getRandomSize(20, 70)
        const xPos = getRandomPosition(0, window.innerWidth)
        heart.style.width = `${size}px`
        heart.style.height = `${size}px`
        heart.style.left = `${xPos}px`
        heart.style.bottom = '0'
        heart_container.appendChild(heart)
        setTimeout(() => { heart.style.opacity = convertRange(size, 20, 70, 0.4, 1) }, 100)
        animateHeart(heart)
    }

    document.body.appendChild(heart_container)

    function getRandomSize(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    function getRandomPosition(min, max) {
        return Math.floor(Math.random() * (max - min)) + min
    }

    function convertRange(value, min_input, max_input, min_output, max_output) {
        value = value < min_input ? min_input : (value > max_input ? max_input : value)
        let result = (value * min_output) / min_input
        return result < min_output ? min_output : (result > max_output ? max_output : result)
    }

    function animateHeart(heart) {
        const top = window.innerHeight + 100
        const duration = getRandomSize(3000, 8000)
        heart.animate(
            [
                { transform: `translateY(0px)` },
                { transform: `translateY(-${top}px)` },
            ],
            {
                duration: duration,
                easing: 'ease-in',
                fill: 'forwards',
            }
        )
        setTimeout(() => {
            heart.remove()
        }, duration)
    }
}

function toggleAudio(reset = false) {
    if (reset) {
        playing_audio = false
        playAudio(playing_audio)
        audio_button.style.display = 'none'
        audio_song.innerHTML = '&#9835 Mamonas Assassinas - Pelados em Santos'
        return
    }
    playing_audio = !playing_audio;
    if (playing_audio) {
        audio_button_icon.src = 'images/pause.png'
        audio_button.style.backgroundColor = '#9cff6d'
        audio_button_icon.classList.add('pulse-animation')
        audio_song.innerHTML = '&#9835 Mamonas Assassinas - Pelados em Santos'
    } else {
        audio_button_icon.src = 'images/play.png'
        audio_button.style.backgroundColor = '#f74444'
        audio_button_icon.classList.remove('pulse-animation')
        audio_song.innerHTML = '&#x23F8 Mamonas Assassinas - Pelados em Santos'
    }
    playAudio(playing_audio);
}

function replay() {
    clearInterval(slide_show_interval)
    toggleAudio(true)
    slide_show.style.backgroundImage = 'none'
    replay_button.style.display = 'none'
    message_container.textContent = ''
    message_container.style.opacity = 0
    message_container.classList.remove('pulse-text-animation')
    if (heart_container) {
        heart_container.remove()
    }
    first_pop = true
    timerTotal = 90
    play_button.style.display = 'flex'
}


// canvas animation, fireworks baby

window.requestAnimFrame = (function () {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        }
    );
})();

var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    cw = window.innerWidth,
    ch = window.innerHeight,
    fireworks = [],
    particles = [],
    hue = 120,
    limiterTotal = 5,
    limiterTick = 0,
    timerTotal = 90,
    timerTick = 0,
    mousedown = false,
    mx,
    my;

canvas.width = cw;
canvas.height = ch;

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function calculateDistance(p1x, p1y, p2x, p2y) {
    var xDistance = p1x - p2x,
        yDistance = p1y - p2y;
    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

function Firework(sx, sy, tx, ty) {
    this.x = sx;
    this.y = sy;
    this.sx = sx;
    this.sy = sy;
    this.tx = tx;
    this.ty = ty;
    this.distanceToTarget = calculateDistance(sx, sy, tx, ty);
    this.distanceTraveled = 0;
    this.coordinates = [];
    this.coordinateCount = 3;
    while (this.coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
    }
    this.angle = Math.atan2(ty - sy, tx - sx);
    this.speed = 2;
    this.acceleration = 1.05;
    this.brightness = random(50, 70);
    this.targetRadius = 1;
}

Firework.prototype.update = function (index) {
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);

    if (this.targetRadius < 8) {
        this.targetRadius += 0.3;
    } else {
        this.targetRadius = 1;
    }

    this.speed *= this.acceleration;

    var vx = Math.cos(this.angle) * this.speed,
        vy = Math.sin(this.angle) * this.speed;
    this.distanceTraveled = calculateDistance(this.sx, this.sy, this.x + vx, this.y + vy);

    if (this.distanceTraveled >= this.distanceToTarget) {
        first_pop ? createParticles(this.tx, this.ty) : createParticles(this.tx, this.ty, 200);
        fireworks.splice(index, 1);
    } else {
        this.x += vx;
        this.y += vy;
    }
};

Firework.prototype.draw = function (size = 1) {
    ctx.beginPath();
    ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
    ctx.lineTo(this.x, this.y);
    ctx.lineWidth = size
    ctx.strokeStyle = 'hsl(' + hue + ', 100%, ' + this.brightness + '%)';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(this.tx, this.ty, this.targetRadius, 0, Math.PI * 2);
    ctx.stroke();
};

function Particle(x, y) {
    this.x = x;
    this.y = y;
    this.coordinates = [];
    this.coordinateCount = 5;
    while (this.coordinateCount--) {
        this.coordinates.push([this.x, this.y]);
    }
    this.angle = random(0, Math.PI * 2);
    this.speed = random(1, 10);
    this.friction = 0.95;
    this.gravity = 1;
    this.hue = random(hue - 50, hue + 50);
    this.brightness = random(50, 80);
    this.alpha = 1;
    this.decay = random(0.015, 0.03);
}

Particle.prototype.update = function (index) {
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);
    this.speed *= this.friction;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;
    this.alpha -= this.decay;
    if (this.alpha <= this.decay) {
        particles.splice(index, 1);
    }
};

Particle.prototype.draw = function (size = 1) {
    ctx.beginPath();
    ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
    ctx.lineTo(this.x, this.y);
    ctx.lineWidth = size
    ctx.strokeStyle = 'hsla(' + this.hue + ', 100%, ' + this.brightness + '%, ' + this.alpha + ')';
    ctx.stroke();
};

function createParticles(x, y, qtt = 30) {
    var particleCount = qtt;
    while (particleCount--) {
        particles.push(new Particle(x, y));
    }
}

function loop() {
    requestAnimFrame(loop);
    hue = random(0, 360);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, cw, ch);
    ctx.globalCompositeOperation = 'lighter';

    var i = fireworks.length;
    while (i--) {
        fireworks[i].draw(first_pop ? undefined : 4);
        fireworks[i].update(i);
    }

    var i = particles.length;
    while (i--) {
        particles[i].draw(first_pop ? undefined : 4);
        particles[i].update(i);
    }

    if (timerTick >= timerTotal) {
        if (!mousedown) {
            fireworks.push(new Firework(cw / 2, ch, random(0, cw), random(0, ch / 2)));
            timerTick = 0;
        }
    } else {
        timerTick++;
    }

    if (limiterTick >= limiterTotal) {
        if (mousedown) {
            fireworks.push(new Firework(cw / 2, ch, mx, my));
            limiterTick = 0;
        }
    } else {
        limiterTick++;
    }
}

canvas.addEventListener('mousemove', function (e) {
    mx = e.pageX - canvas.offsetLeft;
    my = e.pageY - canvas.offsetTop;
});

canvas.addEventListener('mousedown', function (e) {
    e.preventDefault();
    mousedown = true;
});

canvas.addEventListener('mouseup', function (e) {
    e.preventDefault();
    mousedown = false;
});

window.onload = loop;
