import React, { useState, useEffect } from "react";
import "../styles/MainContainer.css"; // Import the CSS file for MainContainer
import WeatherCard from "./WeatherCard";

function MainContainer(props) {

  function formatDate(daysFromNow = 0) {
    let output = "";
    var date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    output += date.toLocaleString("en-US", { weekday: "long" }).toUpperCase();
    output += " " + date.getDate();
    return output;
  }

  /*
  STEP 1: IMPORTANT NOTICE!

  Before you start, ensure that both App.js and SideContainer.js are complete. The reason is MainContainer 
  is dependent on the city selected in SideContainer and managed in App.js. You need the data to flow from 
  App.js to MainContainer for the selected city before making an API call to fetch weather data.
  */
  
  /*
  STEP 2: Manage Weather Data with State.
  
  Just like how we managed city data in App.js, we need a mechanism to manage the weather data 
  for the selected city in this component. Use the 'useState' hook to create a state variable 
  (e.g., 'weather') and its corresponding setter function (e.g., 'setWeather'). The initial state can be 
  null or an empty object.
  */

  const [weather, setWeather] = useState(null);
  let lat = props.selectedCity ? props.selectedCity.lat : 0;
  let lon = props.selectedCity ? props.selectedCity.lon : 0;
  
  
  /*
  STEP 3: Fetch Weather Data When City Changes.
  
  Whenever the selected city (passed as a prop) changes, you should make an API call to fetch the 
  new weather data. For this, use the 'useEffect' hook.

  The 'useEffect' hook lets you perform side effects (like fetching data) in functional components. 
  Set the dependency array of the 'useEffect' to watch for changes in the city prop. When it changes, 
  make the API call.

  After fetching the data, use the 'setWeather' function from the 'useState' hook to set the weather data 
  in your state.
  */
useEffect( () => {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${props.apiKey}&units=imperial`)
    .then((response) => response.json())
    .then((forecastData) => {
      let upcomingMaxWeatherData = [];
		  let upcomingMinWeatherData = [];
      let weatherIconsInfo = [];
		  for (let i = 0; i < 6; i++) {
        upcomingMaxWeatherData.push(forecastData.list[i].main.temp_max);
		  	upcomingMinWeatherData.push(forecastData.list[i].main.temp_min);
		  	weatherIconsInfo.push(forecastData.list[i].weather[0].icon);
      }
      let weatherData = {
        currentWeather: forecastData.list[0].main.temp,
        upcomingMaxWeather: upcomingMaxWeatherData,
        upcomingMinWeather: upcomingMinWeatherData,
        weatherIcons: weatherIconsInfo,
      }
      setWeather(weatherData);
      console.log(weatherData);
    })
    .catch(() => {
      console.log("error fetching data!");
    })
 }, [props.selectedCity]);

 // maybe use a useEffect to prevent stuff from happening until selectedCity is now defined
 
  
  return (
    <div id="main-container">
      <div id="weather-container">
        {/* 
        STEP 4: Display Weather Data.
        
        With the fetched weather data stored in state, use conditional rendering (perhaps the ternary operator) 
        to display it here. Make sure to check if the 'weather' state has data before trying to access its 
        properties to avoid runtime errors. 

        Break down the data object and figure out what you want to display (e.g., temperature, weather description).
        This is a good section to play around with React components! Create your own - a good example could be a WeatherCard
        component that takes in props, and displays data for each day of the week.
        */}
        {weather && 
          <WeatherCard></WeatherCard>

        }
        
        <p> {props.selectedCity} </p>
      </div>
    </div>
  );
}


export default MainContainer;

