// index.js

// building out function to handle click on a ramen image
const handleClick = (event) => {
  // check that image was clicked
  if (event.target.tagName === 'IMG') {
    const ramenId = event.target.dataset.id;

    // grabbing ramen details by ID and rendering it
    fetch(`http://localhost:3000/ramens/${ramenId}`)
      .then((response) => response.json())
      .then((ramen) => {
        // populating ramen details in the #ramen-detail section
        document.querySelector('.detail-image').src = ramen.image;
        document.querySelector('.name').textContent = ramen.name;
        document.querySelector('.restaurant').textContent = ramen.restaurant;
        document.getElementById('rating-display').textContent = ramen.rating;
        document.getElementById('comment-display').textContent = ramen.comment;

        // setting values in the edit form so it can update
        document.getElementById('edit-rating').value = ramen.rating;
        document.getElementById('edit-comment').value = ramen.comment;

        // storing ramen ID for later use (for update or delete)
        document.getElementById('edit-ramen').dataset.id = ramen.id;
      });
  }
};

// creating function to handle form submission and create new ramen entry
const addSubmitListener = () => {
  const form = document.getElementById('new-ramen');
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    // get data from form
    const name = document.getElementById('new-name').value;
    const restaurant = document.getElementById('new-restaurant').value;
    const image = document.getElementById('new-image').value;
    const rating = document.getElementById('new-rating').value;
    const comment = document.getElementById('new-comment').value;

    // creating skeleton for new ramen object
    const newRamen = {
      name,
      restaurant,
      image,
      rating,
      comment
    };

    // sending POST request to create new ramen entry
    fetch('http://localhost:3000/ramens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRamen),
    })
      .then((response) => response.json())
      .then((ramen) => {
        // append new ramen to ramen menu (will persist after page refresh)
        const ramenMenu = document.getElementById('ramen-menu');
        const ramenImg = document.createElement('img');
        ramenImg.src = ramen.image;
        ramenImg.alt = ramen.name;
        ramenImg.dataset.id = ramen.id;
        ramenMenu.appendChild(ramenImg);

        //  clear form after submission --> better UI [user interface] experince
        form.reset();
      });
  });
};

// grabbing (fetching) and displaying all ramen
const displayRamens = () => {
  fetch('http://localhost:3000/ramens')
    .then((response) => response.json())
    .then((ramens) => {
      const ramenMenu = document.getElementById('ramen-menu');
      ramenMenu.innerHTML = ''; // im clearing ramen menu first
      ramens.forEach((ramen) => {
        const ramenImg = document.createElement('img');
        ramenImg.src = ramen.image;
        ramenImg.alt = ramen.name;
        ramenImg.dataset.id = ramen.id; // storing ramen ID for later
        ramenMenu.appendChild(ramenImg);
      });
    });
};

// building functionality to add event listener for editing the ramen (update rating + comment)
const addEditSubmitListener = () => {
  const editForm = document.getElementById('edit-ramen');
  editForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const ramenId = editForm.dataset.id; // grabbing ramen ID
    const rating = document.getElementById('edit-rating').value;
    const comment = document.getElementById('edit-comment').value;

    // updated ramen object
    const updatedRamen = {
      rating: rating,
      comment: comment,
    };

    // sending PATCH request to update ramen details
    fetch(`http://localhost:3000/ramens/${ramenId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedRamen),
    })
      .then((response) => response.json())
      .then((ramen) => {
        // after update, display the updated ramen details
        handleClick({ target: { dataset: { id: ramen.id } } }); // re-fetch updated ramen data
      });
  });
};

// building out function to handle deleting ramen
const deleteRamen = (ramenId) => {
  fetch(`http://localhost:3000/ramens/${ramenId}`, {
    method: 'DELETE',
  })
    .then(() => {
      // removing ramen from menu
      const ramenMenu = document.getElementById('ramen-menu');
      const ramenImage = [...ramenMenu.getElementsByTagName('img')].find(
        (img) => img.dataset.id === ramenId.toString()
      );
      if (ramenImage) ramenImage.remove();

      // clearing ramen details section if it's a deleted ramen
      const currentRamenId = document.getElementById('edit-ramen').dataset.id;
      if (currentRamenId === ramenId.toString()) {
        document.querySelector('.detail-image').src = './assets/image-placeholder.jpg';
        document.querySelector('.name').textContent = 'Insert Name Here';
        document.querySelector('.restaurant').textContent = 'Insert Restaurant Here';
        document.getElementById('rating-display').textContent = 'Insert rating here';
        document.getElementById('comment-display').textContent = 'Insert comment here';
      }
    })
    .catch((err) => console.error('Error deleting ramen:', err));
};

// building out function to add event listener for delete ramen button
const addDeleteSubmitListener = () => {
  const deleteButton = document.getElementById('delete-ramen');
  deleteButton.addEventListener('click', (event) => {
    const ramenId = document.getElementById('edit-ramen').dataset.id;
    deleteRamen(ramenId);
  });
};

// main function
const main = () => {
  // renders all the ramens when the page loads
  displayRamens();

  // adding event listener on form for submission so i can create new ramen
  addSubmitListener();

  // adding event listener for editing a ramen (im updating the rating + comment)
  addEditSubmitListener();

  // adding event listener for deleting the ramen
  addDeleteSubmitListener();

  // add event listeners for ramen images in the #ramen-menu
  const ramenMenu = document.getElementById('ramen-menu');
  ramenMenu.addEventListener('click', handleClick);
};

// Invoke main function
main();

// Export functions for testing
export {
  displayRamens,
  addSubmitListener,
  handleClick,
  addEditSubmitListener,
  deleteRamen,
  addDeleteSubmitListener,
  main,
};