// Function to make an HTTP GET request
function getRequest(url, callback) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => callback(data))
    .catch((error) => console.log(error));
}

// Function to display recipe list
function displayRecipeList(recipes) {
  var recipeList = document.getElementById("recipeList");
  recipeList.innerHTML = "";
  recipes.forEach(function (recipe) {
    var recipeItem = document.createElement("div");
    recipeItem.classList.add("recipe-item");

    var recipeImage = document.createElement("img");
    recipeImage.src = recipe.strMealThumb;
    recipeImage.alt = recipe.strMeal;

    var recipeName = document.createElement("p");
    recipeName.textContent = recipe.strMeal;

    var getRecipeButton = document.createElement("button");
    getRecipeButton.textContent = "Get Recipe";
    getRecipeButton.addEventListener("click", function () {
      openRecipeModal(recipe.idMeal);
    });

    recipeItem.appendChild(recipeImage);
    recipeItem.appendChild(recipeName);
    recipeItem.appendChild(getRecipeButton);

    recipeList.appendChild(recipeItem);
  });
}

// Function to open recipe modal
function openRecipeModal(id) {
  var url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;

  getRequest(url, function (response) {
    if (response.meals) {
      var recipe = response.meals[0];
      var modal = document.getElementById("recipeModal");
      var modalContent = document.getElementById("recipeModalContent");
      var modalCloseBtn = document.getElementById("modalCloseBtn");

      modalContent.innerHTML = `
        <h2>${recipe.strMeal}</h2>
        <p><strong>Category:</strong> ${recipe.strCategory}</p>
        <p><strong>Area:</strong> ${recipe.strArea}</p>
        <p><strong>Instructions:</strong> ${recipe.strInstructions}</p>
        
        <button class="watch-video-button" onclick="watchVideo('${recipe.strYoutube}')">Watch Video</button>
        <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" width="200">
      `;

      modal.style.display = "block";
      modalCloseBtn.style.display = "block";
    } else {
      console.log("Recipe details not found.");
    }
  });
}

// Function to open video page
function watchVideo(videoUrl) {
  window.open(videoUrl);
}

// Function to fetch recipe list based on ingredient
function searchRecipesByIngredient() {
  var ingredient = document.getElementById("search-input").value;
  var url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`;
  var searchResultsTitle = document.getElementById("searchResultsTitle");

  getRequest(url, function (response) {
    if (response.meals) {
      displayRecipeList(response.meals);
      searchResultsTitle.textContent = "Your Search Results:";
    } else {
      var recipeList = document.getElementById("recipeList");
      recipeList.innerHTML = "No recipes found.";
      searchResultsTitle.textContent = "";
    }
  });
}

// Function to close recipe modal
function closeRecipeModal() {
  var modal = document.getElementById("recipeModal");
  var modalCloseBtn = document.getElementById("modalCloseBtn");

  modal.style.display = "none";
  modalCloseBtn.style.display = "none";
}

// Attach event listeners
document
  .getElementById("search-button")
  .addEventListener("click", searchRecipesByIngredient);
document
  .getElementById("modalCloseBtn")
  .addEventListener("click", closeRecipeModal);