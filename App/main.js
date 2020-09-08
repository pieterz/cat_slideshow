let timer
let deleteFirstPhotoDelay

async function start() {
    const url = "https://api.thecatapi.com/v1/breeds"

    try {
        const response = await fetch(url)
        const data = await response.json()
        createBreedList(data)

    } catch (e) {
        console.log("There was a problem fetching the breed list.")
    }
}
//onchange="loadByBreed(this.value)"
function createBreedList(breedList) {
    document.getElementById("breed").innerHTML = `
    <select onchange="loadByBreed(this[this.selectedIndex].id)">
        <option>Choose a cat breed</option>
        ${breedList.map(function (breed) {
            return `<option id=${breed.id}>${breed.name}</option>`
        }).join('')}
    </select>
    `
}

async function loadByBreed(breed){
    if (breed != "") {
        const response = await fetch(`https://api.thecatapi.com/v1/images/search?limit=100&breed_ids=${breed}`)
        const data = await response.json()
        createSlideshow(data)
    }
}

function createSlideshow(images){
    let currentPosition = 0
    clearInterval(timer)
    clearTimeout(deleteFirstPhotoDelay)

    if (images.length > 1) {
        document.getElementById("slideshow").innerHTML = `
        <div class="slide" style="background-image: url('${images[0].url}');"></div>
        <div class="slide" style="background-image: url('${images[1].url}');"></div>
        `
        currentPosition += 2
        if (images.length == 2) currentPosition = 0
        timer = setInterval(nextSlide, 3000)
    } else {
        document.getElementById("slideshow").innerHTML = `
        <div class="slide" style="background-image: url('${images[0].url}');"></div>
        <div class="slide"></div>
        `
    }

    function nextSlide() {
        document.getElementById("slideshow").insertAdjacentHTML("beforeend", `
        <div class="slide" style="background-image: url('${images[currentPosition].url}');"></div>
        `)
        deleteFirstPhotoDelay = setTimeout(function () {
            document.querySelector(".slide").remove()
        }, 1000)
        if (currentPosition + 1 >= images.length) {
            currentPosition = 0
        } else {
            currentPosition++
        }
    }
}

start()