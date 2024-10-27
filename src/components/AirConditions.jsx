import React from "react";
import { useTempUnit } from "../context/TempUnitContext";
const AirConditions = ({ Air, convertTemp }) => {
  const { unit } = useTempUnit();
  return (
    <div className="mt-10 p-4 bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-gray-400 text-lg mb-4">Air Conditions</h2>
      {Air && (
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-gray-400 text-sm">Temperature:</span>
            <span className="text-white text-lg">{convertTemp(Air.main.temp).toFixed(1)} °{unit}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-400 text-sm">Wind:</span>
            <span className="text-white text-lg">{Air.wind.speed} mph</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-400 text-sm">Feels Like:</span>
            <span className="text-white text-lg">{convertTemp(Air.main.feels_like).toFixed(1)} °{unit}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-400 text-sm">Humidity:</span>
            <span className="text-white text-lg">{Air.main.humidity} %</span>

          </div>
          <div className="flex flex-col">
            <span className="text-gray-400 text-sm">Gust:</span>
            <span className="text-white text-lg">
              {Air?.wind?.gust ? `${Air.wind.gust} mph` : "0 mph"}
            </span>


          </div>
          <div className="flex flex-col">
            <span className="text-gray-400 text-sm">Degree:</span>
            <span className="text-white text-lg">{Air.wind.deg}°</span>

          </div>
        </div>
      )}
    </div>
  );
};

export default AirConditions;
