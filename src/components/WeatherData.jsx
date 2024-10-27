import axios from "axios";
import React, { useEffect, useState } from "react";
import Searchbar from "./Searchbar";
import HourlyForecast from "./HourlyForcast";
import AirConditions from "./AirConditions";
import FiveDayForecast from "./FiveDayForecast";
import { useTempUnit } from "../context/TempUnitContext";
import UnitToggle from "./UnitToggle";


const WeatherData = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [fiveDayForecast, setFiveDayForecast] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [timezoneOffset, setTimezoneOffset] = useState(0);
  const [coords, setCoords] = useState({ lat: null, lon: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { unit } = useTempUnit();

  const apiKey = import.meta.env.VITE_API_KEY;

  const convertTemp = (temp) => {
    if (unit === "F") return (temp * 9) / 5 + 32;
    if (unit === "K") return temp + 273.15;
    return temp;
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );
      setWeather(response.data);
      setLoading(false);
    } catch (error) {
      console.log("Error fetching weather data by coordinates:", error);
      setLoading(false);
      setError("Failed to fetch weather data.");
    }
  };

  const fetchHourlyByCoords = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );
      const forecastList = response.data.list;
      const timezoneOffset = response.data.city.timezone;
      setTimezoneOffset(timezoneOffset);

      const dailyForecast = forecastList.filter((entry) =>
        entry.dt_txt.includes("12:00:00")
      );
      const adjustedHourlyForecast = forecastList.map((entry) => {
        const localTime = new Date((entry.dt + timezoneOffset) * 1000);
        return {
          ...entry,
          localTime: localTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
      });

      setHourlyForecast(adjustedHourlyForecast.slice(0, 8));
      setFiveDayForecast(dailyForecast);
    } catch (error) {
      console.log("Error fetching forecast data by coordinates:", error);
      setError("Failed to fetch hourly forecast.");
    }
  };

  // Request user's current location
  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setCoords({ lat: latitude, lon: longitude });
            fetchWeatherByCoords(latitude, longitude);
            fetchHourlyByCoords(latitude, longitude);
          },
          (error) => {
            console.log("Error obtaining location:", error);
            setLoading(false);
            setError("Location access denied. Please select a city Manually.");
          }
        );
      } else {
        setLoading(false);
        setError("Geolocation is not supported by this browser.");
      }
    };

    getLocation();
  }, []);

  const handleCitySelect = (selectedCity) => {
    setCity(selectedCity.name);
    fetchWeather(selectedCity.name);
    fetchHourly(selectedCity.name);
    setError(null);
  };

  const handleDaySelect = (day) => {
    setWeather({
      ...weather,
      main: {
        temp: day.main.temp,
        feels_like: day.main.feels_like,
        humidity: day.main.humidity,
      },
      weather: day.weather,
    });
    setSelectedDay(
      new Date(day.dt * 1000).toLocaleDateString("en-US", { weekday: "long" })
    );
  };

  const handleHourSelect = (hour) => {
    setWeather((prev) => ({
      ...prev,
      main: {
        ...prev.main,
        temp: hour.main.temp,
        feels_like: hour.main.feels_like,
        humidity: hour.main.humidity,
      },
      weather: hour.weather,
    }));
  };

  return (
    <div className="mx-5 md:mx-20 mt-10">
      <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-4">
        <h3 className="font-semibold text-left sm:ml-5">Change Unit</h3>
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <UnitToggle />
          <Searchbar selectedCity={handleCitySelect} />
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-400 mt-5">Loading weather data...</p>
      ) : error ? (
        <p className="text-center text-red-500 mt-5">{error}</p>
      ) : weather ? (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-gray-800 text-white p-5 rounded-lg shadow-lg mt-5">
          <div className="md:w-2/3 text-left">
            <h2 className="text-3xl sm:text-4xl font-bold">{weather.name}</h2>
            <p className="text-sm text-gray-400">
              {weather.weather[0].description}
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2">
              {convertTemp(weather.main.temp).toFixed(1)} °{unit}
            </h2>
            <p className="text-sm mt-3 text-gray-400">
              Feels like: {convertTemp(weather.main.feels_like).toFixed(1)} °{unit}
            </p>
            {selectedDay && (
              <p className="text-sm text-gray-400 mt-2">{selectedDay}</p>
            )}
          </div>
          <img
            src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
            alt={weather.weather[0].description}
            className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-contain mt-5 md:mt-0 ml-auto"
          />
        </div>
      ) : (
        <p className="text-center text-gray-400 mt-5">
          Please select a city to view weather data.
        </p>
      )}

      {weather && (
        <>
          <HourlyForecast
            convertTemp={convertTemp}
            forecast={hourlyForecast}
            onhourSelect={handleHourSelect}
            timezoneOffset={timezoneOffset}
          />
          <FiveDayForecast
            convertTemp={convertTemp}
            forecast={fiveDayForecast}
            onDaySelect={handleDaySelect}
          />
          <AirConditions convertTemp={convertTemp} Air={weather} />
        </>
      )}
    </div>
  );
};

export default WeatherData;
