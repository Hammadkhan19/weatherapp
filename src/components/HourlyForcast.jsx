import React, { useState } from "react";
import { useTempUnit } from "../context/TempUnitContext";

const HourlyForecast = ({ forecast, onhourSelect, convertTemp, timezoneOffset }) => {
  const { unit } = useTempUnit();
  const [selectedHour, setSelectedHour] = useState(null);

  // Adjust the time based on timezone offset
  const formatTime = (timestamp) => {
    // Convert the timezone offset from seconds to milliseconds
    const localTimestamp = (timestamp + timezoneOffset) * 1000; // Convert to milliseconds
    const date = new Date(localTimestamp);

    // Extract hours and minutes
    const hours = date.getUTCHours(); // Use getUTCHours() to avoid issues with local timezone
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;

    return `${formattedHours}:${minutes} ${period}`;
  };

  const handleCardClick = (hourData) => {
    setSelectedHour(hourData.dt);
    onhourSelect(hourData);
  };

  return (
    <div className="mt-10">
      <h2 className="text-gray-400 text-lg text-center mb-2">Today's Forecast</h2>
      <div className="flex lg:justify-center overflow-x-auto space-x-4 pb-4">
        {forecast.map((hourData, index) => (
          <div
            key={index}
            className={`border border-gray-700 bg-gray-800 p-3 rounded-lg min-w-[100px] cursor-pointer transition-all duration-200 
              flex flex-col items-center justify-center h-[160px] max-w-[120px]
              ${selectedHour === hourData.dt ? "shadow-2xl bg-gray-700" : ""}
            `}
            onClick={() => handleCardClick(hourData)}
          >
            <h3 className="text-center text-sm font-semibold">{formatTime(hourData.dt)}</h3>
            <p className="text-center text-xs">Temp: {convertTemp(hourData.main.temp).toFixed(1)} °{unit}</p>
            <p className="text-center text-xs text-gray-400">{hourData.weather[0].description}</p>
            <img
              src={`http://openweathermap.org/img/wn/${hourData.weather[0].icon}.png`}
              alt={hourData.weather[0].description}
              className="w-10 h-10 mx-auto"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourlyForecast;
