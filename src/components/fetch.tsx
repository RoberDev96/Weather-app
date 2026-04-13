import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import sun from '../assets/sun.svg'
import moon from '../assets/moon.svg'



function Fetch() {

  const [location, setLocation] = useState('Matanzas, Cuba');
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);

  interface WeatherResponse {
    resolvedAddress: string;
    address:string
    days: Array<{
    datetime: string;
    temp: number;
    conditions: string;
  }>;
    currentConditions: {
      temp: number;
      conditions: string;
      windspeed: number;
      humidity: number;
      datetime: string; 
    feelslike: number; 
    day:number
    };
  }


  const API_KEY = import.meta.env.VITE_API_KEY;
  const unitGroup = 'metric';

  const handleClick = () => {
    const locations = location;
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(locations)}?unitGroup=${unitGroup}&key=${API_KEY}&contentType=json`;

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setWeatherData(data);
        console.log(data);
        
        
      })
      .catch(error => {
        console.error(`Error fetching data for ${location}:`, error);
      });
  };


  const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

  const change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
  }
  useEffect(() => {
  // Esta función se ejecuta UNA SOLA VEZ al cargar el componente
  const fetchDefaultWeather = () => {
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(location)}?unitGroup=${unitGroup}&key=${API_KEY}&contentType=json`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        setWeatherData(data);
      })
      .catch(error => {
        console.error("Error cargando datos por defecto:", error);
      });
  };

  fetchDefaultWeather();
}, []); 

  return (
    <main className="bg-[#383A4B] h-150 w-96 mt-5 rounded-3xl flex flex-col items-center" >
      <div className="m-6 flex flex-col gap-5">
        <h1 className="text-green-400 font-bold text-2xl text-center">Weather App</h1>
        <div>
          <input type="text" onChange={change} value={location}
            className="h-12 w-75 border p-4 border-transparent 
         bg-[#414453] rounded-xl text-white"/>
          <button className="cursor-pointer relative bottom-11 left-63"
            onClick={handleClick}

          >
            <Icon icon='ooui:article-search' width={40} height={40}
              className="text-[#08FBBA]" />
          </button>

        </div>
      </div>
      <div className="text-center flex flex-col gap-2">
        <p className="text-white font-bold text-2xl">{weatherData?.resolvedAddress.split(',').shift()}</p>
        <p className="text-sm text-white">{weatherData?.resolvedAddress.split(',').pop()}</p>
       
       {weatherData && (
  <p className="text-white">{formatDate(weatherData.days[0].datetime)}</p>
)}
      </div>
      <img src={sun} width={40} height={40} className="mt-9"/>
      <div className="mt-6">
        <p className="text-7xl text-white font-bold">{weatherData?.currentConditions.temp}<span className="text-2xl
        text-green-400">°C</span> </p>
      </div>
      <div className="border-b border-amber-50 w-87.5 mt-2.5"></div>
      <footer className="w-full p-3 mt-5 flex justify-between text-white ">
        <p className="text-center">Humedad <br/>{weatherData?.currentConditions.humidity} % </p>
        <p className="text-center">Viento <br/>{weatherData?.currentConditions.windspeed} km/h</p>
        <p className="text-center">Sensacion <br/>{weatherData?.currentConditions.feelslike} °C </p>
      </footer>
    </main>

  )
}

export default Fetch
