const navAuth = document.getElementById("nav-auth");
const storedUser = localStorage.getItem("loggedInUser");
const loggedUser = storedUser ? JSON.parse(storedUser) : null;

if (loggedUser && loggedUser.status) {
  navAuth.innerHTML = `
  <a href="profile.html" class="btn btn-hover">
    <span>Profile</span>
  </a>
  <button id="logout" class="btn-danger btn-danger-hover">
    <span>Logout</span>
  </button>
`;

  document
    .getElementById("logout")
    .addEventListener("click", function () {
      localStorage.removeItem("loggedInUser");
      window.location.href = "/src/index.html";
    });
}

document.addEventListener("DOMContentLoaded", function () {
  const storedUserData = localStorage.getItem("loggedInUser");
  if (!storedUserData) {
    alert("No user data found! Please log in.");
    window.location.href = "/src/index.html";
    return;
  }

  const userData = JSON.parse(storedUserData);

  // Display user info
  document.getElementById("username").innerHTML = `@${userData.username}`;
  document.getElementById("profile-image").src =
    "../images/profile-user.png";

  // Form fields
  const usernameForm = document.getElementById("username-form");
  const emailForm = document.getElementById("email-form");
  const passwordForm = document.getElementById("password-form");
  const confirmPasswordForm = document.getElementById(
    "confirm_password_form"
  );
  const editForm = document.getElementById("edit-form");

  // Pre-fill user data (excluding password for security)
  usernameForm.value = userData.username;
  emailForm.value = userData.email;

  editForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const updatedUsername = usernameForm.value.trim();
    const updatedEmail = emailForm.value.trim();
    const updatedPassword = passwordForm.value.trim();
    const confirmedPassword = confirmPasswordForm.value.trim();

    if (updatedPassword && updatedPassword !== confirmedPassword) {
      let passwordMatch = document.getElementById("passwords-match");
      passwordMatch.style.display = "block";

      setTimeout(() => {
        passwordMatch.style.display = "none";
      }, 3000);

      return;
    }

    // Create updated user object
    const updatedUserData = {
      username: updatedUsername,
      email: updatedEmail,
      password: updatedPassword ? updatedPassword : userData.password, // Only update if changed
      status: true,
      profileImage: "../images/profile-user.png",
    };

    localStorage.setItem("loggedInUser", JSON.stringify(updatedUserData));

    // Update users list in localStorage
    let users = JSON.parse(localStorage.getItem("users")) || [];
    users = users.map((user) =>
      user.username === userData.username ? updatedUserData : user
    );
    localStorage.setItem("users", JSON.stringify(users));

    let successUpdate = document.getElementById("success-edit");
    successUpdate.style.display = "block";

    setTimeout(() => {
      successUpdate.style.display = "none";
      window.location.href = "profile.html"; // Redirect after success message
    }, 3000);
  });
});

// Favorite Movies
const cards_container = document.getElementById("cards-container");
const loggeduser = localStorage.getItem("loggedInUser");
const favoritesData = localStorage.getItem(`favorites_${loggeduser}`);

if (favoritesData) {
  const favorites = JSON.parse(favoritesData);
  if (favorites.length > 0) {
    favorites.forEach((movieId) => {
      fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4NjU2MTA2YzQzZWQ4YTE4MWY1NTQ1MWQyNzE1N2IwNSIsIm5iZiI6MTY1Mzc1MzI3Ni42NTEsInN1YiI6IjYyOTI0NWJjNWE0NjkwMDA5ZTQ1YzYyOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.dJVNpdz4E-lTr5XxqqUpbVkVRufZ_llITMvAPxrtxFw",
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          cards_container.innerHTML += `
      <div class="card">
        <img src="https://image.tmdb.org/t/p/w300${data.poster_path}" id="movie-banner" width="200px" alt="movie title">
        <a href="movie-details.html?id=${movieId}"><h2>${data.title}</h2></a>
      </div>`;
        })
        .catch((error) =>
          console.error("Error fetching movie details:", error)
        );
    });
  }
}