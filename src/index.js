let addToy = false;
const toyCollection = document.querySelector("#toy-collection");
document.addEventListener("DOMContentLoaded", () => {
  // variables
  
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  
  
  addBtn.addEventListener("click", () => {
      // hide & seek with the form
      addToy = !addToy;
      if (addToy) {
        toyFormContainer.style.display = "block";
      } else {
        toyFormContainer.style.display = "none";
      }
  });

  // GET request
  fetch('http://localhost:3000/toys')
    .then(resp => resp.json())
    .then(toys => {
      // console.log(toys)
      // use .map here to create an array of HTML that you want to put onto the DOM
      let toysHTML = toys.map(function(toy){
        // console.log(toy)
        return `
        <div class="card">
        <h2>${toy.name}</h2>
        <img src=${toy.image} class="toy-avatar" />
        <p>${toy.likes} Likes </p>
        <button data-id="${toy.id}"class="like-btn">Like <3</button>
      </div>`
      })
      // adds the above html to the dom for each element in the toys object.
      // use .join('') to remove commas that come from the array
      toyCollection.innerHTML += toysHTML.join('')
    })

  toyFormContainer.addEventListener('submit', function(e) {
    e.preventDefault()
    // gets the user inp of new toy
    const toyName = e.target.name.value
    const toyImg = e.target.image.value

    // POST request 
    fetch('http://localhost:3000/toys', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        "name": toyName,
        "image": toyImg,
        "likes": 0
      })
    })
    .then(resp => resp.json())
    .then(newToy => {
      // JSON object added to db once "create new toy is clicked"
      const newToyHTML = `
      <div class="card">
      <h2>${newToy.name}</h2>
      <img src=${newToy.image} class="toy-avatar" />
      <p>${newToy.likes} Likes </p>
      <button data-id="${newToy.id}" class="like-btn">Like <3</button>
    </div>
      `
      toyCollection.innerHTML += newToyHTML
    })
    // clear the user input 
    e.target.reset
  })

  toyCollection.addEventListener('click', (e) => {
    // Only work with like button
      if (e.target.className === "like-btn"){
        const arr = e.target.previousElementSibling.innerText.split(" ");
        let likeInt = parseInt(arr[0]);
        e.target.previousElementSibling.innerText = `${likeInt + 1} Likes`

        // PATCH request
        fetch(`http://localhost:3000/toys/${e.target.dataset.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            "likes": likeInt + 1
          })
        })
        .then(r => r.json())
        // DOM already update on line 82
      }
  })
});
