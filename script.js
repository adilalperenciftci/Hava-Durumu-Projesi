document.getElementById('getWeatherBtn').addEventListener('click', function() {
    let city = document.getElementById('cityInput').value;
    getWeather(city);
    getForecast(city);
});

function getWeather(city) {
    const apiKey = '28c93dfd4b892f0ded84748e965a8cd4';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Hava durumu verisi bulunamadı.');
            }
            return response.json();
        })
        .then(data => {
            displayWeather(data);
            saveSearchHistory(city);
            displaySearchHistory();
        })
        .catch(error => console.error('Hata:', error));
}

function displayWeather(data) {
    const { name } = data;
    const { description, icon } = data.weather[0];
    const { temp, humidity, pressure } = data.main;
    const { speed } = data.wind;
    const { all } = data.clouds;

    const weatherHTML = `
        <h5 class="card-title">${name}</h5>
        <img src="http://openweathermap.org/img/wn/${icon}.png" alt="Hava durumu ikonu">
        <p class="card-text">${description}</p>
        <p class="card-text">Sıcaklık: ${temp.toFixed(1)}°C</p>
        <p class="card-text">Nem: ${humidity}%</p>
        <p class="card-text">Hava Basıncı: ${pressure} hPa</p>
        <p class="card-text">Rüzgar Hızı: ${speed} m/s</p>
        <p class="card-text">Bulutluluk: ${all}%</p>
    `;

    const weatherInfoDiv = document.getElementById('weatherInfo');
    weatherInfoDiv.innerHTML = weatherHTML;
    weatherInfoDiv.style.display = 'block';
}

function getForecast(city) {
    const apiKey = '28c93dfd4b892f0ded84748e965a8cd4';
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Hava durumu tahmini bulunamadı.');
            }
            return response.json();
        })
        .then(data => displayForecast(data))
        .catch(error => console.error('Hata:', error));
}

function displayForecast(data) {
    const forecastDiv = document.getElementById('forecast');
    forecastDiv.innerHTML = '';

    data.list.forEach((forecast, index) => {
        if (index % 8 === 0) {
            const date = new Date(forecast.dt * 1000);
            const day = date.toLocaleDateString('tr-TR', { weekday: 'long' });
            const temp = forecast.main.temp.toFixed(1);
            const description = forecast.weather[0].description;

            const forecastHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${day}</h5>
                        <p class="card-text">${description}</p>
                        <p class="card-text">Sıcaklık: ${temp}°C</p>
                    </div>
                </div>
            `;

            forecastDiv.innerHTML += forecastHTML;
        }
    });

    forecastDiv.style.display = 'block';
}

function getWeatherByLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            getWeatherByCoords(lat, lon);
            getForecastByCoords(lat, lon);
        }, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function getWeatherByCoords(lat, lon) {
    const apiKey = '28c93dfd4b892f0ded84748e965a8cd4';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Hava durumu verisi bulunamadı.');
            }
            return response.json();
        })
        .then(data => {
            displayWeather(data);
            saveSearchHistory(data.name);
            displaySearchHistory();
        })
        .catch(error => console.error('Hata:', error));
}

function getForecastByCoords(lat, lon) {
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    getWeatherByLocation();
    displaySearchHistory();
});

function saveSearchHistory(city) {
    let searches = localStorage.getItem('searchHistory');
    if (searches) {
        searches = JSON.parse(searches);
    } else {
        searches = [];
    }

    // Yeni aramayı başa ekle ve benzersiz olmasını sağla
    searches = [city, ...new Set(searches)];
    localStorage.setItem('searchHistory', JSON.stringify(searches));
}

function displaySearchHistory() {
    let searches = localStorage.getItem('searchHistory');
    if (searches) {
        searches = JSON.parse(searches);
        const historyDiv = document.getElementById('searchHistory');
        historyDiv.innerHTML = '<h5>Arama Geçmişi</h5>';

        searches.forEach(city => {
            historyDiv.innerHTML += `<button type="button" class="btn btn-secondary btn-sm m-1" onclick="getWeather('${city}')">${city}</button>`;
        });
    }
}
