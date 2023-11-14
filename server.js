const axios = require("axios");
const express = require("express");

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/search", (req, res) => {
  res.render("search", { movieDetails: "" });
});

app.post("/search", (req, res) => {
  let apiKey = "95ad7d4eb26fc0b6ce1566fce9ac0b48";
  let movieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=Free+Guy&`;
  let genresUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en`;

  let endpoints = [movieUrl, genresUrl];

  axios.all(endpoints.map((endpoint) => axios.get(endpoint))).then(
    axios.spread((movie, genres) => {
      console.log(movie.data.results[0]);

      const movieRaw = movie.data.results[0];

      let movieData = {
        title: movieRaw.title,
        year: new Date(movieRaw.release_date).getFullYear(),
        genres: "",
        overview: movieRaw.overview,
        posterUrl: `https://image.tmdb.org/t/p/w500${movieRaw.poster_path}`,
      };

      res.render("search", { movieDetails: movieData });
    })
  );
});

app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening on port ${port}!`);
});
