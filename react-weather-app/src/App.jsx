import { useState, useEffect } from 'react';
import Select from 'react-select';
import { City, Country } from "country-state-city";
import clear from './images/clear.jpg';
import overcast from './images/overcast.jpg';
import fog from './images/fog.jpg';
import drizzle from './images/drizzle.jpg';
import rain from './images/rain.jpg';
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
  }
  // console.log(weatherData);

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
        setBg(fog)
      } else if (code >= 51 && code <= 67) {
        setBg(drizzle)
      } else if (code >= 61 && code <= 67) {
        setBg(rain)
      } else if (code >= 71 && code <= 77) {
        setBg(snow)
      } else if (code >= 80 && code <= 86) {
        setBg(rain)
      } else {
        setBg(thunderstorm)
      }
    }
    changeBg()
  }, [weatherData]);


  return (
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
            <>
              <h2>{selectedCity?.value?.name}</h2>
              <p className='temperature'>{weatherData?.current?.temperature_2m} °C </p>
              <h2>{description}</h2>
              <br></br>
              <p>Feels Like: {weatherData?.current?.apparent_temperature} °C</p>
              <p>Min: {weatherData?.daily?.temperature_2m_min[0]} °C</p>
              <p>Max: {weatherData?.daily?.temperature_2m_max[0]} °C</p>
              <p>Pressure: {weatherData?.current?.surface_pressure} hPa</p>
              <p>Relative humidity: {weatherData?.current?.relative_humidity_2m} %</p>
              <p>Wind speed: {weatherData?.current?.wind_speed_10m} km/h</p>
              <p>UV Index: {weatherData?.daily?.uv_index_max[0]}</p>
              <p>Rain: {weatherData?.current?.rain} mm</p>
              <p>Cloud Cover: {weatherData?.current?.cloud_cover} %</p>
            </>
          ) : (false)}
        </div>
      </div>
    </div>
  )

}


export default App
