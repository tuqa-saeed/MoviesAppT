const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4NjU2MTA2YzQzZWQ4YTE4MWY1NTQ1MWQyNzE1N2IwNSIsIm5iZiI6MTY1Mzc1MzI3Ni42NTEsInN1YiI6IjYyOTI0NWJjNWE0NjkwMDA5ZTQ1YzYyOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.dJVNpdz4E-lTr5XxqqUpbVkVRufZ_llITMvAPxrtxFw", // Replace with your actual TMDB API key
  },
};

// Get movie ID from URL
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get("id");

if (movieId) {
  // Fetch Movie Details
  fetch(`https://api.themoviedb.org/3/movie/${movieId}?language=en-US`, options)
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("movie-title").textContent = data.title;
      document.getElementById("movie-banner").src = data.poster_path
        ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
        : "./images/placeholder.jpg"; // Fallback for missing images
      document.getElementById("movie-category").textContent = data.genres
        .map((genre) => genre.name)
        .join(", ");
      document.getElementById("movie-description").textContent = data.overview;
      document.getElementById("release-date").textContent = data.release_date;
      document.getElementById("rating").textContent =
        data.vote_average.toFixed(1);
      document.getElementById("runtime").textContent = data.runtime;
      document.getElementById("budget").textContent =
        data.budget.toLocaleString();
      document.getElementById("production-companies").textContent =
        data.production_companies.map((company) => company.name).join(", ");
    })
    .catch((error) => console.error("Error fetching movie details:", error));

  // Fetch Cast & Crew
  fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits`, options)
    .then((response) => response.json())
    .then((data) => {
      const castList = document.getElementById("cast-list");
      castList.innerHTML = ""; // Clear previous content

      data.cast.slice(0, 6).forEach((actor) => {
        const castMember = document.createElement("div");
        castMember.classList.add("cast-member");
        castMember.innerHTML = `
          <img src="${
            actor.profile_path
              ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
              : "./images/avatar-placeholder.png"
          }" alt="${actor.name}">
          <p>${actor.name}</p>
        `;
        castList.appendChild(castMember);
      });
    })
    .catch((error) => console.error("Error fetching cast:", error));

  // Fetch Similar Movies
  fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/similar?language=en-US&page=1`,
    options
  )
    .then((response) => response.json())
    .then((data) => {
      const similarMoviesList = document.getElementById("similar-movies-list");
      similarMoviesList.innerHTML = ""; // Clear previous content

      data.results.slice(0, 5).forEach((movie) => {
        const movieItem = document.createElement("div");
        movieItem.classList.add("item");
        movieItem.innerHTML = `
        <a href="movie-details.html?id=${movie.id}">
          <img src="${
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
              : "./images/movie-placeholder.jpg"
          }" alt="${movie.title}">
          <p>${movie.title}</p>
        <a/>`;
        similarMoviesList.appendChild(movieItem);
      });

      // Initialize carousel
      $(".owl-carousel").owlCarousel({
        loop: true,
        margin: 10,
        nav: false,
        responsive: {
          0: { items: 2 },
          600: { items: 3 },
          1000: { items: 4 },
        },
      });
    })
    .catch((error) => console.error("Error fetching similar movies:", error));

  // Fetch Trailer
  fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos`, options)
    .then((response) => response.json())
    .then((data) => {
      const trailer = data.results.find(
        (video) => video.type === "Trailer" && video.site === "YouTube"
      );
      if (trailer) {
        document.getElementById(
          "movie-trailer"
        ).src = `https://www.youtube.com/embed/${trailer.key}`;
      } else {
        document.getElementById("movie-trailer").style.display = "none"; // Hide if no trailer
      }
    })
    .catch((error) => console.error("Error fetching trailer:", error));
}

// Handle Favorite Button Click
document.addEventListener("DOMContentLoaded", () => {
  const favoriteBtn = document.getElementById("favorite-btn");
  const loggeduser = localStorage.getItem("loggedInUser");

  if (!favoriteBtn) {
    console.error("Favorite button not found!");
    return;
  }

  if (!movieId) {
    console.error("Movie ID not found in URL!");
    return;
  }

  if (!loggeduser) {
    favoriteBtn.addEventListener("click", () => {
      window.location.assign("../pages/Authentication/SignIn.html");
    });
    return;
  }

  // Retrieve user-specific favorites
  let userFavorites =
    JSON.parse(localStorage.getItem(`favorites_${loggeduser}`)) || [];

  // Check if movie is already favorited
  if (userFavorites.includes(movieId)) {
    favoriteBtn.classList.add("favorited");
    favoriteBtn.innerHTML = '<i class="bx bxs-heart"></i>'; // Filled heart icon
  }

  // Handle Favorite Button Click
  favoriteBtn.addEventListener("click", () => {
    if (userFavorites.includes(movieId)) {
      // Remove from favorites
      userFavorites = userFavorites.filter((id) => id !== movieId);
      favoriteBtn.classList.remove("favorited");
      favoriteBtn.innerHTML = '<i class="bx bx-heart"></i>'; // Empty heart icon
    } else {
      // Add to favorites
      userFavorites.push(movieId);
      favoriteBtn.classList.add("favorited");
      favoriteBtn.innerHTML = '<i class="bx bxs-heart"></i>'; // Filled heart icon
    }

    // Save user-specific favorites
    localStorage.setItem(
      `favorites_${loggeduser}`,
      JSON.stringify(userFavorites)
    );
  });
});
