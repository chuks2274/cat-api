// =========================
// THEME TOGGLE FUNCTIONALITY
// =========================

// Select the theme toggle button by its ID
const themeBtn = document.getElementById('theme-toggle');

// Define the available themes to cycle through
const themes = ['light', 'dark', 'blue'];

// Keep track of the current theme index
let currentTheme = 0;

// -------------------------
// Initialize page with the first theme
// -------------------------
document.body.setAttribute('data-theme', themes[currentTheme]); // set the initial theme on <body>
themeBtn.textContent = themes[currentTheme].charAt(0).toUpperCase() + themes[currentTheme].slice(1); // set button text to match theme (capitalize first letter)

// -------------------------
// Click event: cycle through themes
// -------------------------
themeBtn.addEventListener('click', () => {
  // Move to the next theme, loop back to first after last
  currentTheme = (currentTheme + 1) % themes.length;
  const theme = themes[currentTheme];

  // Apply the new theme to <body>
  document.body.setAttribute('data-theme', theme);

  // Update the button text to reflect the current theme
  themeBtn.textContent = theme.charAt(0).toUpperCase() + theme.slice(1);
});



// =========================
// DOG IMAGE FETCH FUNCTION
// =========================
async function fetchDog() {
  const output = document.getElementById('dog-output'); // select output container
  output.innerHTML = '<small>Loading...</small>'; // show loading message

  try {
    // Fetch a random dog image from the API
    const res = await fetch('https://dog.ceo/api/breeds/image/random');
    const data = await res.json();

    // Display the image
    output.innerHTML = `<img src="${data.message}" alt="Dog">`;
  } catch (err) {
    // Handle errors gracefully
    output.innerHTML = '<small>Failed to load dog image.</small>';
    console.error(err);
  }
}



// =========================
// CAT IMAGE FETCH FUNCTION
// =========================
async function fetchCat() {
  const output = document.getElementById('cat-output'); // select output container
  output.innerHTML = '<small>Loading...</small>'; // show loading message

  try {
    // Fetch a random cat image from the API
    const res = await fetch('https://api.thecatapi.com/v1/images/search');
    const data = await res.json();

    // Display the first image in the response
    output.innerHTML = `<img src="${data[0].url}" alt="Cat">`;
  } catch (err) {
    // Handle errors gracefully
    output.innerHTML = '<small>Failed to load cat image.</small>';
    console.error(err);
  }
}



// =========================
// WEATHER FETCH FUNCTION
// =========================
async function fetchWeather() {
  const city = document.getElementById("city-input").value.trim(); // get user input
  const output = document.getElementById("weather-output"); // select output container
  output.innerHTML = "Loading..."; // show loading message

  try {
    // Fetch city coordinates using OpenStreetMap Nominatim API
    const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${city}`);
    const geoData = await geoRes.json();

    if (!geoData.length) {
      output.innerHTML = "City not found!"; // handle invalid city
      return;
    }

    const { lat, lon } = geoData[0]; // extract latitude and longitude

    // Fetch current weather using Open-Meteo API
    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`);
    const weatherData = await weatherRes.json();
    const current = weatherData.current_weather;

    // Format the time nicely: YYYY-MM-DD HH:MM
    const date = new Date(current.time);
    const formattedTime = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')} ${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`;

    // Display weather info neatly
    output.innerHTML = `
      <strong>City:</strong> ${city}<br>
      <strong>Temperature:</strong> ${current.temperature}°C<br>
      <strong>Wind Speed:</strong> ${current.windspeed} km/h<br>
      <strong>Wind Direction:</strong> ${current.winddirection}°<br>
      <strong>Time:</strong> ${formattedTime}
    `;
  } catch (err) {
    // Handle fetch errors
    output.innerHTML = "Error fetching weather.";
    console.error(err);
  }
}



// =========================
// CURRENCY CONVERSION FUNCTION
// =========================
async function fetchCurrency() {
  const output = document.getElementById('currency-output'); // select output container
  const from = document.getElementById('from-currency').value; // get source currency
  const to = document.getElementById('to-currency').value;     // get target currency
  const amountInput = document.getElementById('amount').value.trim(); // get amount

  // -------------------------
  // Input validation
  // -------------------------
  if (!from || !to) { 
    output.innerHTML = 'Select both currencies.'; 
    return; 
  }
  if (from === to) { 
    output.innerHTML = 'Select different currencies.'; 
    return; 
  }
  if (!amountInput || isNaN(amountInput) || Number(amountInput) <= 0) {
    output.innerHTML = 'Enter a valid amount.';
    return;
  }

  const amount = Number(amountInput);
  output.innerHTML = 'Loading...'; // show loading message

  try {
    // Fetch exchange rates for the 'from' currency
    const res = await fetch(`https://open.er-api.com/v6/latest/${from}`);
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();

    if (data.result === "error" || !data.rates[to]) {
      output.innerHTML = 'Invalid currency.'; // handle invalid currency code
      return;
    }

    const rate = data.rates[to];                    // get exchange rate
    const converted = (rate * amount).toFixed(6);   // calculate converted amount
    output.innerHTML = `${amount} ${from} = ${converted} ${to} <br><small>(Rate: 1 ${from} = ${rate} ${to})</small>`; // display result
  } catch (err) {
    // Handle fetch errors
    output.innerHTML = 'Error fetching rate.';
    console.error(err);
  }
}
