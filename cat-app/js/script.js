
const themeBtn = document.getElementById('theme-toggle');
const themes = ['light', 'dark', 'blue']; // cycle through themes
let currentTheme = 0;

// Initialize
document.body.setAttribute('data-theme', themes[currentTheme]);
themeBtn.textContent = themes[currentTheme].charAt(0).toUpperCase() + themes[currentTheme].slice(1);

themeBtn.addEventListener('click', () => {
  currentTheme = (currentTheme + 1) % themes.length;
  const theme = themes[currentTheme];
  document.body.setAttribute('data-theme', theme);

  // Update button text
  themeBtn.textContent = theme.charAt(0).toUpperCase() + theme.slice(1);
});


// Fetch Dog
async function fetchDog() {
  const output = document.getElementById('dog-output');
  output.innerHTML = '<small>Loading...</small>';
  try {
    const res = await fetch('https://dog.ceo/api/breeds/image/random');
    const data = await res.json();
    output.innerHTML = `<img src="${data.message}" alt="Dog">`;
  } catch (err) {
    output.innerHTML = '<small>Failed to load dog image.</small>';
    console.error(err);
  }
}

// Fetch Cat
async function fetchCat() {
  const output = document.getElementById('cat-output');
  output.innerHTML = '<small>Loading...</small>';
  try {
    const res = await fetch('https://api.thecatapi.com/v1/images/search');
    const data = await res.json();
    output.innerHTML = `<img src="${data[0].url}" alt="Cat">`;
  } catch (err) {
    output.innerHTML = '<small>Failed to load cat image.</small>';
    console.error(err);
  }
}

// Fetch Weather
async function fetchWeather() {
  const city = document.getElementById("city-input").value.trim();
  const output = document.getElementById("weather-output");
  output.innerHTML = "Loading...";

  try {
    // Get city coordinates
    const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${city}`);
    const geoData = await geoRes.json();
    if (!geoData.length) {
      output.innerHTML = "City not found!";
      return;
    }
    const { lat, lon } = geoData[0];

    // Fetch weather with correct timezone
    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`);
    const weatherData = await weatherRes.json();
    const current = weatherData.current_weather;

    // Format the time to YYYY-MM-DD HH:MM
    const date = new Date(current.time);
    const formattedTime = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')} ${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`;

    // Display neatly
    output.innerHTML = `
      <strong>City:</strong> ${city}<br>
      <strong>Temperature:</strong> ${current.temperature}°C<br>
      <strong>Wind Speed:</strong> ${current.windspeed} km/h<br>
      <strong>Wind Direction:</strong> ${current.winddirection}°<br>
      <strong>Time:</strong> ${formattedTime}
    `;
  } catch (err) {
    output.innerHTML = "Error fetching weather.";
    console.error(err);
  }
}

// Fetch Currency with full rate info
async function fetchCurrency() {
  const output = document.getElementById('currency-output');
  const from = document.getElementById('from-currency').value;
  const to = document.getElementById('to-currency').value;
  const amountInput = document.getElementById('amount').value.trim();

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
  output.innerHTML = 'Loading...';

  try {
    const res = await fetch(`https://open.er-api.com/v6/latest/${from}`);
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();
    if (data.result === "error" || !data.rates[to]) {
      output.innerHTML = 'Invalid currency.';
      return;
    }
    const rate = data.rates[to];
    const converted = (rate * amount).toFixed(6); // show 6 decimal places
    output.innerHTML = `${amount} ${from} = ${converted} ${to} <br><small>(Rate: 1 ${from} = ${rate} ${to})</small>`;
  } catch (err) {
    output.innerHTML = 'Error fetching rate.';
    console.error(err);
  }
}
