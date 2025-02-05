const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4NjU2MTA2YzQzZWQ4YTE4MWY1NTQ1MWQyNzE1N2IwNSIsIm5iZiI6MTY1Mzc1MzI3Ni42NTEsInN1YiI6IjYyOTI0NWJjNWE0NjkwMDA5ZTQ1YzYyOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.dJVNpdz4E-lTr5XxqqUpbVkVRufZ_llITMvAPxrtxFw",
  },
};

// Fetch Popular Movies
fetch(
  "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
  options
)
  .then((res) => res.json())
  .then((data) => displayMovies(data.results))
  .catch((err) => handleError("hero-carousel", err));

// Fetch Top Movies
fetch(
  "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
  options
)
  .then((res) => res.json())
  .then((data) => displayTopMovies(data.results))
  .catch((err) => handleError("hero-carousel", err));

// Fetch Popular TV Series
fetch("https://api.themoviedb.org/3/tv/popular?language=en-US&page=1", options)
  .then((res) => res.json())
  .then((data) => displayTopTvSeries(data.results))
  .catch((err) => handleError("hero-carousel", err));
// Fetch Lastest Movies
fetch(
  "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
  options
)
  .then((res) => res.json())
  .then((data) => displayLastestMovies(data.results))
  .catch((err) => handleError("hero-carousel", err));
/**
 * Fetches and displays the latest cartoon movies.
 */
function fetchCartoonMovies() {
  fetch(
    "https://api.themoviedb.org/3/discover/movie?language=en-US&with_genres=16&page=1",
    options
  )
    .then((res) => res.json())
    .then((data) => displayCartoonMovies(data.results))
    .catch((err) => handleError("cartoon-movies", err));
}
/**
 * Handles API errors by displaying a message in the specified element.
 */
function handleError(elementId, error) {
  console.error(`Error fetching data:`, error);
  document.getElementById(
    elementId
  ).innerHTML = `<p class='error-message'>Failed to load data. Please try again later.</p>`;
}
// Function to display hero carousel with movies
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
    watchButton.href = `movie-details.html?id=${movie.id}`;
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
      items: 1,
      dots: false,
      loop: true,
      nav: true,
      navText: [
        "<i class='bx bx-chevron-left'></i>",
        "<i class='bx bx-chevron-right'></i>",
      ],
      autoplay: true,
      autoplayHoverPause: true,
    });
  }, 100); // Delay reinitialization
}

// Fetch additional movie details like duration
function fetchMovieDetails(movieId, durationElement) {
  const detailsURL = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`;
  const detailsOptions = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4NjU2MTA2YzQzZWQ4YTE4MWY1NTQ1MWQyNzE1N2IwNSIsIm5iZiI6MTY1Mzc1MzI3Ni42NTEsInN1YiI6IjYyOTI0NWJjNWE0NjkwMDA5ZTQ1YzYyOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.dJVNpdz4E-lTr5XxqqUpbVkVRufZ_llITMvAPxrtxFw", // Replace with your actual API key
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

// Function to display top movies in a carousel
function displayTopMovies(movies) {
  const movieCarousel = document.getElementById("top-movies-slide");
  movieCarousel.innerHTML = ""; // Clear any previous content

  movies.forEach((movie) => {
    const movieItem = document.createElement("div");
    movieItem.classList.add("movie-item");

    const img = document.createElement("img");
    const imageUrl = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "./images/default-movie.jpg"; // Fallback image
    img.src = imageUrl;
    img.alt = movie.title || "Untitled Movie";
    img.classList.add("movie-item-img");

    const content = document.createElement("div");
    content.classList.add("movie-item-content");

    const title = document.createElement("div");
    title.classList.add("movie-item-title");
    title.textContent = movie.title || "Untitled";

    const movieInfos = document.createElement("div");
    movieInfos.classList.add("movie-infos");

    const rating = document.createElement("div");
    rating.classList.add("movie-info");
    rating.innerHTML = `<i class="bx bxs-star"></i> <span>${
      movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"
    }</span>`;

    const duration = document.createElement("div");
    duration.classList.add("movie-info");
    duration.innerHTML = `<i class="bx bxs-time"></i> <span>Loading...</span>`; // Placeholder

    const hd = document.createElement("div");
    hd.classList.add("movie-info");
    hd.textContent = "HD";

    const ageRating = document.createElement("div");
    ageRating.classList.add("movie-info");
    ageRating.textContent = "16+"; // Adjust as needed

    movieInfos.appendChild(rating);
    movieInfos.appendChild(duration);
    movieInfos.appendChild(hd);
    movieInfos.appendChild(ageRating);

    content.appendChild(title);
    content.appendChild(movieInfos);
    movieItem.appendChild(img);
    movieItem.appendChild(content);

    movieCarousel.appendChild(movieItem);

    // Fetch and update movie duration (or other movie details)
    fetchMovieDetails(movie.id, duration);
  });

  // Reinitialize carousel with Owl Carousel
  setTimeout(() => {
    $("#top-movies-slide").trigger("destroy.owl.carousel"); // Destroy existing instance
    $("#top-movies-slide").owlCarousel({
      items: 2,
      dots: false,
      loop: true,
      autoplay: true,
      autoplayHoverPause: true,
      responsive: {
        500: {
          items: 3,
        },
        1280: {
          items: 4,
        },
        1600: {
          items: 6,
        },
      },
    });
  }, 100); // Delay reinitialization
}
// Function to display top movies in a carousel
function displayLastestMovies(movies) {
  const movieCarousel = document.getElementById("lastest-movies-slider");
  movieCarousel.innerHTML = ""; // Clear any previous content

  movies.forEach((movie) => {
    const movieItem = document.createElement("div");
    movieItem.classList.add("movie-item");

    const img = document.createElement("img");
    const imageUrl = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "./images/default-movie.jpg"; // Fallback image
    img.src = imageUrl;
    img.alt = movie.title || "Untitled Movie";
    img.classList.add("movie-item-img");

    const content = document.createElement("div");
    content.classList.add("movie-item-content");

    const title = document.createElement("div");
    title.classList.add("movie-item-title");
    title.textContent = movie.title || "Untitled";

    const movieInfos = document.createElement("div");
    movieInfos.classList.add("movie-infos");

    const rating = document.createElement("div");
    rating.classList.add("movie-info");
    rating.innerHTML = `<i class="bx bxs-star"></i> <span>${
      movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"
    }</span>`;

    const duration = document.createElement("div");
    duration.classList.add("movie-info");
    duration.innerHTML = `<i class="bx bxs-time"></i> <span>Loading...</span>`; // Placeholder

    const hd = document.createElement("div");
    hd.classList.add("movie-info");
    hd.textContent = "HD";

    const ageRating = document.createElement("div");
    ageRating.classList.add("movie-info");
    ageRating.textContent = "16+"; // Adjust as needed

    movieInfos.appendChild(rating);
    movieInfos.appendChild(duration);
    movieInfos.appendChild(hd);
    movieInfos.appendChild(ageRating);

    content.appendChild(title);
    content.appendChild(movieInfos);
    movieItem.appendChild(img);
    movieItem.appendChild(content);

    movieCarousel.appendChild(movieItem);

    // Fetch and update movie duration (or other movie details)
    fetchMovieDetails(movie.id, duration);
  });

  // Reinitialize carousel with Owl Carousel using the correct selector
  setTimeout(() => {
    $("#lastest-movies-slider").trigger("destroy.owl.carousel"); // Destroy existing instance
    $("#lastest-movies-slider").owlCarousel({
      items: 2,
      dots: false,
      loop: true,
      autoplay: true,
      autoplayHoverPause: true,
      responsive: {
        500: { items: 3 },
        1280: { items: 4 },
        1600: { items: 6 },
      },
    });
  }, 100); // Delay reinitialization
}

// Function to display top movies in a carousel
// Function to display top TV Series in a carousel
function displayTopTvSeries(tvSeries) {
  const tvCarousel = document.getElementById("topSeries-slide");
  tvCarousel.innerHTML = ""; // Clear any previous content

  tvSeries.forEach((series) => {
    console.log(series);
    const seriesItem = document.createElement("div");
    seriesItem.classList.add("movie-item");
    const link = document.createElement("a");
    link.href = `series-details.html?id=${series.id}`;

    const img = document.createElement("img");
    const imageUrl = series.poster_path
      ? `https://image.tmdb.org/t/p/w500${series.poster_path}`
      : "./images/default-movie.jpg"; // Fallback image
    img.src = imageUrl;
    img.alt = series.name || "Untitled TV Series";
    img.classList.add("movie-item-img");

    const content = document.createElement("div");
    content.classList.add("movie-item-content");

    const title = document.createElement("div");
    title.classList.add("movie-item-title");
    title.textContent = series.name || "Untitled";

    const seriesInfos = document.createElement("div");
    seriesInfos.classList.add("movie-infos");

    const rating = document.createElement("div");
    rating.classList.add("movie-info");
    rating.innerHTML = `<i class="bx bxs-star"></i> <span>${
      series.vote_average ? series.vote_average.toFixed(1) : "N/A"
    }</span>`;

    const duration = document.createElement("div");
    duration.classList.add("movie-info");
    duration.innerHTML = `<i class="bx bxs-time"></i> <span>Loading...</span>`; // Placeholder

    const hd = document.createElement("div");
    hd.classList.add("movie-info");
    hd.textContent = "HD";

    const ageRating = document.createElement("div");
    ageRating.classList.add("movie-info");
    ageRating.textContent = "16+"; // Adjust as needed

    seriesInfos.appendChild(rating);
    seriesInfos.appendChild(duration);
    seriesInfos.appendChild(hd);
    seriesInfos.appendChild(ageRating);

    content.appendChild(title);
    content.appendChild(seriesInfos);
    seriesItem.appendChild(link);
    link.appendChild(img);
    seriesItem.appendChild(content);

    tvCarousel.appendChild(seriesItem);

    // Fetch and update TV series duration (or other details)
    fetchSeriesDetails(series.id, duration);
  });

  // Reinitialize carousel with Owl Carousel
  setTimeout(() => {
    $("#topSeries-slide").trigger("destroy.owl.carousel"); // Destroy existing instance
    $("#topSeries-slide").owlCarousel({
      items: 2,
      dots: false,
      loop: true,
      autoplay: true,
      autoplayHoverPause: true,
      responsive: {
        500: {
          items: 3,
        },
        1280: {
          items: 4,
        },
        1600: {
          items: 6,
        },
      },
    });
  }, 100); // Delay reinitialization
}

// Fetch additional TV series details like duration
function fetchSeriesDetails(seriesId, durationElement) {
  const detailsURL = `https://api.themoviedb.org/3/tv/${seriesId}?language=en-US`;
  const detailsOptions = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4NjU2MTA2YzQzZWQ4YTE4MWY1NTQ1MWQyNzE1N2IwNSIsIm5iZiI6MTY1Mzc1MzI3Ni42NTEsInN1YiI6IjYyOTI0NWJjNWE0NjkwMDA5ZTQ1YzYyOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.dJVNpdz4E-lTr5XxqqUpbVkVRufZ_llITMvAPxrtxFw", // Replace with your actual API key
    },
  };

  fetch(detailsURL, detailsOptions)
    .then((res) => res.json())
    .then((data) => {
      const duration = data.episode_run_time
        ? `${data.episode_run_time[0]} mins`
        : "N/A";
      durationElement.innerHTML = `<i class="bx bxs-time"></i> <span>${duration}</span>`;
    })
    .catch((err) => {
      console.error(
        `Error fetching details for TV series ID ${seriesId}:`,
        err
      );
      durationElement.innerHTML = `<i class="bx bxs-time"></i> <span>N/A</span>`;
    });
}

/**
 * Displays cartoon movies in the carousel.
 */
function displayCartoonMovies(movies) {
  const cartoonContainer = document.getElementById("cartoon-movies");
  cartoonContainer.innerHTML = "";

  movies.forEach((movie) => {
    const movieItem = document.createElement("a");
    movieItem.href = `movie-details.html?id=${movie.id}`;
    movieItem.classList.add("movie-item");

    const img = document.createElement("img");
    img.src = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "./images/default-movie.jpg";
    img.alt = movie.title || "Untitled Movie";

    const content = document.createElement("div");
    content.classList.add("movie-item-content");

    const title = document.createElement("div");
    title.classList.add("movie-item-title");
    title.textContent = movie.title || "Untitled";

    const movieInfos = document.createElement("div");
    movieInfos.classList.add("movie-infos");

    const rating = document.createElement("div");
    rating.classList.add("movie-info");
    rating.innerHTML = `<i class="bx bxs-star"></i> <span>${
      movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"
    }</span>`;

    const hd = document.createElement("div");
    hd.classList.add("movie-info");
    hd.textContent = "HD";

    const ageRating = document.createElement("div");
    ageRating.classList.add("movie-info");
    ageRating.textContent = "PG"; // Default rating, adjust if needed

    movieInfos.appendChild(rating);
    movieInfos.appendChild(hd);
    movieInfos.appendChild(ageRating);

    content.appendChild(title);
    content.appendChild(movieInfos);
    movieItem.appendChild(img);
    movieItem.appendChild(content);
    cartoonContainer.appendChild(movieItem);
  });

  // Reinitialize Owl Carousel for cartoons
  setTimeout(() => {
    $("#cartoon-movies").trigger("destroy.owl.carousel");
    $("#cartoon-movies").owlCarousel({
      items: 2,
      dots: false,
      loop: true,
      autoplay: true,
      autoplayHoverPause: true,
      responsive: {
        500: { items: 3 },
        1280: { items: 4 },
        1600: { items: 6 },
      },
    });
  }, 100);
}

// Call the function to load cartoons
fetchCartoonMovies();

// Fetch trending movies for the day
fetch("https://api.themoviedb.org/3/trending/movie/day", options)
  .then((response) => response.json())
  .then((data) => {
    if (data.results && data.results.length > 0) {
      // Choose the first trending movie as the Movie of the Day
      const movie = data.results[0];

      // Fetch full movie details using the selected movie's id
      fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}?language=en-US`,
        options
      )
        .then((response) => response.json())
        .then((movieData) => {
          // Select the element by id "moiveOfTheDay"
          const movieSection = document.getElementById("moiveOfTheDay");
          if (!movieSection) return;

          // Update the banner image
          const imgEl = movieSection.querySelector("img");
          if (imgEl) {
            imgEl.src = movieData.poster_path
              ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}`
              : "./images/placeholder.jpg";
            imgEl.alt = movieData.title;
          }

          // Update the movie title
          const titleEl = movieSection.querySelector(".item-content-title");
          if (titleEl) {
            titleEl.textContent = movieData.title;
          }

          // Update movie infos: rating, runtime, and age rating
          const movieInfos = movieSection.querySelectorAll(".movie-info");
          if (movieInfos.length >= 4) {
            // Rating (first item)
            const ratingEl = movieInfos[0].querySelector("span");
            if (ratingEl) {
              ratingEl.textContent = movieData.vote_average
                ? movieData.vote_average.toFixed(1)
                : "N/A";
            }
            // Runtime (second item)
            const runtimeEl = movieInfos[1].querySelector("span");
            if (runtimeEl) {
              runtimeEl.textContent = movieData.runtime
                ? `${movieData.runtime} mins`
                : "N/A";
            }
            // Third info ("HD") remains static
            // Age Rating (fourth item): Use the 'adult' flag to decide
            const ageEl = movieInfos[3].querySelector("span");
            if (ageEl) {
              ageEl.textContent = movieData.adult ? "18+" : "PG";
            }
          }

          // Update the movie description
          const descEl = movieSection.querySelector(
            ".item-content-description"
          );
          if (descEl) {
            descEl.textContent = movieData.overview;
          }

          // Update the "Watch now" button link (for example, to a details page)
          const watchLink = movieSection.querySelector(".item-action a");
          if (watchLink) {
            watchLink.href = `movie-details.html?id=${movieData.id}`;
          }
        })
        .catch((error) =>
          console.error("Error fetching full movie details:", error)
        );
    } else {
      console.error("No trending movies found.");
    }
  })
  .catch((error) => console.error("Error fetching trending movies:", error));
