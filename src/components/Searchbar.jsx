import axios from "axios";
import React, { useEffect, useState } from "react";

const Searchbar = ({ selectedCity }) => {
  const [inputvalue, setInputvalue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const apiKey = import.meta.env.VITE_API_KEY;

  const fetchcities = async (query) => {
    if (!query) return;
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`
      );
      setSuggestions(response.data || []);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching city suggestions:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timerid = setTimeout(() => {
      if (inputvalue) fetchcities(inputvalue);
    }, 500);
    return () => clearTimeout(timerid);
  }, [inputvalue]);

  const handleselect = (city) => {
    setInputvalue(city.name);
    setSuggestions([]);
    selectedCity(city);
    setInputvalue("");
  };

  return (
    <div className="flex justify-center items-center py-4">
      <div className="relative  w-full max-w-md"> 
        <input
          className="w-full p-3 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          value={inputvalue}
          onChange={(e) => setInputvalue(e.target.value)}
          placeholder="Search for cities"
        />
        {isLoading && (
          <div className="absolute right-3 top-3 text-gray-400">Loading...</div>
        )}
        {suggestions.length > 0 && (
          <ul className="absolute z-10 w-full bg-gray-800 text-white shadow-lg rounded-lg mt-1">
            {suggestions.map((city, index) => (
              <li
                key={index}
                className="p-3 hover:bg-blue-600 cursor-pointer"
                onClick={() => handleselect(city)}
              >
                {city.name}, {city.country}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Searchbar;
