import "../node_modules/weather-icons/css/weather-icons.min.css";
import '../node_modules/font-awesome/css/font-awesome.min.css';
import './custom.scss';

import jQuery from "jquery";
window.$ = window.jQuery = jQuery;  // make jQuery globally available

var currentUnitIsFahrenheit = false;
var temperatureInFahrenheit;
var temperatureInCelcius;

// main entry point

$(() => {
    
    // setup click handler for temperature conversion
    $("#temperature-container").click(() => {
        if (currentUnitIsFahrenheit)
            updateTemperature(true);
        else
            updateTemperature(false);
    });


    // get data and display it
    getUserLocationByIP().then(function(data) {
        updateLocation(data.city, data.country);
        getWeather(new OpenWeatherMapUrl(data.city).combined).done(function(weather) {
            temperatureInFahrenheit = Math.round(convertCelciusToFahrenheit(weather.main.temp));
            temperatureInCelcius = weather.main.temp;
            updateTemperature(false);
            loadIconMappings().done(function(mapping) {
                var iconName = getIconName(weather, mapping);
                updateWeatherIcon(iconName);
            })
        });
    });
});




function loadIconMappings() {
    return $.getJSON("icons.json", function(json) {} );
}


function getUserLocationByIP() {
    return $.get("http://ipinfo.io", function() {}, "jsonp");
}

function OpenWeatherMapUrl(city) {
    this.base = "http://api.openweathermap.org/data/2.5/weather?q=";
    this.units = "&units=metric";
    this.appid = "&APPID=061f24cf3cde2f60644a8240302983f2";
    this.combined = this.base + city + this.units + this.appid;
}

function getWeather(url) {
    return $.get(url, function(response) { }, "jsonp");
}

function updateWeatherIcon(icon) {
    $("#weather-icon").removeClass().addClass(icon);
}

function getIconName(weather, mapping) {  // credits to https://gist.github.com/tbranyen/62d974681dea8ee0caa1#file-icons-json for the provided mapping
    var prefix = 'wi wi-';
    var code = weather.weather[0].id;
    var icon = mapping[code].icon;

    // If we are not in the ranges mentioned above, add a day/night prefix.
    if (!(code > 699 && code < 800) && !(code > 899 && code < 1000)) {
        icon = 'day-' + icon;
    }

    // Finally tack on the prefix.
    return prefix + icon;
}

function updateLocation(city, country) {
    $("#location").text(city + ", " + country);
}

function updateTemperature(useFahrenheit) {
    let temperature;
    let unit;
    if (useFahrenheit) {
        temperature = temperatureInFahrenheit;
        unit = "°F";
    }
    else {
        temperature = temperatureInCelcius;
        unit = "°C";
    }

    $("#temperature").text(temperature);
    $("#unit").text(unit);

    currentUnitIsFahrenheit = !currentUnitIsFahrenheit;
}

function convertCelciusToFahrenheit(celcius) {
    return (celcius * 1.8) + 32.0;
}

