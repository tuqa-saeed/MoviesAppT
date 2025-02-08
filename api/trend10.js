document.addEventListener("DOMContentLoaded", () => {
  const top10Container = document.getElementById("top10");
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4NjU2MTA2YzQzZWQ4YTE4MWY1NTQ1MWQyNzE1N2IwNSIsIm5iZiI6MTY1Mzc1MzI3Ni42NTEsInN1YiI6IjYyOTI0NWJjNWE0NjkwMDA5ZTQ1YzYyOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.dJVNpdz4E-lTr5XxqqUpbVkVRufZ_llITMvAPxrtxFw", // Replace with your actual TMDB API key
    },
  };

  const fetchTop10Movies = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1`,
        options
      );
      const data = await response.json();
      const top10Movies = data.results.slice(0, 10); // Get the first 10 movies

      top10Container.innerHTML = "";
      top10Movies.forEach((movie, index) => {
        const movieDiv = document.createElement("div");
        movieDiv.classList.add("item");

        const movieImage = document.createElement("img");
        movieImage.src = `https://image.tmdb.org/t/p/w200${movie.poster_path}`;
        movieDiv.appendChild(movieImage);

        const movieTitle = document.createElement("h2");
        movieTitle.textContent = `${index + 1}. ${movie.title}`;
        movieDiv.appendChild(movieTitle);

        top10Container.appendChild(movieDiv);
      });
    } catch (error) {
      console.error("Error fetching top 10 movies:", error);
    }
  };

  fetchTop10Movies();
});
