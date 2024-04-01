import { useState, useEffect } from 'react';
import './App.css';
import Select from 'react-select';
import { City, Country } from "country-state-city";

function App() {

  const [weatherData, setWeatherData] = useState('');
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState({});
  const [selectedCity, setSelectedCity] = useState({});

  const getWeatherData = (e) => {
    e.preventDefault();
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${selectedCity?.value?.latitude}&longitude=${selectedCity?.value?.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,rain,visibility,wind_speed_10m&timezone=GMT`)
      .then(res => res.json())
      .then(data => setWeatherData(data))
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

  const handleSelectedCountry = (option) => {
    setSelectedCountry(option);
    setSelectedCity(null);
  };

  const handleSelectedCity = (option) => {
    setSelectedCity(option);
  };

  return (
    <div className='container'>
      <button onClick={getWeatherData}>Get Weather Data</button>
      <Select
        options={countries}
        value={selectedCountry}
        onChange={handleSelectedCountry}
      />

      <Select
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
      {weatherData ? (
        <>
          <h1>{selectedCity?.value?.name}</h1>
          <h3 className='temperature'>{weatherData?.current?.temperature_2m} °C</h3>
          <h3>apparent_temperature: {weatherData?.current?.apparent_temperature} °C</h3>
          <h3>Pressure: {weatherData?.current?.surface_pressure} hPa</h3>
          <h3>Relative humidity: {weatherData?.current?.relative_humidity_2m} %</h3>
          <h3>Wind speed: {weatherData?.current?.wind_speed_10m} km/h</h3>
          <h3>Rain: {weatherData?.current?.rain} mm</h3>
          <h3>cloud_cover: {weatherData?.current?.cloud_cover} %</h3>
        </>
      ) : (
        <p>Select Location</p>
      )}
    </div>
  )
}

export default App
