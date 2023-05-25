const messages = [
    'Cara batatinha reformed...',
    'Venho através desta breguice',
    'Celebrar nosso primeiro ano juntos',
    'Feliz aniversário de namoro! 28/05/2022',
    'Agora curta esse visual...'
]
let current_message_index = 0
let messageTimer
const message_container = document.getElementById('message-container')

function loadSlides() {
    const slideshowElement = document.getElementById('slideshow')
    const slideDirectory = 'images/slide/'

    let images = []
    let currentImage = 0

    fetchSlideImages(slideDirectory)
        .then(imageUrls => {
            images = imageUrls
            startSlideshow()
        })
        .catch(error => {
            console.error('Failed to fetch slide images:', error)
        })

    function fetchSlideImages(directory) {
        return fetch(directory)
            .then(response => response.text())
            .then(html => {
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
        setInterval(() => { changeSlide(); current_message_index < messages.length ? showMessages() : popParty() }, 8000)
        changeSlide()
        showMessages()
    }

    function changeSlide() {
        const nextImage = (currentImage + 1) % images.length
        const nextImageUrl = `url('${images[nextImage]}')`
        slideshowElement.style.backgroundImage = nextImageUrl
        currentImage = nextImage
    }

    function showMessages() {
        message_container.textContent = messages[current_message_index]
        message_container.style.opacity = 1
        setTimeout(() => {
            message_container.style.opacity = 0
        }, 7000)
        current_message_index++
    }
}

function popParty() {
    const container = document.createElement('div')
    container.className = 'heart-container'
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
        container.appendChild(heart)
        document.body.appendChild(container)
        setTimeout(() => { heart.style.opacity = convertRange(size, 20, 70, 0.4, 1) }, 100)
        animateHeart(heart)
    }

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

function startProgram() {
    const playButton = document.getElementById('play-button')
    const audio = new Audio('audio/background.mp3')
    audio.loop = true
    audio.play()
    playButton.style.display = 'none'
    loadSlides()
}