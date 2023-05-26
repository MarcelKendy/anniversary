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
        return
    }
    playing_audio = !playing_audio;
    if (playing_audio) {
        audio_button_icon.src = 'images/pause.png'
        audio_button.style.backgroundColor = '#9cff6d'
        audio_button_icon.classList.add('pulse-animation')
    } else {
        audio_button_icon.src = 'images/play.png'
        audio_button.style.backgroundColor = '#f74444'
        audio_button_icon.classList.remove('pulse-animation')
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
    play_button.style.display = 'flex'
}