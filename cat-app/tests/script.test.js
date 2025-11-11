// tests/script.test.js

// Polyfills for Node + jsdom
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;

const { JSDOM } = require('jsdom');
require('jest-fetch-mock').enableMocks();

describe('DOM-based App Tests', () => {
  let dom;
  let document;
  let window;

  beforeEach(() => {
    // Set up a clean DOM
    dom = new JSDOM(`
      <html>
        <body>
          <button id="theme-toggle"></button>
          <img id="dog-img" />
          <img id="cat-img" />
          <div id="weather-output"></div>
          <div id="currency-output"></div>
        </body>
      </html>
    `, { runScripts: "outside-only" });

    window = dom.window;
    document = window.document;

    // Theme toggle logic
    const themes = ['light', 'dark', 'solarized'];
    let currentTheme = 0;

    const themeBtn = document.getElementById('theme-toggle');
    document.body.setAttribute('data-theme', themes[currentTheme]);
    themeBtn.textContent = themes[currentTheme].charAt(0).toUpperCase() + themes[currentTheme].slice(1);

    themeBtn.addEventListener('click', () => {
      currentTheme = (currentTheme + 1) % themes.length;
      document.body.setAttribute('data-theme', themes[currentTheme]);
      themeBtn.textContent = themes[currentTheme].charAt(0).toUpperCase() + themes[currentTheme].slice(1);
    });

    window.themes = themes;
    window.currentTheme = currentTheme;
    window.themeBtn = themeBtn;

    // Dog fetch function
    window.fetchDog = async () => {
      try {
        const res = await fetch('https://dog.ceo/api/breeds/image/random');
        const data = await res.json();
        document.getElementById('dog-img').src = data.message;
      } catch (err) {
        document.getElementById('dog-img').alt = 'Error fetching dog image';
      }
    };

    // Cat fetch function
    window.fetchCat = async () => {
      try {
        const res = await fetch('https://api.thecatapi.com/v1/images/search');
        const data = await res.json();
        document.getElementById('cat-img').src = data[0].url;
      } catch (err) {
        document.getElementById('cat-img').alt = 'Error fetching cat image';
      }
    };

    // Weather fetch function
    window.fetchWeather = async () => {
      try {
        const res = await fetch('https://api.weather.test/mock');
        const data = await res.json();
        document.getElementById('weather-output').innerHTML = `
          <strong>City:</strong> ${data.city}<br>
          <strong>Temperature:</strong> ${data.temperature}°C<br>
          <strong>Wind Speed:</strong> ${data.windSpeed} km/h<br>
          <strong>Wind Direction:</strong> ${data.windDirection}°<br>
          <strong>Time:</strong> ${data.time}
        `;
      } catch (err) {
        document.getElementById('weather-output').textContent = 'Error fetching weather';
      }
    };

    // Currency fetch function
    window.fetchCurrency = async () => {
      try {
        const res = await fetch('https://api.currency.test/mock');
        const data = await res.json();
        document.getElementById('currency-output').textContent = `${data.amount} ${data.from} = ${data.converted} ${data.to}`;
      } catch (err) {
        document.getElementById('currency-output').textContent = 'Error fetching currency';
      }
    };
  });

  afterEach(() => {
    dom.window.close();
    fetch.resetMocks();
  });

  // Theme toggle tests
  test('Theme Toggle: should initialize with first theme', () => {
    const themeBtn = document.getElementById('theme-toggle');
    expect(document.body.getAttribute('data-theme')).toBe('light');
    expect(themeBtn.textContent).toBe('Light');
  });

  test('Theme Toggle: should cycle through themes on click', () => {
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.click();
    expect(document.body.getAttribute('data-theme')).toBe('dark');
    expect(themeBtn.textContent).toBe('Dark');
    themeBtn.click();
    expect(document.body.getAttribute('data-theme')).toBe('solarized');
    expect(themeBtn.textContent).toBe('Solarized');
  });

  // Dog tests
  test('Fetch Dog: should display dog image', async () => {
    fetch.mockResponseOnce(JSON.stringify({ message: 'dog.jpg' }));
    await window.fetchDog();
    expect(document.getElementById('dog-img').src).toContain('dog.jpg');
  });

  test('Fetch Dog: should handle dog fetch error', async () => {
    fetch.mockRejectOnce(new Error('fail'));
    await window.fetchDog();
    expect(document.getElementById('dog-img').alt).toBe('Error fetching dog image');
  });

  // Cat tests
  test('Fetch Cat: should display cat image', async () => {
    fetch.mockResponseOnce(JSON.stringify([{ url: 'cat.jpg' }]));
    await window.fetchCat();
    expect(document.getElementById('cat-img').src).toContain('cat.jpg');
  });

  test('Fetch Cat: should handle cat fetch error', async () => {
    fetch.mockRejectOnce(new Error('fail'));
    await window.fetchCat();
    expect(document.getElementById('cat-img').alt).toBe('Error fetching cat image');
  });

  // Weather tests
  test('Fetch Weather: should display weather info', async () => {
    fetch.mockResponseOnce(JSON.stringify({
      city: 'TestCity',
      temperature: 20,
      windSpeed: 5,
      windDirection: 90,
      time: '2025-11-09 12:00'
    }));
    await window.fetchWeather();
    const html = document.getElementById('weather-output').innerHTML;
    expect(html).toContain('TestCity');
    expect(html).toContain('20°C');
    expect(html).toContain('5 km/h');
    expect(html).toContain('90°');
    expect(html).toContain('2025-11-09 12:00');
  });

  // Currency tests
  test('Fetch Currency: should display converted currency', async () => {
    fetch.mockResponseOnce(JSON.stringify({
      amount: 10,
      from: 'USD',
      converted: 8.5,
      to: 'EUR'
    }));
    await window.fetchCurrency();
    expect(document.getElementById('currency-output').textContent).toBe('10 USD = 8.5 EUR');
  });

  test('Fetch Currency: should handle fetch error', async () => {
    fetch.mockRejectOnce(new Error('fail'));
    await window.fetchCurrency();
    expect(document.getElementById('currency-output').textContent).toBe('Error fetching currency');
  });
});
