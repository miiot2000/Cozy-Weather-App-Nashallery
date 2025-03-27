document.addEventListener("DOMContentLoaded", function() {
    const textBoxElement = document.getElementById('text-box'); 
    const temperatureElement = document.getElementById('temperature'); 
    const bodyElement = document.body; // Get the body element for the background



    // Check if the text box element is found
    if (!textBoxElement) {
        console.error("Text box element not found in HTML");
        return;
    }

    /**
     * Fetches weather data from Open-Meteo API and updates the UI.
     * @param {number} latitude - Latitude of the location.
     * @param {number} longitude - Longitude of the location.
     */
    async function fetchWeatherData(latitude, longitude) {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

        try {
            // Assuming fetchWeather is an electron function fetching weather data
            const weather = await window.electron.fetchWeather(url);

            if (!weather) {
                console.error("No weather data returned.");
                textBoxElement.innerText = "Failed to fetch weather data"; // Show error in text box
                return;
            }

            const weatherCondition = mapWeatherCondition(weather.current_weather.weathercode);
            const temperature = weather.current_weather.temperature; 

            setBackground(); // Call the function to set the background after fetching the weather data


            textBoxElement.innerText = `Weather Condition: ${weatherCondition}`;
            temperatureElement.innerText = `${temperature}`;

        } catch (error) {
            console.error('Error fetching weather data', error);
            textBoxElement.innerText = "Error fetching weather data"; // Show error in text box
            temperatureElement.innerText = "";
        }
    }

    // Example coordinates for Calgary, Alberta
    fetchWeatherData(51.0447, -114.0719);
    
    // Function to set the background based on the time of day
    function setBackground() {
        const currentHour = new Date().getHours();
        
        if (currentHour >= 6 && currentHour < 18) { // Daytime (6 AM to 6 PM)
          bodyElement.style.backgroundImage = "url('dayBG.png')";
        } else { // Nighttime (6 PM to 6 AM)
          bodyElement.style.backgroundImage = "url('nightBG.png')";
        }
  
        bodyElement.style.backgroundSize = "cover"; // Make sure the background covers the whole screen
        bodyElement.style.backgroundPosition = "center"; // Center the background
      }

    /**
     * Maps a weather condition code to a human-readable description.
     * @param {number} code - Weather condition code from API.
     * @returns {string} - Weather condition description.
     */
    function mapWeatherCondition(code) {
        const weatherConditions = {
            0: "Clear sky",
            1: "Mainly clear",
            2: "Partly cloudy",
            3: "Overcast",
            45: "Fog",
            48: "Depositing rime fog",
            51: "Light drizzle",
            53: "Moderate drizzle",
            55: "Heavy drizzle",
        };
        return weatherConditions[code] || "Unknown condition";
    }
});
