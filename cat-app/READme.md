# Mini API Dashboard

The **Mini API Dashboard** is a lightweight, interactive web app that combines multiple useful mini-apps in a single interface. It’s designed to be practical, fun, and user-friendly.

---

## Demo

Try it live here: [Mini API Dashboard on Vercel](https://cat-api-gamma.vercel.app/)  
View the code on GitHub: [cat-api repository](https://github.com/chuks2274/cat-api.git)

---

## Key Features

1. **Random Dog Images 🐶**
   - Fun for dog lovers and provides quick entertainment.

2. **Random Cat Images 🐱**
   - Endless amusement for cat enthusiasts.

3. **Weather Information 🌤️**
   - Enter a city name to get current weather details.
   - Provides temperature, wind speed, wind direction, and local time.
   - Uses OpenStreetMap and Open-Meteo APIs.

4. **Currency Converter 💱**
   - Convert amounts between different currencies.
   - Fetches live exchange rates and validates input.
   - Useful for travelers and online shopping.

5. **Theme Toggle**
   - Switch between **Light**, **Dark**, and **Blue** themes.
   - Enhances user experience and reduces eye strain.

---

## Benefits to Users

- **All-in-One Dashboard:** Access multiple useful tools in a single page, no installations required.  
- **Quick Entertainment:** Get instant doses of dog and cat images for fun or stress relief.  
- **Practical Utility:** Check weather and convert currencies on the fly.  
- **User-Friendly Interface:** Clean, minimal design with intuitive inputs and outputs.  
- **Responsive & Accessible:** Works smoothly on desktops, tablets, and mobile devices.  
- **Customizable Experience:** Theme toggle allows personalization and reduces eye strain.  
- **Reliable & Real-Time:** Fetches live data from APIs, ensuring up-to-date information.  

---

## Technologies Used

- **HTML5 & CSS3** – structure and styling  
- **JavaScript (ES6+)** – interactive functionality  
- **Fetch API** – asynchronous API requests  
- **Bootstrap 5.3** – responsive layout  
- **Google Fonts (Roboto)** – typography  
- **Jest & jsdom** – testing environment for functionality  

---

## CI/CD Deployment

- The project is automatically **tested and deployed to Vercel** using GitHub Actions.
- Every push to the `main` branch triggers:
  - JavaScript linting (ESLint)
  - Deployment to Vercel with configured secrets (`VERCEL_TOKEN`, `VERCEL_PROJECT_ID`, `VERCEL_ORG_ID`)

---

## How It Works

- **Theme Toggle:** Tracks the current theme index and updates the `<body>` `data-theme` attribute. Button text reflects the current theme.  
- **Dog & Cat Images:** Fetches images asynchronously and updates the respective containers. Shows loading messages and handles errors.  
- **Weather Info:** Retrieves coordinates from OpenStreetMap, fetches weather data from Open-Meteo, formats, and displays it.  
- **Currency Conversion:** Validates inputs, fetches exchange rates, calculates conversion, and displays results. Handles errors gracefully.

---

## Usage

1. Clone the repository:
   ```bash
   git clone https://github.com/chuks2274/cat-api.git
   cd cat-api
