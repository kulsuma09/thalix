// Preloader 
 window.addEventListener('load', function() {
  const loaderBox = document.querySelector('#preloader');
  if (loaderBox) {
    loaderBox.style.transition = 'opacity 0.5s ease';
    loaderBox.style.opacity = '1';
    
    setTimeout(() => {
      loaderBox.style.display = 'none';
    }, 300);
  }
});
 
// Recipes featch from API & recipe search from search box 
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const recipesContainer = document.getElementById('recipesContainer');
const noResultsMessage = document.getElementById('noResultsMessage');

//  API URL for searching meals
const SEARCH_API_URL = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
// API URL for looking up meal details by ID
const LOOKUP_API_URL = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=';

async function fetchRecipes(foodName) {
    try {
        const response = await fetch(`${SEARCH_API_URL}${foodName}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.meals;
    } catch (error) {
        console.error('Error fetching recipes:', error);
        return null; 
    }
}

function displayRecipes(meals) {
    recipesContainer.innerHTML = '';
    noResultsMessage.style.display = 'none';

    if (!meals || meals.length === 0) {
        noResultsMessage.style.display = 'block'; 
        return;
    }

    meals.forEach(meal => {
        const mealCard = document.createElement('div');
        mealCard.classList.add('col'); 
        mealCard.innerHTML = `
            <div class="card h-100">
                <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
                <div class="card-body">
                    <h5 class="card-title">${meal.strMeal}</h5>
                    <p class="card-text">${meal.strInstructions.substring(0, 100)}</p>
                    <button class="btn view-details-btn" data-meal-id="${meal.idMeal}">View Details</button>
                </div>
            </div>
        `;
        recipesContainer.appendChild(mealCard);
    });
    attachViewDetailsListeners();
}

async function handleViewDetails(mealId) {
    try {
        const response = await fetch(`${LOOKUP_API_URL}${mealId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const meal = data.meals ? data.meals[0] : null;

        if (meal) {
            const existingModal = document.getElementById('mealDetailsModal');
            if (existingModal) existingModal.remove();

            // Create modal HTML dynamically
            const modalHTML = `
                <div class="modal fade" id="mealDetailsModal" tabindex="-1" aria-labelledby="mealDetailsModalLabel" aria-hidden="true">
                  <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content">
                      <div class="modal-header">
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div class="modal-body">
                        <img src="${meal.strMealThumb}" class="w-100 mb-3" style="height:450px; object-fit:fill;" alt="${meal.strMeal}">
                        <p style= "font-size:24px;"><strong> ${meal.strMeal || 'N/A'} </strong></p>
                        <p>${meal.strInstructions}</p>
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-warning" data-bs-dismiss="modal" style="color:#fff; text-transform: capitalize; font-size:18px">Close</button>
                      </div>
                    </div>
                  </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);

            const modalElement = document.getElementById('mealDetailsModal');
            const bootstrapModal = new bootstrap.Modal(modalElement);
            bootstrapModal.show();
        } else {
            alert('Details not found for this meal.');
        }
    } catch (error) {
        console.error('Error fetching meal details:', error);
        alert('Could not fetch meal details. Please try again.');
    }
}
function attachViewDetailsListeners() {
    document.querySelectorAll('.view-details-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const mealId = event.target.dataset.mealId;
            handleViewDetails(mealId);
        });
    });
}

async function performSearch() {
    const foodName = searchInput.value.trim(); 
    if (foodName) {
        const meals = await fetchRecipes(foodName);
        displayRecipes(meals);
    } else {
        recipesContainer.innerHTML = '';
        noResultsMessage.style.display = 'block';
        noResultsMessage.querySelector('p').textContent = 'Please enter a food name to search.';
    }
}

searchButton.addEventListener('click', performSearch);

searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        performSearch();
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    const initialMeals = await fetchRecipes('chicken');
    displayRecipes(initialMeals);
});


// TO Top Button

const btn = document.getElementById('to_top');

window.addEventListener('scroll', function() {
  if (window.scrollY > 300) {
    btn.classList.add('show');
  } else {
    btn.classList.remove('show');
  }
});

btn.addEventListener('click', function(e) {
  e.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});