const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4NjU2MTA2YzQzZWQ4YTE4MWY1NTQ1MWQyNzE1N2IwNSIsIm5iZiI6MTY1Mzc1MzI3Ni42NTEsInN1YiI6IjYyOTI0NWJjNWE0NjkwMDA5ZTQ1YzYyOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.dJVNpdz4E-lTr5XxqqUpbVkVRufZ_llITMvAPxrtxFw", // Replace with your actual API key
  },
};

fetch(
  "https://api.themoviedb.org/3/movie/popular?language=en-US&page=2",
  options
)
  .then((res) => res.json())
  .then((data) => {
    const movies = data.results;
    console.log(movies);
    displayMovies(movies);
  })
  .catch((err) => {
    console.error("Error fetching movies:", err);
    document.getElementById("hero-carousel").innerHTML =
      "<p class='error-message'>Failed to load movies. Please try again later.</p>";
  });

function displayMovies(movies) {
  const heroCarousel = document.getElementById("hero-carousel");
  heroCarousel.innerHTML = ""; // Clear any previous content

  movies.forEach((movie) => {
    const movieSlide = document.createElement("div");
    movieSlide.classList.add("hero-slide-item");

    const img = document.createElement("img");
    const imageUrl = movie.backdrop_path
      ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
      : "./images/default-movie.jpg"; // Fallback image
    img.src = imageUrl;
    img.alt = movie.title || "Untitled Movie";
    img.classList.add("carousel-image");

    const overlay = document.createElement("div");
    overlay.classList.add("overlay");

    const content = document.createElement("div");
    content.classList.add("hero-slide-item-content");

    const wrapper = document.createElement("div");
    wrapper.classList.add("item-content-wraper");

    const title = document.createElement("div");
    title.classList.add("item-content-title", "top-down");
    title.textContent = movie.title || "Untitled";

    const movieInfos = document.createElement("div");
    movieInfos.classList.add("movie-infos", "top-down", "delay-2");

    const rating = document.createElement("div");
    rating.classList.add("movie-info");
    rating.innerHTML = `<i class="bx bxs-star"></i> <span>${
      movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"
    }</span>`;

    const duration = document.createElement("div");
    duration.classList.add("movie-info");
    duration.innerHTML = `<i class="bx bxs-time"></i> <span>Loading...</span>`;

    const hd = document.createElement("div");
    hd.classList.add("movie-info");
    hd.textContent = "HD";

    const ageRating = document.createElement("div");
    ageRating.classList.add("movie-info");
    ageRating.textContent = "16+"; // Adjust based on the movie rating

    movieInfos.appendChild(rating);
    movieInfos.appendChild(duration);
    movieInfos.appendChild(hd);
    movieInfos.appendChild(ageRating);

    const description = document.createElement("div");
    description.classList.add(
      "item-content-description",
      "top-down",
      "delay-4"
    );
    description.textContent = movie.overview
      ? movie.overview.slice(0, 150) + "..."
      : "No description available.";

    const action = document.createElement("div");
    action.classList.add("item-action", "top-down", "delay-6");

    const watchButton = document.createElement("a");
    watchButton.href = `https://www.themoviedb.org/movie/${movie.id}`;
    watchButton.classList.add("btn", "btn-hover");
    watchButton.innerHTML = `<i class="bx bxs-right-arrow"></i> <span>Watch now</span>`;

    action.appendChild(watchButton);
    wrapper.appendChild(title);
    wrapper.appendChild(movieInfos);
    wrapper.appendChild(description);
    wrapper.appendChild(action);

    content.appendChild(wrapper);
    movieSlide.appendChild(overlay);
    movieSlide.appendChild(img);
    movieSlide.appendChild(content);

    heroCarousel.appendChild(movieSlide);

    // Fetch and update movie duration
    fetchMovieDetails(movie.id, duration);
  });

  // Destroy and reinitialize Owl Carousel
  setTimeout(() => {
    $("#hero-carousel").trigger("destroy.owl.carousel"); // Destroy existing instance
    $("#hero-carousel").owlCarousel({
      // Reinitialize the carousel with new items
      items: 1,
      dots: false,
      loop: true,
      nav: true,
      navText: [
        "<i class='bx bx-chevron-left'></i>",
        "<i class='bx bx-chevron-right'></i>",
      ],
      autoplay: false,
      autoplayHoverPause: true,
    });
  }, 100); // Delay reinitialization to allow content to be appended
}

function fetchMovieDetails(movieId, durationElement) {
  const detailsURL = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`;
  const detailsOptions = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: "Bearer YOUR_TMDB_API_KEY", // Replace with your actual API key
    },
  };

  fetch(detailsURL, detailsOptions)
    .then((res) => res.json())
    .then((data) => {
      const duration = data.runtime ? `${data.runtime} mins` : "N/A";
      durationElement.innerHTML = `<i class="bx bxs-time"></i> <span>${duration}</span>`;
    })
    .catch((err) => {
      console.error(`Error fetching details for movie ID ${movieId}:`, err);
      durationElement.innerHTML = `<i class="bx bxs-time"></i> <span>N/A</span>`;
    });
}
