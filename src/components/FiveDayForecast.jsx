import React, { useState } from "react";
import { useTempUnit } from "../context/TempUnitContext";

const FiveDayForecast = ({ forecast, onDaySelect, convertTemp }) => {
  const { unit } = useTempUnit();
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleDaySelect = (day, index) => {
    setSelectedIndex(index);
    onDaySelect(day);
  };

  return (
    <div className="mt-8">
      <h3 className="text-gray-400 text-lg text-center mb-2">5-Day Forecast</h3>
      <div className="flex lg:justify-center overflow-x-auto space-x-4 pb-4">
        {forecast.map((day, index) => (
          <div
            key={index}
            className={`day-card flex flex-col items-center p-4 bg-gray-800 border border-gray-700 rounded-lg min-w-[100px] cursor-pointer transition-all duration-200 
              hover:bg-gray-700 hover:shadow-lg ${selectedIndex === index ? "shadow-2xl bg-gray-600" : ""}`}
            onClick={() => handleDaySelect(day, index)}
          >
            <h4 className="text-center text-sm font-semibold">
              {new Date(day.dt * 1000).toLocaleDateString("en-US", {
                weekday: "long",
              })}
            </h4>
            <img
              src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
              alt={day.weather[0].description}
              className="w-12 h-12"
            />
            <p className="text-center text-xs">Temp: {convertTemp(day.main.temp).toFixed(1)} °{unit}</p>
            <p className="text-center text-xs text-gray-400">
              {day.weather[0].description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FiveDayForecast;
