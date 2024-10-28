document.getElementById('getWeather').addEventListener('click', function () {
    const city = document.getElementById('city').value;
    if (city) {
        getWeatherData(city);
        getAirQualityData(city); // Fetch AQI
    } else {
        alert('Please enter a city name.');
    }
});

// Function to get air quality data
async function getAirQualityData(city) {
    const apiKey = '4adcec2f9b1cb0993697bd830751f642';
    const geocodingUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    
    try {
        // First, get coordinates of the city
        const geocodingResponse = await fetch(geocodingUrl);
        const locationData = await geocodingResponse.json();
        const { lon, lat } = locationData.coord;

        // Fetch air quality data based on coordinates
        const aqiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        const aqiResponse = await fetch(aqiUrl);
        const aqiData = await aqiResponse.json();
        
        displayAQI(aqiData.list[0].main.aqi); // AQI index 1-5
    } catch (error) {
        alert('Error retrieving air quality data.');
        console.error(error);
    }
}

function displayAQI(aqi) {
    const aqiResult = document.getElementById('aqiResult');
    let aqiText = '';
    let aqiClass = '';

    if (aqi === 1) {
        aqiText = 'Good';
        aqiClass = 'aqi-good';
    } else if (aqi === 2) {
        aqiText = 'Fair';
        aqiClass = 'aqi-fair';
    } else if (aqi === 3) {
        aqiText = 'Moderate';
        aqiClass = 'aqi-moderate';
    } else if (aqi === 4) {
        aqiText = 'Poor';
        aqiClass = 'aqi-poor';
    } else if (aqi === 5) {
        aqiText = 'Very Poor';
        aqiClass = 'aqi-very-poor';
    }

    aqiResult.innerHTML = `
        <h4>Air Quality Index (AQI)</h4>
        <p class="${aqiClass}">AQI Level: ${aqiText}</p>
    `;
}

async function getWeatherData(city) {
    const apiKey = '4adcec2f9b1cb0993697bd830751f642';
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    try {
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();
        displayWeather(weatherData);

        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();
        displayForecast(forecastData);
    } catch (error) {
        alert('Error retrieving weather data.');
        console.error(error);
    }
}

function displayWeather(data) {
    const weatherResult = document.getElementById('weatherResult');
    weatherResult.innerHTML = `
        <h4>Current Weather in ${data.name}</h4>
        <p>Temperature: ${data.main.temp} °C</p>
        <p>Humidity: ${data.main.humidity} %</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
    `;
}

function displayForecast(data) {
    const forecastResult = document.getElementById('forecastResult');
    forecastResult.innerHTML = '';
    
    // Group the forecasts by date
    const forecastsByDate = {};

    data.list.forEach(forecast => {
        const date = new Date(forecast.dt_txt).toLocaleDateString();
        if (!forecastsByDate[date]) {
            forecastsByDate[date] = [];
        }
        forecastsByDate[date].push(forecast);
    });

    // Get the next four days
    const today = new Date().toLocaleDateString();
    const nextFourDays = Object.keys(forecastsByDate).filter(date => date !== today).slice(0, 4);

    nextFourDays.forEach(date => {
        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');

        // Get the first forecast for that day
        const dailyForecast = forecastsByDate[date][0];

        // Get the icon from the forecast data
        const iconCode = dailyForecast.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`; // Color icon URL

        forecastItem.innerHTML = `
            <h5>${date}</h5>
            <img src="${iconUrl}" alt="${dailyForecast.weather[0].description}">
            <p>Temp: ${dailyForecast.main.temp} °C</p>
            <p>${dailyForecast.weather[0].description}</p>
        `;
        
        forecastResult.appendChild(forecastItem);
    });
}
