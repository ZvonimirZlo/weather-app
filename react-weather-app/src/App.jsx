import { useState, useEffect } from 'react';
import Select from 'react-select';
import { City, Country } from "country-state-city";
import clear from './images/clear.jpg';
import overcast from './images/overcast.jpg';
import fog from './images/fog.jpg';
import drizzle from './images/drizzle.jpg';
import rain from './images/rain.jpg';
import freezingRain from './images/freezingRain.jpg';
import snow from './images/snow.jpg';
import thunderstorm from './images/thunderstorm.jpg';


function App() {

  const [weatherData, setWeatherData] = useState('');
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState({});
  const [selectedCity, setSelectedCity] = useState({});
  const [bg, setBg] = useState(thunderstorm);
  const [description, setDescription] = useState('');

  //fetching api
  const getWeatherData = () => {
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${selectedCity?.value?.latitude}&longitude=${selectedCity?.value?.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,rain,cloud_cover,surface_pressure,wind_speed_10m&hourly=temperature_2m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,daylight_duration,uv_index_max&timezone=GMT`)
      .then(res => res.json())
      .then(data => setWeatherData(data))
      .catch(error => console.log(error))
  }
  console.log(weatherData);

  useEffect(() => {
    setCountries(
      Country.getAllCountries().map((country) => ({
        value: {
          name: country.name,
          latitude: country.latitude,
          longitude: country.longitude,
          isoCode: country.isoCode,
        },
        label: country.name,
      }))
    );
  }, []);

  //handling country options
  const handleSelectedCountry = (option) => {
    setSelectedCountry(option);
  };

  //handling city options
  const handleSelectedCity = (option) => {
    setSelectedCity(option);
  };


  //changing background image depending on WMO code
  useEffect(() => {
    const changeBg = () => {
      let code = weatherData?.current?.weather_code;
      if (code === 0) {
        setBg(clear);
        setDescription('Clear')
      } else if (code >= 1 && code <= 3) {
        setBg(overcast);
        setDescription('Partly cloudy, overcast');
      } else if (code >= 45 && code <= 48) {
        setBg(fog);
        setDescription('Fog')
      } else if (code >= 51 && code <= 55) {
        setBg(drizzle);
        setDescription('Drizzle')
      } else if (code >= 56 && code <= 57) {
        setBg(freezingRain);
        setDescription('Freezing Drizzle')
      } else if (code >= 61 && code <= 65) {
        setBg(rain);
        setDescription('Rain')
      } else if (code >= 66 && code <= 67) {
        setBg(freezingRain);
        setDescription('Freezing Rain');
      } else if (code >= 71 && code <= 77) {
        setBg(snow);
        setDescription('Snow')
      } else if (code >= 80 && code <= 82) {
        setBg(rain);
        setDescription('Rain showers')
      } else if (code >= 85 && code <= 86) {
        setBg(snow);
        setDescription('Snow showers')
      } else {
        setBg(thunderstorm);
        setDescription('Thunderstorm')
      }
    }
    changeBg()
  }, [weatherData]);


  return (
    <>
      <div className="app" style={{ backgroundImage: `url(${bg})` }}>
        <div className='container'>
          <Select
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                borderColor: state.isFocused ? 'white' : 'rgb(16, 105, 98)',
                backgroundColor: 'black',
                fontWeight: 'bold',
                borderRadius: '10px',
              }),
            }}
            options={countries}
            value={selectedCountry}
            onChange={handleSelectedCountry}
          />

          <Select
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                borderColor: state.isFocused ? 'white' : 'rgb(16, 105, 98)',
                backgroundColor: 'black',
                fontWeight: 'bold',
                borderRadius: '10px',
              }),
            }}
            options={City.getCitiesOfCountry(
              selectedCountry?.value?.isoCode
            ).map((city) => ({
              value: {
                latitude: city.latitude,
                longitude: city.longitude,
                name: city.name,
              },
              label: city.name,
            }))}
            value={selectedCity}
            onChange={handleSelectedCity}
          />

          {/* on click rendering weather data on the screen */}
          <button onClick={getWeatherData}>Get Weather</button>

          <div className="data">
            {weatherData ? (
              <div>
                <h2>{selectedCity?.value?.name}</h2>
                <p className='temperature'>{weatherData?.current?.temperature_2m} °C </p>
                <h2>{description}</h2>
                <br></br>
                <p className='min'>Min: {weatherData?.daily?.temperature_2m_min[0]} °C</p>
                <p className='max'>Max: {weatherData?.daily?.temperature_2m_max[0]} °C</p>
                <p>Feels Like: {weatherData?.current?.apparent_temperature} °C</p>
                <p>Pressure: {weatherData?.current?.surface_pressure} hPa</p>
                <p>Relative humidity: {weatherData?.current?.relative_humidity_2m} %</p>
                <p>Wind speed: {weatherData?.current?.wind_speed_10m} km/h</p>
                <p>UV Index: {weatherData?.daily?.uv_index_max[0]}</p>
                <p>Rain: {weatherData?.current?.rain} mm</p>
                <p>Cloud Cover: {weatherData?.current?.cloud_cover} %</p>
              </div>
            ) : (false)}
          </div>
        </div>
      
      <footer className="footer">©2024 Made by ZvonimirZlo
        <a href={`https://github.com/ZvonimirZlo`} rel='noopener noreferer'>
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="25" fill="white" viewBox="0 0 16 16">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
          </svg>
        </a></footer>
        </div>
  </>
  )

}


export default App
