"use strict";

// ------- IMPORTS -------
import movies from "../data/movies.js";
import { onEvent, select } from "./utils.js";

// ------- DOM SELECTIONS -------

const dropdownMovieNames = select(".dropdown-movie-names");
const inputMovieName = select(".input-movie-name");
const btnFind = select(".btn-find");
const movieInfoContainer = select(".movie-info");
const movieImg = select(".movie-img");
const movieName = select(".movie-name");
const movieYear = select(".movie-year");
const movieDuration = select(".movie-duration");
const movieSummary = select(".movie-summary");
const movieGenreContainer = select(".movie-genre");
const errorMessage = select(".error-message");

// ------- MAIN CODE --------

// This function filters the movie names based on user input, i.e., it checks if the movie name contains the word from user input.
// It returns the array of filtered movie names.
function filterMovieNames(userInput) {
  // Creating array of movie titles from the array of movies.
  const movieNames = movies.map((movie) => movie.title);

  let filteredMovieNames;

  if (userInput === "the") {
    // Displaying only the top 5 results, if user types "the"
    filteredMovieNames = movieNames
      .filter((movieName) => movieName.toLowerCase().includes("the"))
      .slice(0, 5);
  } else {
    filteredMovieNames = movieNames.filter((movieName) =>
      movieName.toLowerCase().includes(userInput)
    );
  }
  return filteredMovieNames;
}

// This function displays the filtered movie names in a dropdown list.
function displayFilteredMovieNames(filteredMovieNames) {
  if (filteredMovieNames.length === 0) {
    dropdownMovieNames.style.display = "none";
    return;
  }

  // Creating a list item for each filtered movie name and adding it to the dropdown
  filteredMovieNames.forEach((movieName) => {
    const listItem = document.createElement("li");
    listItem.innerText = movieName;
    dropdownMovieNames.appendChild(listItem);

    dropdownMovieNames.style.display = "block";

    // Adding a click event to each list item to populate the input with the movie name selected from dropdown.
    onEvent("click", listItem, function () {
      inputMovieName.value = movieName;
      dropdownMovieNames.style.display = "none";
    });
  });
}

// This function loads the movie names into the dropdown list based on the user input and also populates the search bar with the selected movie
function loadMovieNamesDropdown() {
  let userInput = inputMovieName.value.toLowerCase().trim();

  // Clearing the previous results
  dropdownMovieNames.innerHTML = "";

  if (userInput === "") {
    dropdownMovieNames.style.display = "none";
    return;
  }

  const filteredMovieNames = filterMovieNames(userInput);

  displayFilteredMovieNames(filteredMovieNames);
}

// This function displays the all the information about the movie
function displayMovieInfo(movie) {
  movieImg.src = movie.poster;
  movieName.innerText = `${movie.title}`;
  movieYear.innerText = `${movie.year}`;
  movieDuration.innerText = `${movie.runningTime}`;
  movieSummary.innerText = `${movie.description}`;

  movieGenreContainer.innerHTML = "";

  // Adding the genres to the genre container
  movie.genre.forEach((movieGenre) => {
    const genreDiv = document.createElement("div");
    genreDiv.classList.add("genre");
    genreDiv.innerText = movieGenre;
    movieGenreContainer.appendChild(genreDiv);
  });

  // Making the movie info container visible
  movieInfoContainer.style.visibility = "visible";
}

// This function checks if the user-entered movie name exists in the list of movies
function checkMovieName() {
  let userInputMovieName = inputMovieName.value.toLowerCase().trim();

  // Finding the movie in the movies array with the title entered by the user
  let movie = movies.find((movie) => {
    return movie.title.toLowerCase() === userInputMovieName;
  });

  // Showing an error message if the movie is not found
  if (movie == null) {
    errorMessage.innerText = "Movie not found";
    errorMessage.style.visibility = "visible";
  } else {
    // Hiding the error message and displaying the movie information and clearing the input in search bar
    errorMessage.style.visibility = "hidden";
    displayMovieInfo(movie);
    inputMovieName.value = "";
  }
}

// ------- EVENTS -------

// Adding event listener to the input field to load the movie names dropdown as the user types
onEvent("input", inputMovieName, function () {
  loadMovieNamesDropdown();
});

// Adding event listener to the find button to check the movie name and display its information
onEvent("click", btnFind, function (event) {
  // Preventing the form from submitting
  event.preventDefault();
  checkMovieName();
});
