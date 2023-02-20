/* Selectors */

const gallery = document.querySelector("#gallery");
const searchInput = document.querySelector("#search-input");
const searchButton = document.querySelector(".search-button");
const genresList = document.querySelector(".genres-list");

/* Functions */

// Function: to fetch data from Steam API
const fetchData = async (endpoint) => {
  let url = `https://steam-api-dot-cs-platform-306304.et.r.appspot.com/${endpoint}`;
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (err) {
    console.log("error", err.message);
  }
};

// Function: to render the game gallery when the home page is loaded
const renderGames = (data) => {
  const newDiv = document.createElement("div");
  newDiv.innerHTML = `<div class="game-container">
      <div class="cover" onClick="showInfo(${data["appid"]})">
          <img
          src="${data["header_image"]}" data-id="${data["appid"]}"
          />
          <div class="game-details">
              <p class="game-name">${data["name"]}</p>
              <p class="game-price">$${data["price"]}</p>
          </div>
      </div>
    </div>`;
  gallery.appendChild(newDiv);
};

const renderGallery = async (endpoint) => {
  const data = await fetchData(endpoint);
  gallery.innerHTML = "";
  data.data.map((game) => renderGames(game));
};

// Rocket Bonus - Function: to render the information of a single game when users click on the game image
const renderInfo = (data) => {
  gallery.innerHTML = "";
  const newDiv = document.createElement("div");
  newDiv.innerHTML = `<div class="game-gallery information">
      <div class="title-information">
          <div class="name">${data.data.name}</div>
      </div>
      <div class="main-information">
          <img
              src="${data.data.header_image}"
              alt="${data.data.name}"
          />
          <div class="game-information-container">
              <div class="game-information">
                  <p class="game-description">${data.data.description}</p>
                  <p class="game-text">RELEASE DATE: ${data.data.release_date}</p>
                  <p class="game-text">DEVELOPER: ${data.data.developer}</p>
                  <p class="game-text">PLATFORMS: ${data.data.platforms}</p>
                  <p class="game-text">GENRES: ${data.data.genres}</p>
                  <p class="game-text">Popular user-defined tags: ${data.data.steamspy_tags}</p>
                  <p class="price">$${data.data.price}</p>
              </div>
          </div>
      </div>
    </div>
    `;
  gallery.appendChild(newDiv);
};

// Function: this function is activated when users click on the game images in the gallery
const showInfo = async (appId) => {
  const data = await fetchData(`single-game/${appId}`);
  renderInfo(data);
};

/* Event Listeners */

// Search function when using the search box to search for a game
searchButton.addEventListener("click", (e) => {
  const value = searchInput.value;
  renderGallery(`games?q=${value}&limit=100`);
});

// Trigger a click event on the search button when pressing Enter
searchInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    searchButton.click();
  }
});

// Filter games by genres when clicking on the genres in the sidebar
genresList.addEventListener("click", (e) => {
  const value = e.target.innerText;
  renderGallery(`games?genres=${value.toLowerCase()}&limit=100`);
});

// Initial render of game gallery
renderGallery(`games?limit=100`);
