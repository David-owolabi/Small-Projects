const apiKey = "f14da70b3d121989caeb0a8d16b96a7c";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";



const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const searchHistoryDiv = document.querySelector(".search-history");


function getSearchHistory() {
  return JSON.parse(localStorage.getItem("weatherSearchHistory") || "[]");
}

function setSearchHistory(history) {
  localStorage.setItem("weatherSearchHistory", JSON.stringify(history));
}

function addToSearchHistory(city) {
  let history = getSearchHistory();
  city = city.trim();
  if (!city) return;
  // Remove if already exists (case-insensitive)
  history = history.filter(item => item.toLowerCase() !== city.toLowerCase());
  history.unshift(city);
  if (history.length > 5) history = history.slice(0, 5); // Keep last 5
  setSearchHistory(history);
  renderSearchHistory();
}

function renderSearchHistory() {
  const history = getSearchHistory();
  if (history.length === 0) {
    searchHistoryDiv.innerHTML = "";
    return;
  }
  searchHistoryDiv.innerHTML = `<div class=\"history-label\">Recent Searches:</div>` +
    history.map(city => `<button class=\"history-item\">${city}</button>`).join("") +
    `<button class=\"clear-history-btn\" title=\"Clear all recent searches\">Clear</button>`;
  // Add click listeners
  document.querySelectorAll('.history-item').forEach(btn => {
    btn.addEventListener('click', () => {
      searchBox.value = btn.textContent;
      checkWeather(btn.textContent);
    });
  });
  const clearBtn = document.querySelector('.clear-history-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      setSearchHistory([]);
      renderSearchHistory();
    });
  }
}


async function checkWeather(city) {
  const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

  if (response.status == 404) {
    document.querySelector(".error").style.display = "block";
    document.querySelector(".weather").style.display = "none";
  } else {
    var data = await response.json();
    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

    if (data.weather[0].main == "Clouds") {
      weatherIcon.src = "images/clouds.png";
    }
    else if (data.weather[0].main == "Clear") {
      weatherIcon.src = "images/clear.png";
    }
    else if (data.weather[0].main == "Rain") {
      weatherIcon.src = "images/rain.png";
    }
    else if (data.weather[0].main == "Drizzle") {
      weatherIcon.src = "images/drizzle.png";
    }
    else if (data.weather[0].main == "Mist") {
      weatherIcon.src = "images/mist.png";
    }
    document.querySelector(".weather").style.display = "block";
    document.querySelector(".error").style.display = "none";
    addToSearchHistory(data.name);
  }
}

searchBtn.addEventListener("click", () => {
  checkWeather(searchBox.value);
});

// Render search history on page load
renderSearchHistory();
