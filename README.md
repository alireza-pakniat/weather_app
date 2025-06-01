# Weather Forecast Page

[![Project Status: Initial Version](https://img.shields.io/badge/status-initial%20version-green)](https://shields.io/)
[![Languages: HTML/CSS/JS](https://img.shields.io/badge/languages-HTML%2FCSS%2FJS-blue)](https://shields.io/)
[![Version: v1.0.0](https://img.shields.io/badge/version-v1.0.0-lightgrey)](https://shields.io/)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](https://opensource.org/licenses/MIT)
This project is a simple web page designed to display weather forecasts. The main goal of this exercise was to learn how to use various APIs in web pages and to practice responsive web design. This initial version focuses on displaying weather based on the user's location, with an emphasis on the provincial capitals of Iran.

## 🚀 Key Features (Initial Version)

* **Automatic IP-Based Location Detection**: Upon page load, an attempt is made to estimate the user's location based on their IP address.
* **Browser-Based Location Detection**: A button allows users to utilize their browser's Geolocation API for more precise location detection (requires user permission).
* **Permission Error Handling**: If the user denies permission for browser-based geolocation, an appropriate message is displayed.
* **Nearest Iranian Provincial Capital Identification**: After estimating the user's location, the nearest provincial capital of Iran is identified and displayed as the default initial location (related to IP or browser location).
* **Weather Display for Detected Location**: Weather is displayed for the detected location (or the nearest Iranian provincial capital to it).
* **Manual Selection List of Iranian Provincial Capitals**: A dropdown list containing the names of Iranian provincial capitals is provided for the user to manually select their desired location.
    * The default city in this list is the nearest provincial capital identified based on the user's location.
* **7-Day Weather Forecast**: Displays a summary of the weather conditions for the next 7 days.
* **Hourly Weather Forecast**: For today and tomorrow, an hourly weather forecast is displayed.
* **Weather Details**: Information displayed includes temperature, atmospheric conditions (e.g., rain, cloudiness), and wind speed.
* **Responsive Design**: The page is designed to adapt to different screen sizes (desktop, mobile), with the layout of information changing accordingly.

## 🛠️ APIs Used (Suggested)

For this project to function correctly, you'll need to use two types of free, public APIs, which you can find on websites like [Public APIs](https://publicapis.dev/):

1.  **IP Geolocation API**: For the initial estimation of the user's location.
    * *Note: You will need to place the URL and, if required, the API key for your chosen service in the `script.js` file.*
2.  **Weather Forecast API**: To retrieve 7-day and hourly weather information. This API should be capable of accepting geographical coordinates (latitude and longitude).
    * *Note: You will need to place the URL and, if required, the API key for your chosen service in the `script.js` file.*

## ⚙️ Setup and Installation

1.  Clone this repository:
    ```bash
    git clone [URL-Your-Repository]
    ```
2.  Navigate to the project directory:
    ```bash
    cd [Directory-Name]
    ```
3.  Open the `index.html` file in your web browser.
4.  **Important**: In the `script.js` file, replace the placeholder variables for `IP_GEOLOCATION_API_URL` and `WEATHER_API_URL_TEMPLATE` (or its equivalent based on your chosen API) with your valid API URLs and keys for the application to work correctly.

## 💻 How to Use

* **Initial Load**: When the page opens, the application will attempt to detect your location via IP and display the weather for the nearest Iranian provincial capital.
* **"Detect My Location (Browser)" Button**: Clicking this button and granting permission will allow the browser to detect your more precise location, and the related weather (for the nearest Iranian provincial capital) will be updated.
* **"Or Select an Iranian Provincial Capital" Dropdown**: You can manually select one of the Iranian provincial capitals from this list to display the weather for that region.

## 💡 Technologies Used

* HTML5
* CSS3
* JavaScript (Vanilla JS)

## 📂 Project Structure
