const axios = require("axios");
const express = require("express");
const regex = /^[a-zA-Z0-9 !@#$%^&*)(]{2,40}$/;

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/search", (req, res) => {
  res.render("search", { movieDetails: "" });
});

app.post("/search", (req, res) => {
  let apiKey = "95ad7d4eb26fc0b6ce1566fce9ac0b48";
  let userMovieInput = req.body.movieTitle;

  let movieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${userMovieInput}`;
  let genresUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en`;

  let endpoints = [movieUrl, genresUrl];

  if (userMovieInput && regex.test(userMovieInput)) {
    axios.all(endpoints.map((endpoint) => axios.get(endpoint))).then(
      axios.spread((movie, genres) => {
        const movieRaw = movie.data.results[0];
        const allMovieGenres = genres.data.genres;
        let movieGenresIds = movieRaw.genre_ids;

        let movieGenresArray = [];

        for (i = 0; i < movieGenresIds.length; i++) {
          for (j = 0; j < allMovieGenres.length; j++) {
            if (movieGenresIds[i] === allMovieGenres[j].id) {
              movieGenresArray.push(allMovieGenres[j].name);
            }
          }
        }

        let genresToDisplay = "";
        movieGenresArray.forEach((genre) => {
          genresToDisplay = genresToDisplay + `${genre}, `;
        });

        genresToDisplay = genresToDisplay.slice(0, -2);

        let movieData = {
          title: movieRaw.title,
          year: new Date(movieRaw.release_date).getFullYear(),
          genres: genresToDisplay,
          overview: movieRaw.overview,
          posterUrl: `https://image.tmdb.org/t/p/w500${movieRaw.poster_path}`,
          rating: movieRaw.vote_average.toFixed(1),
        };

        res.render("search", { movieDetails: movieData });
      })
    );
  }
});

app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening on port ${port}!`);
});
