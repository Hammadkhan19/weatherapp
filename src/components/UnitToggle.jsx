import React from "react";
import { useTempUnit } from "../context/TempUnitContext";

const UnitToggle = () => {
  const { unit, changeUnit } = useTempUnit();

  return (
    <div className="flex  justify-center space-x-2 p-2 bg-gray-800 rounded-full w-44">
       
      <button
        onClick={() => changeUnit("C")}
        className={`px-4 py-2 rounded-full transition-colors duration-200 ${
          unit === "C" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"
        }`}
      >
        °C
      </button>
      <button
        onClick={() => changeUnit("F")}
        className={`px-4 py-2 rounded-full transition-colors duration-200 ${
          unit === "F" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"
        }`}
      >
        °F
      </button>
      <button
        onClick={() => changeUnit("K")}
        className={`px-4 py-2 rounded-full transition-colors duration-200 ${
          unit === "K" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"
        }`}
      >
        K
      </button>
    </div>
  );
};

export default UnitToggle;
