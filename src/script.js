// Function to describe the combined weather and air quality conditions
function describeWeatherConditions(temp, humidity, aqi) {
    let description = '';

    // Start with AQI, since air quality could be critical
    if (aqi <= 50) {
        description += `The air quality is good with an AQI of ${aqi}. `;
    } else if (aqi <= 100) {
        description += `The air quality is moderate with an AQI of ${aqi}, so it's generally okay to go outside. `;
    } else if (aqi <= 150) {
        description += `The air quality is slightly unhealthy with an AQI of ${aqi}. Sensitive people should be cautious. `;
    } else if (aqi <= 200) {
        description += `The air quality is unhealthy with an AQI of ${aqi}. It's recommended to limit outdoor activity. `;
    } else if (aqi <= 300) {
        description += `The air quality is very unhealthy with an AQI of ${aqi}. It's best to stay indoors if possible. `;
    } else {
        description += `The air quality is hazardous with an AQI of ${aqi}. Stay indoors and avoid outdoor activities. `;
    }

    // Now combine with temperature and humidity for a fuller picture
    if (temp > 35 && humidity > 70) {
        description += `It's extremely hot at ${temp}°C with high humidity (${humidity}%), making it feel even more uncomfortable. Avoid outdoor activities in these conditions.`;
    } else if (temp > 35 && humidity < 30) {
        description += `It's scorching hot at ${temp}°C and the air is very dry (${humidity}% humidity). Be cautious outdoors and stay hydrated.`;
    } else if (temp > 30 && humidity > 60) {
        description += `The temperature is ${temp}°C with high humidity (${humidity}%), making it feel hotter than it is. Take breaks and stay hydrated if you need to be outside.`;
    } else if (temp < 15 && humidity > 80) {
        description += `It's quite chilly at ${temp}°C with high humidity (${humidity}%), which could make it feel colder. Dress warmly if heading out.`;
    } else if (temp >= 15 && temp <= 25 && humidity >= 40 && humidity <= 60) {
        description += `The temperature is a comfortable ${temp}°C with pleasant humidity levels at ${humidity}%. Great weather for outdoor activities!`;
    } else if (temp <= 10) {
        description += `It's cold at ${temp}°C. If you're going outside, make sure to wear warm clothes.`;
    } else {
        description += `The temperature is ${temp}°C with a humidity of ${humidity}%, which is fairly comfortable for outdoor activities.`;
    }

    return description;
}

const getWeather = async (city) => {
    document.getElementById('cityName').innerHTML = city;

    // Weather API
    const weatherUrl = `https://weatherapi-com.p.rapidapi.com/current.json?q=${city}&aqi=yes`; // Dynamic city in URL
    const weatherOptions = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': 'feccd00f1amshd7c4f37401da8fap1525f5jsn13d3c6661de4', // Replace with your actual API key
            'x-rapidapi-host': 'weatherapi-com.p.rapidapi.com'
        }
    };

    try {
        // Fetch Weather Data
        const weatherResponse = await fetch(weatherUrl, weatherOptions);

        // If the response is not OK, throw an error
        if (!weatherResponse.ok) {
            throw new Error(`HTTP error! Status: ${weatherResponse.status}`);
        }

        const weatherResult = await weatherResponse.json(); // Parse JSON response

        if (weatherResult.error) {
            alert(`Error: ${weatherResult.error.message}`);
            return;
        }

        const currentWeather = weatherResult.current;

        // Display weather information
        document.getElementById('humidity').innerHTML = currentWeather.humidity;
        document.getElementById('temp').innerHTML = currentWeather.temp_c;
        document.getElementById('temp_max').innerHTML = currentWeather.temp_c;
        document.getElementById('temp_min').innerHTML = currentWeather.temp_c;

        let aqiIndex = 0;
        // Fetch AQI from weather API
        if (currentWeather.air_quality) {
            const aqi = currentWeather.air_quality;
            aqiIndex = aqi.us_epa_index || aqi.pm2_5 || 0; // Try to use pm2_5 as a fallback

            document.getElementById('co').innerHTML = `${aqi.co || 'N/A'} ppb`;
            document.getElementById('no2').innerHTML = `${aqi.no2 || 'N/A'} µg/m³`;
            document.getElementById('o3').innerHTML = `${aqi.o3 || 'N/A'} µg/m³`;
            document.getElementById('so2').innerHTML = `${aqi.so2 || 'N/A'} µg/m³`;
            document.getElementById('pm2_5').innerHTML = `${aqi.pm2_5 || 'N/A'} µg/m³`;
            document.getElementById('pm10').innerHTML = `${aqi.pm10 || 'N/A'} µg/m³`;
            document.getElementById('aqi').innerHTML = getAQILabel(aqiIndex);
        } else {
            document.getElementById('aqi').innerHTML = 'AQI data not available';
            aqiIndex = 0;
        }

        // Describe the weather conditions
        const description = describeWeatherConditions(currentWeather.temp_c, currentWeather.humidity, aqiIndex);
        document.getElementById('goOutsideRecommendation').innerHTML = description;

    } catch (error) {
        alert('Error fetching data. Please try again later.');
    }
};

// Function to get AQI label based on AQI value
function getAQILabel(aqiValue) {
    if (aqiValue <= 50) return "Good";
    if (aqiValue <= 100) return "Moderate";
    if (aqiValue <= 150) return "Unhealthy for Sensitive Groups";
    if (aqiValue <= 200) return "Unhealthy";
    if (aqiValue <= 300) return "Very Unhealthy";
    return "Hazardous";
}

// Search button click event
document.getElementById('submit').onclick = function () {
    const cityInput = document.getElementById('city').value;
    if (cityInput) {
        getWeather(cityInput);
    } else {
        alert('Please enter a city name.');
    }
};

// Get location button click event
document.getElementById('getLocation').onclick = function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            const locationUrl = `https://weatherapi-com.p.rapidapi.com/current.json?q=${latitude},${longitude}&aqi=yes`;

            const locationOptions = {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': 'feccd00f1amshd7c4f37401da8fap1525f5jsn13d3c6661de4', // Replace with your actual API key
                    'x-rapidapi-host': 'weatherapi-com.p.rapidapi.com'
                }
            };

            try {
                const locationResponse = await fetch(locationUrl, locationOptions);
                if (!locationResponse.ok) {
                    throw new Error(`HTTP error! Status: ${locationResponse.status}`);
                }
                const locationResult = await locationResponse.json();
                getWeather(locationResult.location.name); // Call getWeather with the city name
            } catch (error) {
                alert('Error fetching location data.');
            }
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
};
