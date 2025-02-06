const API_KEY = "8656106c43ed8a181f55451d27157b05"; // Your TMDb API Key
const API_URL = "https://api.themoviedb.org/3";

const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const searchResults = document.getElementById("movie-results");
const categoryFilter = document.getElementById("category-filter");

let currentPage = 1; // To keep track of the current page
let isLoading = false;
let query = "";
let selectedGenre = "";

const fetchGenres = async () => {
  try {
    const response = await fetch(
      `${API_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`
    );
    const data = await response.json();

    categoryFilter.innerHTML = `<option value="">All Categories</option>`;
    data.genres.forEach((genre) => {
      categoryFilter.innerHTML += `<option value="${genre.id}">${genre.name}</option>`;
    });
  } catch (error) {
    console.error("Error fetching genres:", error);
  }
};

// Fetch Movies
const fetchMovies = async () => {
  if (isLoading) return; // Prevent multiple fetches
  isLoading = true;

  // Determine the correct URL based on search and category
  let url = `${API_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=${currentPage}`;

  if (query.trim() !== "") {
    url = `${API_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
      query
    )}&language=en-US&page=${currentPage}`;
  } else if (selectedGenre) {
    url = `${API_URL}/discover/movie?api_key=${API_KEY}&with_genres=${selectedGenre}&language=en-US&page=${currentPage}`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (currentPage === 1) {
      searchResults.innerHTML = ""; // Clear previous results only for a new search
    }
    displayMovies(data.results);
    currentPage++;
  } catch (error) {
    console.error("Error fetching movies:", error);
  } finally {
    isLoading = false;
  }
};

// Display Movies on the page
const displayMovies = (movies) => {
  if (movies.length === 0 && currentPage === 1) {
    searchResults.innerHTML = "<p>No movies found.</p>";
  }

  movies.forEach((movie) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");

    movieCard.innerHTML = `
    <a href=movie-details.html?id=${movie.id}>
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${
      movie.title
    }">
      <h3 class="movie-title">${movie.title}</h3>
      <p>⭐ ${movie.vote_average.toFixed(1)}</p>
    </a>`;

    searchResults.appendChild(movieCard);
  });
};

// Load more movies when scrolling near the bottom
const handleScroll = () => {
  if (
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight - 20
  ) {
    fetchMovies();
  }
};

// Event listeners
searchBtn.addEventListener("click", () => {
  query = searchInput.value.trim(); // Update query
  currentPage = 1; // Reset to first page
  searchResults.innerHTML = ""; // Clear previous results
  fetchMovies(); // Fetch new movies
});

searchInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    query = searchInput.value.trim();
    currentPage = 1;
    searchResults.innerHTML = "";
    fetchMovies();
  }
});

categoryFilter.addEventListener("change", () => {
  selectedGenre = categoryFilter.value;
  currentPage = 1;
  searchResults.innerHTML = "";
  fetchMovies();
});

// Initialize
fetchGenres();
fetchMovies();

// Add scroll event listener
window.addEventListener("scroll", handleScroll);
(print) => console.log("hello");
