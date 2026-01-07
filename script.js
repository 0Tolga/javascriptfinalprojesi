var apiKey = "20ad8b78";

var searchInput = document.getElementById("searchInput");
var searchBtn = document.getElementById("searchBtn");
var movieList = document.getElementById("movieList");
var detail = document.getElementById("detail");
var statusText = document.getElementById("status");
var statsText = document.getElementById("stats");
var sortSelect = document.getElementById("sortSelect");
var themeBtn = document.getElementById("themeBtn");

var movies = [];
var favorites = JSON.parse(localStorage.getItem("favorites")) || [];
var timer;

/* Film arama */
function searchMovie() {
  var filmAdi = searchInput.value;

  if (filmAdi === "") {
    statusText.innerText = "Film adı giriniz";
    return;
  }

  statusText.innerText = "Yükleniyor...";
  movieList.innerHTML = "";
  detail.innerHTML = "";

 /* İskelet */
  for (var i = 0; i < 3; i++) {
    movieList.innerHTML += "<div class='skeleton'></div>";
  }

  fetch("https://www.omdbapi.com/?apikey=" + apiKey + "&s=" + filmAdi)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {

      if (data.Response === "False") {
        statusText.innerText = "Sonuç bulunamadı";
        movieList.innerHTML = "";
        return;
      }

      movies = data.Search;
      statusText.innerText = "";
      showMovies(movies);
    })
    .catch(function () {
      statusText.innerText = "Hata oluştu";
    });
}

/* Filmleri göster */
function showMovies(list) {
  movieList.innerHTML = "";

  for (var i = 0; i < list.length; i++) {
    var film = list[i];

    var div = document.createElement("div");
    div.className = "movie";

    var favClass = favorites.includes(film.imdbID) ? "fav" : "";

    div.innerHTML =
      "<img src='" + (film.Poster !== "N/A" ? film.Poster : "") + "'><br>" +
      "<b>" + film.Title + "</b><br>" +
      film.Year + "<br>" +
      "<button class='" + favClass + "' onclick=\"toggleFav('" + film.imdbID + "')\">⭐</button> " +
      "<button onclick=\"showDetail('" + film.imdbID + "')\">Detaylar</button>";

    movieList.appendChild(div);
  }

  statsText.innerText =
    "Toplam: " + list.length + " | Favori: " + favorites.length;
}

/* Detay */
function showDetail(id) {
  detail.innerHTML = "Detay yükleniyor...";

  fetch("https://www.omdbapi.com/?apikey=" + apiKey + "&i=" + id)
    .then(function (res) {
      return res.json();
    })
    .then(function (film) {
      detail.innerHTML =
        "<h3>" + film.Title + "</h3>" +
        "<p><b>Tür:</b> " + film.Genre + "</p>" +
        "<p>" + film.Plot + "</p>";
    });
}

/* Favori */
function toggleFav(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter(function (f) {
      return f !== id;
    });
  } else {
    favorites.push(id);
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
  showMovies(movies);
}

/* SIRALAMA */
sortSelect.addEventListener("change", function () {
  if (sortSelect.value === "az") {
    movies.sort(function (a, b) {
      return a.Title.localeCompare(b.Title);
    });
  }

  if (sortSelect.value === "za") {
    movies.sort(function (a, b) {
      return b.Title.localeCompare(a.Title);
    });
  }

  showMovies(movies);
});

/* Yükleniyor */
searchInput.addEventListener("input", function () {
  clearTimeout(timer);
  timer = setTimeout(searchMovie, 500);
});

/* Tema */
themeBtn.addEventListener("click", function () {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark"));
});

if (localStorage.getItem("theme") === "true") {
  document.body.classList.add("dark");
}

/* Buton */
searchBtn.addEventListener("click", searchMovie);