document.addEventListener("DOMContentLoaded", () => {
    const dogBar = document.getElementById("dog-bar")
    const dogInfo = document.getElementById("dog-info")
    const dogFilter = document.getElementById("good-dog-filter")
    let filter = false; 

    function addDog(dog) {
        const newDog = document.createElement("span")
        newDog.innerText = dog.name 

        newDog.addEventListener("click", () => {
            dogInfo.innerHTML = ""
            const image = document.createElement("img")
            image.src = dog.image 

            const name = document.createElement("h2")
            name.innerText = dog.name 
            
            
            const button = document.createElement("button")
            dog.isGoodDog ? button.innerText = "Good Dog!" : button.innerText = "Bad Dog!"

            //How can we DRY out this code???
            button.addEventListener("click", () => {
                if (dog.isGoodDog) {
                    fetch("http://localhost:3000/pups/"+dog.id, {
                        method: "PATCH", 
                        headers: {
                            "Content-Type": "application/json", 
                            "Accept": "application/json"
                        }, 
                        body: JSON.stringify({
                            isGoodDog: false 
                        })
                    })
                    .then(resp => resp.json())
                    .then((updatedDog) => {
                        button.innerText = "Bad Dog!"
                        dog = updatedDog //need to update the dog 
                    })
                }
                else {
                    fetch("http://localhost:3000/pups/"+dog.id, {
                        method: "PATCH", 
                        headers: {
                            "Content-Type": "application/json", 
                            "Accept": "application/json"
                        }, 
                        body: JSON.stringify({
                            isGoodDog: true 
                        })
                    })
                    .then(resp => resp.json())
                    .then((updatedDog) => {
                        button.innerText = "Good Dog!"
                        dog = updatedDog //need to update the dog 
                    })
                }
            })

            dogInfo.append(image, name, button)
        })

        dogBar.append(newDog)
    }

    function getPups() {
        dogBar.innerHTML = ""
        fetch("http://localhost:3000/pups")
        .then(resp => resp.json())
        .then((dogs) => {
            dogs.forEach(dog => {
                if (filter) {
                    if (dog.isGoodDog) addDog(dog);  
                }
                else {
                    addDog(dog)
                }
            })
        })
    }

    dogFilter.addEventListener("click", () => {
        if (filter) {
            dogFilter.innerText = "Filter good dogs: OFF"
        }
        else {
            dogFilter.innerText = "Filter good dogs: ON"
        }
        filter = !filter
        getPups()
    })
    getPups()
})