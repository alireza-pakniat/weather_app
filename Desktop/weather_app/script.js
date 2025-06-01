document.addEventListener('DOMContentLoaded', () => {
    
    const ipLocationText = document.getElementById('ip-location');
    const detectLocationBtn = document.getElementById('detect-location-btn');
    const browserLocationStatusText = document.getElementById('browser-location-status');
    const nearestCapitalText = document.getElementById('capital-city-name');
    const citySelect = document.getElementById('city-select');
    const weatherLocationDisplay = document.getElementById('weather-location-display');
    const currentTempText = document.getElementById('current-temp');
    const currentConditionText = document.getElementById('current-condition');
    const currentWindText = document.getElementById('current-wind');
    const sevenDayContainer = document.getElementById('seven-day-container');
    const hourlyTodayContainer = document.getElementById('hourly-today-container');
    const hourlyTomorrowContainer = document.getElementById('hourly-tomorrow-container');

    
    const IP_GEOLOCATION_API_URL = 'http://ip-api.com/json/'; 

    
    const iranianProvincialCapitals = [
        { name: "Tehran", lat: 35.6892, lon: 51.3890 },
        { name: "Mashhad", lat: 36.2970, lon: 59.6062 },
        { name: "Isfahan", lat: 32.6546, lon: 51.6670 },
        { name: "Shiraz", lat: 29.5918, lon: 52.5841 },
        { name: "Tabriz", lat: 38.0800, lon: 46.2919 },
        { name: "Karaj", lat: 35.8327, lon: 50.9915 },
        { name: "Qom", lat: 34.6401, lon: 50.8764 },
        { name: "Ahvaz", lat: 31.3183, lon: 48.6706 },
        { name: "Kermanshah", lat: 34.3142, lon: 47.0650 },
        { name: "Urmia", lat: 37.5527, lon: 45.0761 },
        { name: "Rasht", lat: 37.2808, lon: 49.5832 },
        { name: "Zahedan", lat: 29.4963, lon: 60.8629 },
        { name: "Hamadan", lat: 34.7982, lon: 48.5146 },
        { name: "Kerman", lat: 30.2832, lon: 57.0788 },
        { name: "Yazd", lat: 31.8974, lon: 54.3699 },
        { name: "Ardabil", lat: 38.2463, lon: 48.2951 },
        { name: "Bandar Abbas", lat: 27.1865, lon: 56.2808 },
        { name: "Arak", lat: 34.0917, lon: 49.6891 },
        { name: "Zanjan", lat: 36.6709, lon: 48.4851 },
        { name: "Sanandaj", lat: 35.3133, lon: 46.9969 },
        { name: "Qazvin", lat: 36.2684, lon: 50.0049 },
        { name: "Khorramabad", lat: 33.4878, lon: 48.3558 },
        { name: "Gorgan", lat: 36.8381, lon: 54.4347 },
        { name: "Sari", lat: 36.5650, lon: 53.0591 },
    ];

    // --- Location Functions ---
    async function fetchLocationByIP() {
        ipLocationText.textContent = 'Detecting location based on IP...';
        browserLocationStatusText.textContent = '';
        try {
            const response = await fetch(IP_GEOLOCATION_API_URL);
            if (!response.ok) {
                throw new Error(`IP Geolocation API Error: ${response.status}`);
            }
            const data = await response.json();

            if (data.status === 'success') {
                const city = data.city || 'Unknown City';
                const lat = data.lat;
                const lon = data.lon;
                ipLocationText.textContent = `Approx. Location (IP): ${city}`;
                updateLocationAndWeather({ lat, lon, name: city, source: 'IP' });
            } else {
                throw new Error(data.message || 'Failed to determine location from IP-API.');
            }
        } catch (error) {
            console.error('Error fetching IP geolocation:', error);
            ipLocationText.textContent = 'Could not determine location via IP.';
            browserLocationStatusText.textContent = `IP Geolocation Error: ${error.message}`;
            findAndSetNearestCapital(null); // Fallback
        }
    }

    function fetchLocationViaBrowser() {
        browserLocationStatusText.textContent = 'Attempting to detect location via browser...';
        ipLocationText.textContent = '';
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lon = position.coords.longitude;
                    browserLocationStatusText.textContent = `Browser Location: Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`;
                    updateLocationAndWeather({ lat, lon, name: 'Your Precise Location', source: 'Browser' });
                },
                (error) => {
                    console.error('Error getting browser location:', error);
                    let message = 'Error detecting location via browser. ';
                    switch (error.code) {
                        case error.PERMISSION_DENIED: message += "You denied the request for Geolocation."; break;
                        case error.POSITION_UNAVAILABLE: message += "Location information is unavailable."; break;
                        case error.TIMEOUT: message += "The request to get user location timed out."; break;
                        case error.UNKNOWN_ERROR: message += "An unknown error occurred."; break;
                    }
                    browserLocationStatusText.textContent = message;
                    if (!nearestCapitalText.textContent || nearestCapitalText.textContent === '-') {
                        fetchLocationByIP();
                    }
                }
            );
        } else {
            browserLocationStatusText.textContent = "Geolocation is not supported by this browser.";
            if (!nearestCapitalText.textContent || nearestCapitalText.textContent === '-') {
                fetchLocationByIP();
            }
        }
    }

    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    }

    function deg2rad(deg) {
        return deg * (Math.PI / 180);
    }

    function findNearestCapital(coords) {
        if (!coords || typeof coords.lat !== 'number' || typeof coords.lon !== 'number') return null;
        let nearest = null;
        let minDistance = Infinity;
        iranianProvincialCapitals.forEach(capital => {
            const distance = getDistanceFromLatLonInKm(coords.lat, coords.lon, capital.lat, capital.lon);
            if (distance < minDistance) {
                minDistance = distance;
                nearest = capital;
            }
        });
        return nearest;
    }

    function populateCityDropdown(selectedCapitalName) {
        citySelect.innerHTML = '';
        const defaultOption = document.createElement('option');
        defaultOption.value = "";
        defaultOption.textContent = "Select a Provincial Capital";
        if (!selectedCapitalName) defaultOption.selected = true;
        citySelect.appendChild(defaultOption);
        iranianProvincialCapitals.forEach(capital => {
            const option = document.createElement('option');
            option.value = JSON.stringify({ lat: capital.lat, lon: capital.lon, name: capital.name });
            option.textContent = capital.name;
            if (capital.name === selectedCapitalName) option.selected = true;
            citySelect.appendChild(option);
        });
    }

    function updateLocationAndWeather(locationData) {
        const { lat, lon, name, source } = locationData;
        console.log(`Location updated from ${source}: ${name} (${lat}, ${lon})`);
        const nearest = findNearestCapital({ lat, lon });
        if (nearest) {
            nearestCapitalText.textContent = nearest.name;
            populateCityDropdown(nearest.name);
            weatherLocationDisplay.textContent = `Weather for ${nearest.name}`;
            fetchWeather(nearest.lat, nearest.lon, nearest.name);
        } else {
            nearestCapitalText.textContent = 'Could not determine.';
            populateCityDropdown();
            if (name && name !== 'Unknown City' && name !== 'Your Precise Location') {
                weatherLocationDisplay.textContent = `Weather for ${name}`;
                fetchWeather(lat, lon, name);
            } else {
                weatherLocationDisplay.textContent = "Selected Location";
                clearWeatherDisplay();
            }
        }
    }

    function findAndSetNearestCapital(coords) {
        const nearest = findNearestCapital(coords);
        if (nearest) {
            nearestCapitalText.textContent = nearest.name;
            populateCityDropdown(nearest.name);
            if (weatherLocationDisplay.textContent === '-') {
                weatherLocationDisplay.textContent = `Weather for ${nearest.name}`;
                fetchWeather(nearest.lat, nearest.lon, nearest.name);
            }
        } else {
            nearestCapitalText.textContent = 'N/A';
            populateCityDropdown();
            if (weatherLocationDisplay.textContent === '-') {
                weatherLocationDisplay.textContent = "No location";
                clearWeatherDisplay();
            }
        }
    }

    
    function getWeatherDescriptionAndIcon(wmoCode) {
        const descriptions = {
            0: { desc: "Clear sky", icon: "☀️" },
            1: { desc: "Mainly clear", icon: "🌤️" },
            2: { desc: "Partly cloudy", icon: "🌥️" },
            3: { desc: "Overcast", icon: "☁️" },
            45: { desc: "Fog", icon: "🌫️" },
            48: { desc: "Depositing rime fog", icon: "🌫️" },
            51: { desc: "Light drizzle", icon: "🌦️" },
            53: { desc: "Moderate drizzle", icon: "🌦️" },
            55: { desc: "Dense drizzle", icon: "🌦️" },
            56: { desc: "Light freezing drizzle", icon: "🌨️" },
            57: { desc: "Dense freezing drizzle", icon: "🌨️" },
            61: { desc: "Slight rain", icon: "🌧️" },
            63: { desc: "Moderate rain", icon: "🌧️" },
            65: { desc: "Heavy rain", icon: "🌧️" },
            66: { desc: "Light freezing rain", icon: "🌨️" },
            67: { desc: "Heavy freezing rain", icon: "🌨️" },
            71: { desc: "Slight snow fall", icon: "❄️" },
            73: { desc: "Moderate snow fall", icon: "❄️" },
            75: { desc: "Heavy snow fall", icon: "❄️" },
            77: { desc: "Snow grains", icon: "❄️" },
            80: { desc: "Slight rain showers", icon: "🌦️" },
            81: { desc: "Moderate rain showers", icon: "🌦️" },
            82: { desc: "Violent rain showers", icon: "⛈️" },
            85: { desc: "Slight snow showers", icon: "🌨️" },
            86: { desc: "Heavy snow showers", icon: "🌨️" },
            95: { desc: "Thunderstorm", icon: "⛈️" }, 
            96: { desc: "Thunderstorm with slight hail", icon: "⛈️" },
            99: { desc: "Thunderstorm with heavy hail", icon: "⛈️" },
        };
        return descriptions[wmoCode] || { desc: "Unknown", icon: "❓" };
    }


    async function fetchWeather(lat, lon, locationName) {
        clearWeatherDisplay();
        weatherLocationDisplay.textContent = `Weather for ${locationName}`;
        currentTempText.textContent = "Loading...";

        
        const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,precipitation_probability,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max&timezone=auto&forecast_days=8`; // 8 days to ensure we get full 7 days ahead

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`Weather API Error: ${response.status}`);
            const data = await response.json();
            console.log("Open-Meteo Weather data:", data);

            displayCurrentWeather(data.current, data.current_units);
            displaySevenDayForecast(data.daily);
            displayHourlyForecast(data.hourly);

        } catch (error) {
            console.error('Error fetching weather:', error);
            currentTempText.textContent = "Failed";
            currentConditionText.textContent = "Could not load weather data.";
            currentWindText.textContent = "";
            sevenDayContainer.innerHTML = `<p>Error loading 7-day forecast: ${error.message}</p>`;
            hourlyTodayContainer.innerHTML = `<p>Error loading hourly forecast: ${error.message}</p>`;
            hourlyTomorrowContainer.innerHTML = `<p>Error loading hourly forecast: ${error.message}</p>`;
        }
    }

    function displayCurrentWeather(currentData, units) {
        if (currentData) {
            const weather = getWeatherDescriptionAndIcon(currentData.weather_code);
            currentTempText.textContent = `${Math.round(currentData.temperature_2m)}${units.temperature_2m}`;
            currentConditionText.textContent = `${weather.icon} ${weather.desc}`;
            currentWindText.textContent = `Wind: ${currentData.wind_speed_10m} ${units.wind_speed_10m}`;
        } else {
            currentTempText.textContent = "N/A";
            currentConditionText.textContent = "No current data available.";
            currentWindText.textContent = "";
        }
    }

    function displaySevenDayForecast(dailyData) {
        sevenDayContainer.innerHTML = '';
        if (dailyData && dailyData.time && dailyData.time.length > 0) {
            const startIndex = new Date(dailyData.time[0]).setHours(0,0,0,0) === new Date().setHours(0,0,0,0) ? 0 : 0; // Start from today
            const daysToShow = 7;

            for (let i = startIndex; i < dailyData.time.length && i < startIndex + daysToShow; i++) {
                const date = new Date(dailyData.time[i]);
                const weather = getWeatherDescriptionAndIcon(dailyData.weather_code[i]);
                const card = document.createElement('div');
                card.className = 'forecast-card';
                card.innerHTML = `
                    <h5>${date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</h5>
                    <p class="weather-icon">${weather.icon}</p>
                    <p>Max: ${Math.round(dailyData.temperature_2m_max[i])}°</p>
                    <p>Min: ${Math.round(dailyData.temperature_2m_min[i])}°</p>
                    <p>${weather.desc}</p>
                    <p>Wind: ${Math.round(dailyData.wind_speed_10m_max[i])} km/h</p>
                `;
                sevenDayContainer.appendChild(card);
            }
        } else {
            sevenDayContainer.innerHTML = "<p>7-day forecast data not available.</p>";
        }
    }

    function displayHourlyForecast(hourlyData) {
        hourlyTodayContainer.innerHTML = '';
        hourlyTomorrowContainer.innerHTML = '';

        if (hourlyData && hourlyData.time && hourlyData.time.length > 0) {
            const now = new Date();
            const todayStr = now.toISOString().split('T')[0];
            const tomorrow = new Date(now);
            tomorrow.setDate(now.getDate() + 1);
            const tomorrowStr = tomorrow.toISOString().split('T')[0];

            let todayCount = 0;
            let tomorrowCount = 0;

            for (let i = 0; i < hourlyData.time.length; i++) {
                const itemDate = new Date(hourlyData.time[i]);
                const itemDateStr = itemDate.toISOString().split('T')[0];
                const time = itemDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
                const weather = getWeatherDescriptionAndIcon(hourlyData.weather_code[i]);

                if (itemDateStr === todayStr && itemDate < now && now.getHours() > itemDate.getHours()) {
                    continue;
                }


                const card = document.createElement('div');
                card.className = 'forecast-card hourly-card';
                card.innerHTML = `
                    <h5>${time}</h5>
                    <p class="weather-icon">${weather.icon}</p>
                    <p>${Math.round(hourlyData.temperature_2m[i])}°</p>
                    <p>${weather.desc}</p>
                    <p>Wind: ${Math.round(hourlyData.wind_speed_10m[i])} km/h</p>
                `;

                if (itemDateStr === todayStr) {
                    hourlyTodayContainer.appendChild(card);
                    todayCount++;
                } else if (itemDateStr === tomorrowStr) {
                    hourlyTomorrowContainer.appendChild(card);
                    tomorrowCount++;
                }
            }

            if (todayCount === 0) hourlyTodayContainer.innerHTML = "<p>Hourly forecast for today not available or past.</p>";
            if (tomorrowCount === 0) hourlyTomorrowContainer.innerHTML = "<p>Hourly forecast for tomorrow not available.</p>";

        } else {
            hourlyTodayContainer.innerHTML = "<p>Hourly forecast data not available.</p>";
            hourlyTomorrowContainer.innerHTML = "<p>Hourly forecast data not available.</p>";
        }
    }

    function clearWeatherDisplay() {
        currentTempText.textContent = '-';
        currentConditionText.textContent = '-';
        currentWindText.textContent = '-';
        sevenDayContainer.innerHTML = '<p>Loading 7-day forecast...</p>';
        hourlyTodayContainer.innerHTML = "<p>Loading today's hourly forecast...</p>";
        hourlyTomorrowContainer.innerHTML = "<p>Loading tomorrow's hourly forecast...</p>";
    }

    detectLocationBtn.addEventListener('click', fetchLocationViaBrowser);
    citySelect.addEventListener('change', (event) => {
        const selectedValue = event.target.value;
        if (selectedValue) {
            try {
                const cityData = JSON.parse(selectedValue);
                browserLocationStatusText.textContent = '';
                ipLocationText.textContent = '';
                nearestCapitalText.textContent = cityData.name;
                updateLocationAndWeather({ lat: cityData.lat, lon: cityData.lon, name: cityData.name, source: 'Dropdown' });
            } catch (e) {
                console.error("Error parsing city data from dropdown", e);
                weatherLocationDisplay.textContent = "Error selecting city";
                clearWeatherDisplay();
            }
        } else {
            weatherLocationDisplay.textContent = "Select a location";
            clearWeatherDisplay();
        }
    });

    // --- Initialization ---
    function initializePage() {
        clearWeatherDisplay();
        populateCityDropdown();
        fetchLocationByIP();
    }

    initializePage();
});