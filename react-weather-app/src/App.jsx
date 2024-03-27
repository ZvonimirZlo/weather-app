import { useState } from 'react'
import './App.css'

function App() {

  const [weatherData, setWeatherData] = useState('');

  const getWeatherData = (e) => {
    e.preventDefault();
   fetch(`https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,snow_depth,weather_code,surface_pressure,cloud_cover,visibility,evapotranspiration,wind_speed_10m,wind_speed_80m,wind_speed_120m,wind_speed_180m,wind_direction_10m,wind_direction_80m,wind_direction_120m,wind_direction_180m,wind_gusts_10m,temperature_80m,soil_temperature_0cm,soil_temperature_6cm,soil_temperature_18cm,soil_moisture_0_to_1cm,soil_moisture_1_to_3cm,soil_moisture_3_to_9cm,soil_moisture_9_to_27cm,uv_index,is_day,sunshine_duration&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,daylight_duration,sunshine_duration,uv_index_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant,shortwave_radiation_sum,et0_fao_evapotranspiration`)
     .then(res => res.json())
     .then(data => setWeatherData(data))
  }
  console.log(weatherData);
  return (
    <>
      <button onClick={getWeatherData}>Get Weather Data</button>
      <input type="text" />
      <h3>Temperature: {weatherData?.current?.temperature_2m} °C</h3>
      <h3>apparent_temperature: {weatherData?.current?.apparent_temperature} °C</h3>
      <h3>Pressure: {weatherData?.current?.surface_pressure} hPa</h3>
      <h3>Relative humidity: {weatherData?.current?.relative_humidity_2m} %</h3>
      <h3>Wind speed: {weatherData?.current?.wind_speed_10m} km/h</h3>
      <h3>Rain: {weatherData?.current?.rain} mm</h3>
      <h3>cloud_cover: {weatherData?.current?.cloud_cover} %</h3>
    </>
  )
}

export default App
