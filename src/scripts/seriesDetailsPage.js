const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4NjU2MTA2YzQzZWQ4YTE4MWY1NTQ1MWQyNzE1N2IwNSIsIm5iZiI6MTY1Mzc1MzI3Ni42NTEsInN1YiI6IjYyOTI0NWJjNWE0NjkwMDA5ZTQ1YzYyOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.dJVNpdz4E-lTr5XxqqUpbVkVRufZ_llITMvAPxrtxFw", // Replace with your actual TMDB API key
  },
};

// Get series ID from URL
const urlParams = new URLSearchParams(window.location.search);
const seriesId = urlParams.get("id");

if (seriesId) {
  // Fetch Series Details
  fetch(`https://api.themoviedb.org/3/tv/${seriesId}?language=en-US`, options)
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("movie-title").textContent = data.name; // 'name' instead of 'title'

      document.getElementById("movie-banner").src = data.poster_path
        ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
        : "./images/placeholder.jpg"; // Fallback for missing images
      document.getElementById("movie-category").textContent = data.genres
        .map((genre) => genre.name)
        .join(", ");
      document.getElementById("movie-description").textContent = data.overview;
      document.getElementById("release-date").textContent = data.first_air_date; // 'first_air_date' for series
      document.getElementById("rating").textContent =
        data.vote_average.toFixed(1);
      document.getElementById("runtime").textContent = data.episode_run_time
        ? data.episode_run_time[0]
        : "N/A"; // 'episode_run_time' for series, may be an array
      document.getElementById("budget").textContent = "N/A"; // Series don't have a budget
      document.getElementById("production-companies").textContent =
        data.production_companies.map((company) => company.name).join(", ");
    })
    .catch((error) => console.error("Error fetching series details:", error));

  // Fetch Cast & Crew
  fetch(`https://api.themoviedb.org/3/tv/${seriesId}/credits`, options)
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

  // Fetch Similar Series
  fetch(
    `https://api.themoviedb.org/3/tv/${seriesId}/similar?language=en-US&page=1`,
    options
  )
    .then((response) => response.json())
    .then((data) => {
      const similarMoviesList = document.getElementById("similar-movies-list");
      similarMoviesList.innerHTML = ""; // Clear previous content

      data.results.slice(0, 5).forEach((series) => {
        const seriesItem = document.createElement("div");
        seriesItem.classList.add("item");
        seriesItem.innerHTML = `
          <img src="${
            series.poster_path
              ? `https://image.tmdb.org/t/p/w300${series.poster_path}`
              : "./images/movie-placeholder.jpg"
          }" alt="${series.name}">
          <p>${series.name}</p>
        `;
        similarMoviesList.appendChild(seriesItem);
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
    .catch((error) => console.error("Error fetching similar series:", error));

  // Fetch Trailer
  fetch(`https://api.themoviedb.org/3/tv/${seriesId}/videos`, options)
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

// Back button functionality
document.getElementById("back-button").addEventListener("click", () => {
  window.history.back();
});
