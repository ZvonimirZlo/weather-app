import { useState, useEffect } from 'react';
import Select from 'react-select';
import { City, Country } from "country-state-city";
import clear from './images/clear.jpg';

function App() {

  const [weatherData, setWeatherData] = useState(null);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState({});
  const [selectedCity, setSelectedCity] = useState({});
  const [bg, setBg] = useState(clear);

  const getWeatherData = () => {
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${selectedCity?.value?.latitude}&longitude=${selectedCity?.value?.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,rain,cloud_cover,surface_pressure,wind_speed_10m&hourly=temperature_2m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,daylight_duration,uv_index_max&timezone=GMT`)
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
    <div className="app" style={{backgroundImage: `url(${bg})`}}>
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

        <button onClick={getWeatherData}>Get Weather</button>
        <div className="data">
          {weatherData ? (
            <>
              <h2>{selectedCity?.value?.name}</h2>
              <h4 className='temperature'>{weatherData?.current?.temperature_2m} °C</h4>
              <h4>Feels Like: {weatherData?.current?.apparent_temperature} °C</h4>
              <h4>Min: {weatherData?.daily?.temperature_2m_min[0]} °C</h4>
              <h4>Max: {weatherData?.daily?.temperature_2m_max[0]} °C</h4>
              <h4>Pressure: {weatherData?.current?.surface_pressure} hPa</h4>
              <h4>Relative humidity: {weatherData?.current?.relative_humidity_2m} %</h4>
              <h4>Wind speed: {weatherData?.current?.wind_speed_10m} km/h</h4>
              <h4>UV Index: {weatherData?.daily?.uv_index_max[0]}</h4>
              <h4>Rain: {weatherData?.current?.rain} mm</h4>
              <h4>Cloud Cover: {weatherData?.current?.cloud_cover} %</h4>
            </>
          ) : (false)}
        </div>
      </div>
    </div>
  )

}


export default App
